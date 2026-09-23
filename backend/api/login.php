<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/jwt.php';

$pdo = getDB();
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password are required."]);
    exit();
}

// 1. Check brute-force lockout (5 failed attempts in 15 mins)
$stmt = $pdo->prepare("SELECT COUNT(*) as failed FROM login_attempts 
                       WHERE (ip_address = :ip OR email = :email) 
                       AND was_successful = 0 
                       AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
$stmt->execute([':ip' => $ip, ':email' => $email]);
if ($stmt->fetch()['failed'] >= 5) {
    http_response_code(429);
    echo json_encode(["error" => "Too many failed attempts. Please try again in 15 minutes."]);
    exit();
}

// 2. Query user
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

// 3. Verify password
if ($user && password_verify($password, $user['password_hash'])) {
    if (!$user['is_active']) {
        http_response_code(403);
        echo json_encode(["error" => "Account is deactivated."]);
        exit();
    }

    // Record success
    $stmt = $pdo->prepare("INSERT INTO login_attempts (ip_address, email, was_successful) VALUES (:ip, :email, 1)");
    $stmt->execute([':ip' => $ip, ':email' => $email]);

    // Generate JWT token
    $token = JWTHandler::generateToken([
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'firstName' => $user['first_name'],
        'lastName' => $user['last_name']
    ]);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "token" => $token,
        "user" => [
            "id" => (string)$user['id'],
            "email" => $user['email'],
            "firstName" => $user['first_name'],
            "lastName" => $user['last_name'],
            "role" => $user['role']
        ]
    ]);
} else {
    // Record failed attempt
    $stmt = $pdo->prepare("INSERT INTO login_attempts (ip_address, email, was_successful) VALUES (:ip, :email, 0)");
    $stmt->execute([':ip' => $ip, ':email' => $email]);

    http_response_code(401);
    echo json_encode(["error" => "Invalid email or password."]);
}