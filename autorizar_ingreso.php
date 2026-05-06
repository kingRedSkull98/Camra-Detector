<?php
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $placa   = strtoupper(trim($_POST['placa']));
    $motivo  = trim($_POST['motivo'] ?? '');
    $guardia = trim($_POST['guardia']);

    // Buscar id del guardia en tabla seguridad
    $stmtG = $conn->prepare("SELECT id_seguridad FROM seguridad WHERE nombre = ? AND estado = 'activo'");
    $stmtG->bind_param("s", $guardia);
    $stmtG->execute();
    $resG = $stmtG->get_result();
    $id_seguridad = null;

    if ($row = $resG->fetch_assoc()) {
        $id_seguridad = $row['id_seguridad'];
    }
    $stmtG->close();

    // Registrar en eventos_no_registrados
    $stmt = $conn->prepare("
        INSERT INTO eventos_no_registrados 
        (placa, fecha, hora, movimiento, estado, observaciones, id_seguridad)
        VALUES (?, CURDATE(), CURTIME(), 'entrada', 'autorizado_manual', ?, ?)
    ");
    $stmt->bind_param("ssi", $placa, $motivo, $id_seguridad);

    if ($stmt->execute()) {
        header("Location: seguridad.html?ok=autorizado");
    } else {
        header("Location: seguridad.html?error=bd");
    }

    $stmt->close();
    $conn->close();
}
?>