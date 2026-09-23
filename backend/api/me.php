<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/jwt.php';

$userData = JWTHandler::getAuthUser();

if (!$userData) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

http_response_code(200);
echo json_encode(["user" => $userData]);