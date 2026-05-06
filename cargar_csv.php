<?php
require_once 'config/db.php';
session_start();
$id_a['fecha-inicio']);
    $fecha_fin;

if ($_F['fecha-inicio']);
    $fecha_fin
    ['fecha-inicio']);
    $fecha_finS['archivo']['name'], PATHINFO_EXTENSION));
    if (!in_array($ext['fecha-inicio']);
    $fecha_fination: administrador.html?error=formato"); exit;
    }

    // Registrar ['fecha-inicio']);
    $fecha_finchivo ['fecha-inicio']);
    $fecha_fino']);
    $fecha_finpare("
        INSERT INTO cargues_masivos (id_admin, nombre_archivo, ['fecha-inicio']);
    $fecha_finUES (?, ?, 'csv', 'procesado')
    ");
    $stmtC->bind_param("is", $id_admin, $no['fecha-inicio']);
    $fecha_fin']);
    $fecha_finose();

    $archivo    = fopen($_FILES['archivo']['tmp_name'], '['fecha-inicio']);
    $fecha_fin['fecha-inicio']);
    $fecha_fin]);
    $fecha_fintos = fgetcsv($archivo, 1000, ",")) !== false) {
        $fila+['fecha-inicio']);
    $fecha_finnue;
        if (count($datos)['fecha-inicio']);
    $fecha_fincha-inicio']);
    $fecha_finipo, $programa, $placa, $fecha_inicio, $fecha_fin] = $datos;['fecha-inicio']);
    $fecha_fin($placa));

        $stmtU = $conn->prepare("
            INSERT IGNORE INTO usuarios (cedula, no['fecha-inicio']);
    $fecha_finha_inicio, fecha_fin, estado)
            VALUES (?, ?, ?, ?, ?, ?, 'activo')
        "['fecha-inicio']);
    $fecha_finssss", $cedula, $nom['fecha-inicio']);
    $fecha_fincio, $fecha_fin);
        $stmtU->exe['fecha-inicio']);
    $fecha_fin
        $stmtV = $conn->prepare("INSERT IGNORE INTO vehiculos (ced['fecha-inicio']);
    $fecha_finS (?, ?, 'activo')");
        $stmtV->bind_param("ss", $cedula, $p['fecha-inicio']);
    $fecha_fin? $insertados++ : $errores++;
        $stmtV->close();
    }

    fclose($arc['fecha-inicio']);
    $fecha_finnistrador.html?ok=$inserta['fecha-inicio']);
    $fecha_fin    header("Location: administrador.html?error=archiv['fecha-inicio']);
    $fecha_fin*

## ✅ registro_individual.php *(CORREGIDO)*

```php
<?php
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ce['fecha-inicio']);
    $fecha_fin  $nombre = trim($_POST['nombre']);
    $tipo   = trim($_POST['fecha-inicio']);
    $fecha_finer(trim($_POST['placa']));

    $check = $conn->prepare("SELECT['fecha-inicio']);
    $fecha_fina['fecha-inicio']);
    $fecha_fin", $cedula);
    $check->execute();
    $check->store_result();
    if ($check->['fecha-inicio']);
    $fecha_finocation: administrador.html?error=cedula_existe"); exit;
    }
    $check->clos['fecha-inicio']);
    $fecha_fin("INSERT INTO usuarios (cedula, nombre, tipo_usuario, es['fecha-inicio']);
    $fecha_finfecha-inicio']);
    $fecha_fin, $ce['fecha-inicio']);
    $fecha_finstmtU->execute()) {
        $stmtV = $conn->prepa['fecha-inicio']);
    $fecha_fin_usuario, placa, estado) VALUES (?, ?, 'activo')");
        $['fecha-inicio']);
    $fecha_fin$pla['fecha-inicio']);
    $fecha_finnicio']);
    $fecha_finstrador.html?ok=registrado") : header("Location: administrador.html?error=placa");
        $stm['fecha-inicio']);
    $fecha_fin header("Location: administrador.html?error=usuario");
    }

    $stmtU->close();
    $co['fecha-inicio']);
    $fecha_fin todo usa tus tablas y columnas re['fecha-inicio']);
    $fecha_finargues_masivos`, `cedula_usuario`, `whatsapp`, `tipo_vehiculo`, etc. ¿Seguimos con `vehiculos.html`, `eventos.html` o `seguridad.htm['fecha-inicio']);
    $fecha_finfin