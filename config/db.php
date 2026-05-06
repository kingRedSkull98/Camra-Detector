<?php
$conn = new mysqli("localhost", "root", "", "base_de_datos_2");
if ($conn->connect_error) {
    die("Error: " . $conn->connect_error);
}
$conn->set_charset("utf8");
?>