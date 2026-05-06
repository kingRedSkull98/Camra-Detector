<?php
require_once 'config/db.php';
header('Content-Type: application/json');

$eventos = [];

// 1. Eventos de vehículos REGISTRADOS (tabla accesos)
$stmt1 = $conn->prepare("
    SELECT 
        v.placa,
        a.fecha,
        a.hora,
        a.movimiento,
        a.foto_placa,
        a.metodo,
        'registrado' AS origen
    FROM accesos a
    JOIN vehiculos v ON a.id_vehiculo = v.id_vehiculo
    ORDER BY a.fecha DESC, a.hora DESC
    LIMIT 100
");
$stmt1->execute();
$res1 = $stmt1->get_result();
while ($fila = $res1->fetch_assoc()) {
    $fila['estado_label'] = $fila['metodo'] === 'manual' ? '🔐 Por seguridad' : '✅ Autorizado';
    $fila['clase_css']    = $fila['metodo'] === 'manual' ? 'pendiente' : 'autorizado';
    $fila['whatsapp_enviado'] = '📲 Enviado';
    $eventos[] = $fila;
}
$stmt1->close();

// 2. Eventos de vehículos NO REGISTRADOS (tabla eventos_no_registrados)
$stmt2 = $conn->prepare("
    SELECT 
        placa,
        fecha,
        hora,
        movimiento,
        foto_placa,
        estado,
        'no_registrado' AS origen
    FROM eventos_no_registrados
    ORDER BY fecha DESC, hora DESC
    LIMIT 100
");
$stmt2->execute();
$res2 = $stmt2->get_result();
while ($fila = $res2->fetch_assoc()) {
    if ($fila['estado'] === 'autorizado_manual') {
        $fila['estado_label'] = '🔐 Por seguridad';
        $fila['clase_css']    = 'pendiente';
        $fila['whatsapp_enviado'] = '—';
    } else {
        $fila['estado_label'] = '❌ No registrada';
        $fila['clase_css']    = 'no-registrado';
        $fila['whatsapp_enviado'] = '—';
    }
    $eventos[] = $fila;
}
$stmt2->close();

// Ordenar todo por fecha y hora descendente
usort($eventos, function($a, $b) {
    return strcmp($b['fecha'] . $b['hora'], $a['fecha'] . $a['hora']);
});

echo json_encode(array_slice($eventos, 0, 100));

$conn->close();
?>