<?php
require_once "config/db.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $cedula          = $_POST['cedula'] ?? '';
    $email           = $_POST['email'] ?? '';
    $celular         = $_POST['celular'] ?? '';
    $tipo_usuario    = $_POST['tipo-usuario'] ?? '';
    $programa        = $_POST['programa'] ?? '';
    $acepto_terminos = isset($_POST['acepto_terminos']) ? 1 : 0;
    $fecha_inicio    = $_POST['fecha-inicio'] ?? '';
    $fecha_fin       = $_POST['fecha-fin'] ?? '';
    $placa           = strtoupper($_POST['placa'] ?? '');
    $marca           = $_POST['marca'] ?? '';
    $tipo_vehiculo   = $_POST['tipo-vehiculo'] ?? '';

    // Verificar si cédula ya existe
    $check = $conn->prepare("SELECT cedula FROM usuarios WHERE cedula = ?");
    $check->bind_param("s", $cedula);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        header("Location: registro.html?error=cedula_existe");
        exit;
    }
    $check->close();

    // Verificar si placa ya existe
    $checkP = $conn->prepare("SELECT placa FROM vehiculos WHERE placa = ?");
    $checkP->bind_param("s", $placa);
    $checkP->execute();
    $checkP->store_result();
    if ($checkP->num_rows > 0) {
        header("Location: registro.html?error=placa_existe");
        exit;
    }
    $checkP->close();

    // Insertar usuario
    $stmtU = $conn->prepare("INSERT INTO usuarios (cedula, email, whatsapp, tipo_usuario, programa, acepto_terminos, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'inactivo')");
    $stmtU->bind_param("sssssiss", $cedula, $email, $celular, $tipo_usuario, $programa, $acepto_terminos, $fecha_inicio, $fecha_fin);
    $stmtU->execute();
    $stmtU->close();

    // Insertar vehículo
    $stmtV = $conn->prepare("INSERT INTO vehiculos (cedula_usuario, placa, marca, tipo_vehiculo, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, 'pendiente')");
    $stmtV->bind_param("ssssss", $cedula, $placa, $marca, $tipo_vehiculo, $fecha_inicio, $fecha_fin);

    if ($stmtV->execute()) {
        header("Location: registro.html?ok=1");
    } else {
        header("Location: registro.html?error=vehiculo");
    }
    $stmtV->close();
    $conn->close();

} else {
    header("Location: registro.html");
}
?>