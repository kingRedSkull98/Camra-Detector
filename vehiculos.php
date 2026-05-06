<?php
require_once 'config/db.php';
header('Content-Type: application/json');

// Trae vehículos junto con datos del propietario desde tu BD
$stmt = $conn->prepare("
    SELECT 
        v.placa,
        v.marca,
        v.linea,
        v.tipo_vehiculo,
        v.color,
        v.estado,
        u.cedula AS cedula_usuario,
        u.nombre,
        u.tipo_usuario,
        u.programa,
        u.fecha_fin
    FROM vehiculos v
    LEFT JOIN usuarios u ON v.cedula_usuario = u.cedula
    ORDER BY v.fecha_registro DESC
");

$stmt->execute();
$result = $stmt->get_result();

$vehiculos = [];
while ($fila = $result->fetch_assoc()) {
    $vehiculos[] = $fila;
}

echo json_encode($vehiculos);

$stmt->close();
$conn->close();
?>