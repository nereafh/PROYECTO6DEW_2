<?php
$conexion = new mysqli("localhost", "zonzamas", "Csas1234!", "practica6_dew");
if($conexion->connect_error) die("Error de conexión: ".$conexion->connect_error);

$campos = ["nombre","apellidos","dni","fnacimiento","cpostal","correo","telefonofijo","telefonomovil","iban","tarjetacredito","contrasena","repetircontrasena"];
foreach($campos as $c){ $$c = $_POST[$c]; }

$sql = "INSERT INTO usuarios (nombre,apellidos,dni,fnacimiento,cpostal,correo,telefonofijo,telefonomovil,iban,tarjetacredito,contrasena,repetircontrasena) 
        VALUES ('$nombre','$apellidos','$dni','$fnacimiento','$cpostal','$correo','$telefonofijo','$telefonomovil','$iban','$tarjetacredito','$contrasena','$repetircontrasena')";

if($conexion->query($sql)) echo "Datos insertados correctamente en la BD.";
else echo "Error: ".$conexion->error;

$conexion->close();



/*
CREATE DATABASE IF NOT EXISTS practica6_dew;
USE practica6_dew;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    dni VARCHAR(15),
    fnacimiento VARCHAR(10),
    cpostal VARCHAR(5),
    correo VARCHAR(100),
    telefonofijo VARCHAR(15),
    telefonomovil VARCHAR(15),
    iban VARCHAR(34),
    tarjetacredito VARCHAR(19),
    contrasena VARCHAR(50),
    repetircontrasena VARCHAR(50)

);

--edad INT
--mensaje TEXT
*/
?>
