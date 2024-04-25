let btnEnviar = document.getElementById("enviar");
let btnLimpiar = document.getElementById("limpiar");

document.addEventListener("DOMContentLoaded", () => {
    ponerUsuario();
})

btnLimpiar.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarDatos();
})

function ponerUsuario(){
    let usuario = localStorage.getItem("usuarioActual");
    let p = document.getElementById("nombre");
  
    p.innerText = usuario;
  }

function limpiarDatos(){
    document.getElementById("nombreForm").value = "";
    document.getElementById("email").value = "";
    document.getElementById("mensaje").value = "";
}

btnEnviar.addEventListener("click", (e) => {
    e.preventDefault();
    enviarDatos();
})

function enviarDatos(){
    let nombre = document.getElementById("nombreForm").value;
    let email = document.getElementById("email").value;
    let msj = document.getElementById("mensaje").value;

    alert(`Tus datos: ${nombre} , mensaje -> ${msj} y email -> ${email}`);
}