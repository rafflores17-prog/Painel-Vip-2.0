<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Recebe parâmetros
$host = isset($_GET['host']) ? $_GET['host'] : '';
$user = isset($_GET['user']) ? $_GET['user'] : '';
$pass = isset($_GET['pass']) ? $_GET['pass'] : '';

if(empty($host) || empty($user) || empty($pass)){
    echo json_encode([
        "online" => false,
        "erro" => "Parametros incompletos",
        "tempo" => null,
        "statusReal" => "Erro"
    ]);
    exit;
}

// Monta URL da API
$url = rtrim($host, '/') . "/player_api.php?username=" . urlencode($user) . "&password=" . urlencode($pass);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
]);

$start = microtime(true);
$response = curl_exec($ch);
$tempo = round((microtime(true) - $start) * 1000);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Se falhou, tenta via XTREAM API alternativa
if($httpCode != 200 || !$response || $curlError){
    // Tenta URL alternativa (alguns servidores usam porta diferente)
    $url2 = rtrim($host, '/') . ":8080/player_api.php?username=" . urlencode($user) . "&password=" . urlencode($pass);

    $ch2 = curl_init();
    curl_setopt_array($ch2, [
        CURLOPT_URL => $url2,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'Mozilla/5.0'
    ]);

    $response2 = curl_exec($ch2);
    $httpCode2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    curl_close($ch2);

    if($httpCode2 == 200 && $response2){
        $response = $response2;
        $httpCode = $httpCode2;
    }
}

// Parse resposta
if($httpCode == 200 && $response){
    $data = json_decode($response, true);

    if(isset($data['user_info'])){
        $info = $data['user_info'];

        echo json_encode([
            "online" => true,
            "tempo" => $tempo,
            "statusReal" => $info['status'] ?? "Active",
            "exp_date" => isset($info['exp_date']) && $info['exp_date'] != "null" ? intval($info['exp_date']) : null,
            "active_cons" => intval($info['active_cons'] ?? 0),
            "max_connections" => intval($info['max_connections'] ?? 1),
            "auth" => $info['auth'] ?? true,
            "created_at" => $info['created_at'] ?? null,
            "is_trial" => $info['is_trial'] ?? "0",
            "canais" => isset($data['categories']) ? count(array_filter($data['categories'], function($c){ return ($c['category_type'] ?? '') === 'live'; })) : null,
            "filmes" => isset($data['categories']) ? count(array_filter($data['categories'], function($c){ return ($c['category_type'] ?? '') === 'movie'; })) : null,
            "series" => isset($data['categories']) ? count(array_filter($data['categories'], function($c){ return ($c['category_type'] ?? '') === 'series'; })) : null
        ]);
        exit;
    }
}

// Falha
echo json_encode([
    "online" => false,
    "tempo" => $tempo,
    "statusReal" => "Offline",
    "erro" => $curlError ?: "Servidor nao respondeu",
    "httpCode" => $httpCode
]);
?>