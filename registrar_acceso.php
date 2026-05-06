<?php
require_once 'config/db.php';
header('Content-Type: application/json');

$data     = json_decode(file_get_contents('php://input'), true);
$placa    = strtoupper(trim($data['placa'] ?? ''));
$movimiento = trim($data['movimiento'] ?? '');

if (!$placa || !$movimiento) {
    echo json_encode(["success" => false, "mensaje" => "Datos incompletos"]);
    exit;
}

// Verificar si el vehículo está registrado y activo
$check = $conn->prepare("SELECT id_vehiculo FROM vehiculos WHERE placa = ? AND estado = 'activo'");
$check->bind_param("s", $placa);
$check->execute();
$res = $check->get_result();
$check->close();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "mensaje" => "Placa no registrada o inactiva"]);
    exit;
}

$veh = $res->fetch_assoc();
$id_vehiculo = $veh['id_vehiculo'];

// Registrar en tabla accesos
$stmt = $conn->prepare("
    INSERT INTO accesos (id_vehiculo, fecha, hora, movimiento, metodo)
    VALUES (?, CURDATE(), CURTIME(), ?, 'manual')
");
$stmt->bind_param("is", $id_vehiculo, $movimiento);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "Acceso registrado", "placa" => $placa, "movimiento" => $movimiento]);
} else {
    echo json_encode(["success" => false, "mensaje" => "Error al registrar"]);
}

$stmt->close();
$conn->close();
?>