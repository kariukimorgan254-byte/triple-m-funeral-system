<?php
define('JWT_SECRET', 'change-this-to-a-very-long-random-secret-key-12345');

class JWTHandler {
    public static function generateToken($payload, $expirySeconds = 86400) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['exp'] = time() + $expirySeconds;
        $payload['iat'] = time();
        $payloadEncoded = json_encode($payload);

        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payloadEncoded));

        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", JWT_SECRET, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return "$base64Header.$base64Payload.$base64Signature";
    }

    public static function validateToken($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        list($header64, $payload64, $signature64) = $parts;

        $expectedSig = hash_hmac('sha256', "$header64.$payload64", JWT_SECRET, true);
        $expectedSig64 = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSig));

        if (!hash_equals($expectedSig64, $signature64)) return null;

        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload64)), true);
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Expired
        }

        return $payload;
    }

    public static function getAuthUser() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return self::validateToken($matches[1]);
        }
        return null;
    }
}