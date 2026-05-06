<?php
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula = trim($_POST['cedula']);
    $nombre = trim($_POST['nombre']);
    $tipo   = trim($_POST['tipo']);
    $placa  = strtoupper(trim($_POST['placa']));

    // Verificar cédula duplicada
    $check = $conn->prepare("SELECT id FROM usuarios WHERE cedula = ?");
    $check->bind_param("s", $cedula);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        header("Location: administrador.html?error=cedula_existe");
        exit;
    }
    $check->close();

    // Insertar usuario
    $stmtU = $conn->prepare("
        INSERT INTO usuarios (cedula, nombre, tipo_usuario, estado)
        VALUES (?, ?, ?, 'activo')
    ");
    $stmtU->bind_param("sss", $cedula, $nombre, $tipo);

    if ($stmtU->execute()) {
        $usuario_id = $conn->insert_id;

        // Insertar vehículo
        $stmtV = $conn->prepare("
            INSERT INTO vehiculos (usuario_id, placa, estado)
            VALUES (?, ?, 'activo')
        ");
        $stmtV->bind_param("is", $usuario_id, $placa);

        if ($stmtV->execute()) {
            header("Location: administrador.html?ok=registrado");
        } else {
            header("Location: administrador.html?error=placa");
        }
        $stmtV->close();
    } else {
        header("Location: administrador.html?error=usuario");
    }

    $stmtU->close();
    $conn->close();
}
?>
