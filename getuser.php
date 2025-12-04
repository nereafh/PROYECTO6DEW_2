<?php
//Permiso de cualquier origen para hacer peticiones 
header("Access-Control-Allow-Origin: *");

//Devuelvo json
header("Content-Type: application/json");

//Conexión con la base de datos
$conexion = new mysqli("localhost", "zonzamas", "Csas1234!", "practica6_dew");
if($conexion->connect_error) die(json_encode(["error"=>$conexion->connect_error])); //si falla la conexión detengo el script y devuelvo error JSON

$dni = isset($_GET['dni']) ? $conexion->real_escape_string($_GET['dni']) : ''; //compruebo parámetro 'dni' obtenido por GET
if(empty($dni)) die(json_encode(["error"=>"DNI no proporcionado"]));

$sql = "SELECT * FROM usuarios WHERE dni='$dni'"; //consulta preparada, busco el dni
$resultado = $conexion->query($sql);

if(!$resultado) die(json_encode(["error"=>$conexion->error])); //error, si falla la conexión

//Registro devuelto como JSON
if($resultado->num_rows>0) echo json_encode($resultado->fetch_assoc()); 
else echo json_encode(["error"=>"Usuario no encontrado"]);

$conexion->close();
?>
