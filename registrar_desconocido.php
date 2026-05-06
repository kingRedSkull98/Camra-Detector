<?php
require_once 'config/db.php';
header('Content-Type: application/json');

$data   = json_decode(file_get_contents('php://input'), true);
$placa  = strtoupper(trim($data['placa'] ?? ''));
$motivo = trim($data['motivo'] ?? '');
$nombre = trim($data['nombre'] ?? '');
$cedula = trim($data['cedula'] ?? '');

if (!$placa) {
    echo json_encode(["success" => false, "mensaje" => "Placa requerida"]);
    exit;
}

// Registrar en eventos_no_registrados con estado denegado
$stmt = $conn->prepare("
    INSERT INTO eventos_no_registrados 
    (nombre, cedula, placa, fecha, hora, movimiento, estado, observaciones)
    VALUES (?, ?, ?, CURDATE(), CURTIME(), 'entrada', 'denegado', ?)
");
$stmt->bind_param("ssss", $nombre, $cedula, $placa, $motivo);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "Placa desconocida registrada"]);
} else {
    echo json_encode(["success" => false, "mensaje" => "Error al registrar"]);
}

$stmt->close();
$conn->close();
?>