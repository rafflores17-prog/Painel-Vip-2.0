<?php
// Libera o acesso para o Vercel
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = $_GET['url'] ?? '';

if (!$url) {
    echo json_encode(["status" => "erro"]);
    exit;
}

// Configuração de teste real
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_NOBODY, true); // Não baixa o vídeo, só testa o link
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5); // Espera 5 segundos
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Se o servidor responder 200 OK, a lista está viva
if ($code == 200) {
    echo json_encode(["status" => "online"]);
} else {
    echo json_encode(["status" => "offline"]);
}
