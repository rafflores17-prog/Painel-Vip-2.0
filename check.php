<?php
header('Content-Type: application/json');

$host = $_GET['host'];
$user = $_GET['user'];
$pass = $_GET['pass'];

$url = "$host/player_api.php?username=$user&password=$pass";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$time = curl_getinfo($ch, CURLINFO_TOTAL_TIME);

curl_close($ch);

if($httpCode == 200 && $response){
    echo json_encode([
        "online" => true,
        "tempo" => round($time * 1000)
    ]);
} else {
    echo json_encode([
        "online" => false,
        "tempo" => null
    ]);
}
?>
