<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conexion = new mysqli("localhost", "zonzamas", "Csas1234!", "practica6_dew");
if($conexion->connect_error) die(json_encode(["error"=>$conexion->connect_error]));

$dni = isset($_GET['dni']) ? $conexion->real_escape_string($_GET['dni']) : '';
if(empty($dni)) die(json_encode(["error"=>"DNI no proporcionado"]));

$sql = "SELECT * FROM usuarios WHERE dni='$dni'";
$resultado = $conexion->query($sql);

if(!$resultado) die(json_encode(["error"=>$conexion->error]));
if($resultado->num_rows>0) echo json_encode($resultado->fetch_assoc());
else echo json_encode(["error"=>"Usuario no encontrado"]);

$conexion->close();
?>