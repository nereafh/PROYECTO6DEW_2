<?php
//Acceso desde cualquier origen para hacer peticiones a este script
header("Access-Control-Allow-Origin: *");

//Devuelvo JSON 
header("Content-Type: application/json; charset=UTF-8");

//Si la petición al servidor es GET devuelvo objeto json 
if($_SERVER["REQUEST_METHOD"]==="GET"){
    echo json_encode([
        "nombre"=>"Nerea",
        "apellidos"=>"Fernández Hernández",
        "dni"=>"12345678X",
        "fnacimiento"=>"15/04/2008",
        "cpostal"=>"35001",
        "correo"=>"nereafernandezh@gmail.com",
        "telefonofijo"=>"928123456",
        "telefonomovil"=>"+34 600123456",
        "iban"=>"ES79 2100 0813 6101",
        "tarjetacredito"=>"4539 9550 8588 3327",
        "contrasena"=>"Nerea12345678!",
        "repetircontrasena"=>"Nerea12345678!"
    ]);
    exit;
}

//Si la petición al servidor es POST recibo datos desde el js e imprimo lo que recibo 
if($_SERVER["REQUEST_METHOD"]==="POST"){
    $json=file_get_contents("php://input");
    echo "POST recibido: ".$json;
}
?>
