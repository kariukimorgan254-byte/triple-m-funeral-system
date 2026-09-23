<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$pdo = getDB();
$data = json_decode(file_get_contents("php://input"), true);

$email     = trim($data['email'] ?? '');
$password  = $data['password'] ?? '';
$firstName = trim($data['firstName'] ?? 'Super');
$lastName  = trim($data['lastName'] ?? 'Admin');
$role      = $data['role'] ?? 'admin';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password are required."]);
    exit();
}

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password_hash, role) 
                       VALUES (:fn, :ln, :email, :hash, :role)
                       ON DUPLICATE KEY UPDATE password_hash = :hash2");
$stmt->execute([
    ':fn'    => $firstName,
    ':ln'    => $lastName,
    ':email' => $email,
    ':hash'  => $hash,
    ':role'  => $role,
    ':hash2' => $hash
]);

http_response_code(200);
echo json_encode(["success" => true, "message" => "User account created/updated successfully!"]);