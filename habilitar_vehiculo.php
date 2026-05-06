<?php
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $placa    = strtoupper(trim($_POST['placa']));
    $cedula   = trim($_POST['cedula']);
    $vigencia = trim($_POST['vigencia']); // fecha de vigencia del permiso

    // 1. Verificar que el usuario existe
    $user = $conn->prepare("SELECT cedula FROM usuarios WHERE cedula = ?");
    $user->bind_param("s", $cedula);
    $user->execute();
    $user->store_result();

    if ($user->num_rows === 0) {
        header("Location: administrador.html?error=usuario_no_existe");
        exit;
    }
    $user->close();

    // 2. Verificar que el vehículo existe y pertenece a ese usuario
    $check = $conn->prepare("
        SELECT placa FROM vehiculos 
        WHERE placa = ? AND cedula_usuario = ?
    ");
    $check->bind_param("ss", $placa, $cedula);
    $check->execute();
    $check->store_result();

    if ($check->num_rows === 0) {
        header("Location: administrador.html?error=vehiculo_no_encontrado");
        exit;
    }
    $check->close();

    // 3. Habilitar el vehículo → estado = 'activo'
    //    También actualiza fecha_fin en usuarios con la vigencia
    $stmtV = $conn->prepare("
        UPDATE vehiculos SET estado = 'activo' 
        WHERE placa = ? AND cedula_usuario = ?
    ");
    $stmtV->bind_param("ss", $placa, $cedula);
    $stmtV->execute();
    $stmtV->close();

    $stmtU = $conn->prepare("
        UPDATE usuarios SET estado = 'activo', fecha_fin = ?
        WHERE cedula = ?
    ");
    $stmtU->bind_param("ss", $vigencia, $cedula);

    if ($stmtU->execute()) {
        header("Location: administrador.html?ok=habilitado");
    } else {
        header("Location: administrador.html?error=bd");
    }

    $stmtU->close();
    $conn->close();
}
?>