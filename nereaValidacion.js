function mostrarResultado(texto){
    document.getElementById("resultado").innerHTML = texto;
}

// Expresiones regulares
const patterns = {
    nombre: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\d]{4,12}$/,
    apellidos: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,14}\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,14}$/,
    dni: /^[xX]?\d{8}[A-Za-z]$/,
    fnacimiento: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    cpostal: /^\d{5}$/,
    correo:/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,    
    telefonofijo: /^[98]{1}\d{8}$/,
    telefonomovil: /^\+34\s\d{9}$/,
    iban: /^[A-Z]{2}\d{2}\s\d{4}\s\d{4}\s\d{4}$/,
    tarjetacredito: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,    
    contrasena: /^[a-zA-Z0-9_\-$!¡@?¿=;:]{12,30}$/,    
    repetircontrasena: /^[a-zA-Z0-9_\-$!¡@?¿=;:]{12,30}$/    
    //edad: /^\d{1,3}$/,
    //mensaje: /^.+$/
};

// Mensajes de error
const mensajes = {
    nombre: "La primera letra debe estar en mayúscula y mínimo 5 caracteres.",
    apellidos: "Cada apellido debe empezar en mayúscula y solo un espacio entre ellos.",
    dni: "DNI español válido.",
    fnacimiento: "Fecha de nacimiento DD/MM/AAAA.",
    cpostal: "Código postal español válido.",
    correo: "Correo válido.",
    telefonofijo: "Teléfono fijo canario válido.",
    telefonomovil: "Teléfono móvil válido (+34...).",
    iban: "IBAN válido (ES...).",
    tarjetacredito: "Tarjeta de crédito válida.",
    contrasena: "Mínimo 12 caracteres, letras, números y símbolo.",
    repetircontrasena: "Debe coincidir con contraseña.",
    //edad: "Edad válida.",
    //mensaje: "Debe ingresar un mensaje."
};

// Validación en tiempo real
document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => {
    input.addEventListener("keyup", e => {
        const regex = patterns[e.target.name];
        if(regex) validate(e.target, regex);
    });
});

function validate(campo, regex){
    campo.classList.remove("valido","invalido");
    const msg = document.getElementById("error-"+campo.name);
    if(regex.test(campo.value)){
        campo.classList.add("valido");
        if(msg) msg.style.display="none";
    } else {
        campo.classList.add("invalido");
        if(msg) msg.style.display="block";
    }
}

// Comprobar si todo es válido
function todoValido(){
    let ok = true;
    document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => {
        if(input.name && !patterns[input.name].test(input.value)){
            ok = false;
            const msg = document.getElementById("error-"+input.name);
            if(msg) msg.style.display="block";
        } else {
            const msg = document.getElementById("error-"+input.name);
            if(msg) msg.style.display="none";
        }
    });
    return ok;
}

// --- Guardar y recuperar localStorage ---
document.getElementById("btnGuardar").onclick = function(){
    if(!todoValido()){ mostrarResultado("Hay campos inválidos."); return; }
    const datos = {};
    document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => { if(input.name) datos[input.name]=input.value; });
    localStorage.setItem("formularioDEW", JSON.stringify(datos));
    mostrarResultado("Datos guardados en localStorage.");
};

document.getElementById("btnRecuperar").onclick = function(){
    const datos = JSON.parse(localStorage.getItem("formularioDEW"));
    if(datos){
        Object.keys(datos).forEach(k => { const campo = document.querySelector("[name='"+k+"']"); if(campo) campo.value = datos[k]; });
        mostrarResultado("Datos recuperados desde localStorage.");
        document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => { const regex = patterns[input.name]; if(regex) validate(input, regex); });
    } else mostrarResultado("No hay datos guardados.");
};

// --- GET JSON ---
document.getElementById("btnJsonGet").onclick = function(){
    fetch("nereaValidacion.json")
        .then(r=>r.json())
        .then(data=>{
            Object.keys(data).forEach(k=>{ const campo = document.querySelector("[name='"+k+"']"); if(campo) campo.value=data[k]; });
            mostrarResultado("Datos cargados desde JSON.");
            document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => { const regex = patterns[input.name]; if(regex) validate(input, regex); });
        });
};

// --- POST PHP ---
document.getElementById("btnJsonPost").onclick = function(){
    if(!todoValido()){ mostrarResultado("Hay campos inválidos."); return; }
    const datos = {};
    document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => { if(input.name) datos[input.name]=input.value; });
    fetch("process.php", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(datos) })
    .then(r=>r.text()).then(t=>mostrarResultado(t));
};

// --- GET PHP ---
document.getElementById("btnPhpGet").onclick = function(){
    fetch("process.php")
    .then(r=>r.json())
    .then(data=>{
        Object.keys(data).forEach(k=>{ const campo = document.querySelector("[name='"+k+"']"); if(campo) campo.value=data[k]; });
        mostrarResultado("Datos obtenidos desde PHP.");
        document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => { const regex = patterns[input.name]; if(regex) validate(input, regex); });
    });
};

// --- INSERTAR EN BD ---
document.getElementById("btnDbPost").onclick = function(){
    if(!todoValido()){ mostrarResultado("Hay campos inválidos."); return; }
    const formData = new FormData();
    document.querySelectorAll("#formulario input, #formulario textarea").forEach(input=>{ if(input.name) formData.append(input.name,input.value); });
    fetch("insert.php", {method:"POST", body:formData})
    .then(r=>r.text()).then(t=>mostrarResultado(t));
};

// --- OBTENER DE BD ---
document.getElementById("btnDbGet").onclick = function(){
    const dni = prompt("Introduce el DNI del usuario a recuperar:");
    if(!dni) return;
    fetch("getuser.php?dni="+dni)
    .then(r=>r.json())
    .then(data=>{
        if(data.error){ mostrarResultado(data.error); return; }
        Object.keys(data).forEach(k=>{ const campo=document.querySelector("[name='"+k+"']"); if(campo) campo.value=data[k]; });
        mostrarResultado("Datos obtenidos desde BD.");
        document.querySelectorAll("#formulario input, #formulario textarea").forEach(input => { const regex = patterns[input.name]; if(regex) validate(input, regex); });
    });


    /*
    nombre: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/
    ^ comienzo de la cadena, $ finalización
    [A-ZÁÉÍÓÚÑ] primera letra obligatoria en mayúsculas, incluyendo acentos y ñ
    [a-záéíóúñ] el resto minúsuclas, permitiendo acentos y ñ
    + una o mas letras

    */

    /*
    apellidos: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/,

    [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ una o mas letras, la primera con mayúscula, incluye acentos y ñ
                espacio
    [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ una o mas letras, la primera con mayúscula, permite acentos y ñ

    */
    
    // ------------DNI/NIE---------
    /*
    dni: /^[XYZ]?\d{7,8}[A-Za-z]$/

    [XYZ]? opcional, letra X,Y o Z (NIE)
    \d{7,8} después 7 mínimo, 8 máximo números seguidos
    [A-Za-z] letra final del DNI/NIE incluyendo mayúsculas y minúsculas

    */

    // -----------FECHA_NAC---------
    /*
    formato YYYY-MM-DD: fecha_nac: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    sino poner input a text y permitir - /


    fecha_nac: /^((31[\/-](0[13578]|1[02]))[\/-](19|20)\d{2}|(29|30)[\/-](0[13-9]|1[0-2])[\/-](19|20)\d{2}|29[\/-]02[\/-](19|20)(0[48]|[2468][048]|[13579][26])|(0[1-9]|1\d|2[0-8])[\/-](0[1-9]|1[0-2])[\/-](19|20)\d{2})$/

    Bloque1
    (31  Día 31
    \/
    (0[13578]|1[02])) Meses que acaben en 31: 1,3,5,7,8,10,12
    \/
    (19|20)\d{2} Años del 1900-2099 donde sus meses acaben en 31 

    Bloque2, lo mismo pero con meses acabados en 29 y 30
    |(29|30)
    \/
    (0[13-9]|1[0-2])
    \/
    (19|20)\d{2}
    
    Bloque3, valido febrero
    |29
    \/
    02
    \/
    (19|20)(0[48]|[2468][048]|[13579][26]) años bisiestos
    
    Bloque4, cualquier mes
    |(0[1-9]|1[0-9]|2[0-8]) Días 01-28
    \/
    (0[1-9]|1[0-2]) Meses 1-12
    \/
    (19|20)\d{2} Años, por lo menos dos dígitos más 1900-2099

    */


    // ------------CP-------------
    /*
    cp:/^[0-5]\d{4}$/

    [0-5]\d{4} un dígito entre 0-5 y luego 4 dígitos más con cualquier número del 0-9
    [0-5][0-9]{4} otra forma de hacer lo mismo

    */


    // ------------E_MAIL---------
    /*
    email: /^[a-zA-Z0-9._%+-ñáéíóúüÁÉÍÓÚÜÑ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    email: /^[a-zA-Z0-9._%+-ñáéíóúüÁÉÍÓÚÜÑ]{5,12}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ igual pero entre 5 y 12 caracteres

    
    [a-zA-Z0-9._%+-ñáéíóúüÁÉÍÓÚÜÑ]+ minimo 1+, letras, numeros, guiones, caracteres especiales, acentos, ñ
    @ obligatorio que empiece así
    [a-zA-Z0-9.-]+ minimo 1+, dominio, sin acentos ni ñ
    \.[a-zA-Z]{2,} finalización, mínimo 2 letras

    */


    // ------------TLF_FIJO---------
    /*
    tlf_fijo: /^[89]\d{8}$/
    [89] primer dígito 8 o 9
    \d{8} siguientes ocho dígitos entre 0-9
    */


    // ------------TLF_MOVIL---------
    /*
    tlf_movil: /^[67]\d{8}$/
    [67] primer dígito 6 o 7
    \d{8} siguientes ocho dígitos entre 0-9
    */


    // ------------IBAN---------
    /*
    iban: /^ES\d{22}$/,

    ES comienza obligatoriamente por ES
    \d{22} los siguientes 22 dígitos numéricos entre 0-9
    */


    // ------------TARJETA_CREDITO---------
    /*
    tarjeta_credito: /^\d{16}$/

    \d{16} exactamente dieciseis dígitos entre 0-9
    */

    // ------------CONTRASENA---------
    /*
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/
    Para obligar a que cada caracter aparezca al menos una vez en cualquier posición: (?=.*[])

    (?=.*[a-z]) al menos una letra minúscula
    (?=.*[A-Z]) al menos una letra mayúscula
    (?=.*\d) al menos un dígito numérico 
    (?=.*[!@#$%^&*]) al menos un caracter especial
    [A-Za-z\d!@#$%^&*]{12, 18} letras, números, caracteres especiales, mínimo 12 máximo 18

    */


};
