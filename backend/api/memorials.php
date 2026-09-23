<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/jwt.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Public or authenticated list of memorials
    $stmt = $pdo->query("SELECT * FROM memorials WHERE status = 'published' ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit();
}

// POST requires authenticated user
$user = JWTHandler::getAuthUser();
if (!$user) {
    http_response_code(401);
    echo json_encode(["error" => "Login required to create a memorial"]);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $stmt = $pdo->prepare("INSERT INTO memorials (user_id, deceased_name, date_of_birth, date_of_death, biography, photo_url) 
                           VALUES (:uid, :name, :dob, :dod, :bio, :photo)");
    $stmt->execute([
        ':uid'   => $user['id'],
        ':name'  => $data['deceasedName'] ?? '',
        ':dob'   => $data['dateOfBirth'] ?? null,
        ':dod'   => $data['dateOfDeath'] ?? date('Y-m-d'),
        ':bio'   => $data['biography'] ?? '',
        ':photo' => $data['photoUrl'] ?? ''
    ]);

    http_response_code(201);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    exit();
}