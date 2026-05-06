<?php
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula       = trim($_POST['cedula']);
    $whatsapp     = trim($_POST['celular']);
    $tipo_usuario = trim($_POST['tipo-usuario']);
    $programa     = trim($_POST['programa'] ?? '');
    $fecha_inicio = trim($_POST['fecha-inicio']);
    $fecha_fin    = trim($_POST['fecha-fin']);
    $acepto       = isset($_POST['terminos']) ? 1 : 0;

    $placa        = strtoupper(trim($_POST['placa']));
    $marca        = trim($_POST['marca']);
    $clase        = trim($_POST['clase']); // moto, carro, camioneta, otro

    if (!$acepto) {
        header("Location: registro.html?error=terminos"); exit;
    }

    // Verificar['fecha-inicio']);
    $fecha_finonn->prepare("SELECT cedula FROM usuarios WHERE cedula = ?");
    $check->bind_param("s", $cedula);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        header("Location: registro.html?error=cedula_existe"); exit;
    }
    $check->close();

    // Verifica['fecha-inicio']);
    $fecha_finconn->prepare("SELECT placa FROM vehiculos WHERE placa = ?");
    $checkP->bind_param("s", $placa);
    $checkP->execute();
    $checkP->store_result();
    if ($checkP->num_rows > 0) {
        header("Loca['fecha-inicio']);
    $fecha_finxiste"); exit;
    }
    $checkP->close();

    // Insertar en tabla usuarios
    // Insertar en tabla usuarios
$stmtU = $conn->prepare("
    INSERT INTO usuarios (cedula, whatsapp, tipo_usuario, programa, acepto_terminos, fecha_inicio, fecha_fin, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'inactivo')
");
$stmtU->bind_param("sssssss", $cedula, $celular, $tipo_usuario, $programa, $acepto_terminos, $fecha_inicio, $fecha_fin);
$stmtU->execute();
$stmtU->close();

// Insertar en tabla vehiculos
$stmtV = $conn->prepare("
    INSERT INTO vehiculos (cedula_usuario, placa, marca, fecha_inicio, fecha_fin, estado)
    VALUES (?, ?, ?, ?, ?, 'pendiente')
");
$stmtV->bind_param("sssss", $cedula, $placa, $marca, $fecha_inicio, $fecha_fin);

if ($stmtV->execute()) {
    header("Location: registro.html?ok=1");
} else {
    header("Location: registro.html?error=vehiculo");
}
        $stmtV->close();
    } else {
        header("Location: registro.html?error=usuario");
    }

    $stmtU->close();
    $conn->close();
}
?>