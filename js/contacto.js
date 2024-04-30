import { subirInformacion } from "../admin/js/prueba.js";

let btnEnviar = document.getElementById("enviar");
let btnLimpiar = document.getElementById("limpiar");

document.addEventListener("DOMContentLoaded", () => {
  ponerUsuario();
});

btnLimpiar.addEventListener("click", (e) => {
  e.preventDefault();
  limpiarDatos();
});

function ponerUsuario() {
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;
}

function limpiarDatos() {
  document.getElementById("nombreForm").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mensaje").value = "";
}

btnEnviar.addEventListener("click", (e) => {
  e.preventDefault();
  enviarDatos();
});

async function enviarDatos() {
  let nombre = document.getElementById("nombreForm").value;
  let email = document.getElementById("email").value;
  let msj = document.getElementById("mensaje").value;
  const horaActual = new Date();
  const idMensaje = horaActual.getTime();

  if (nombre && email && msj) {
    if (verificarCorreo()) {
      await subirInformacion("Mensajes", nombre, null, idMensaje, msj, email);
      mostrarModal("Mensaje enviado correctamente :D");
    }
  } else {
    mostrarModal("Por favor, llena los campos correctamente", "mal");
  }
}

function mostrarModal(mensaje, operacion) {
  var mensajeDiv = document.getElementById("mensajeDiv");
  mensajeDiv.style.display = "block";

  if (operacion) {
    mensajeDiv.classList.add("mal");
  } else {
    mensajeDiv.classList.add("bien");
  }

  mensajeDiv.innerText = mensaje;

  setTimeout(function () {
    mensajeDiv.style.display = "none";
    if (operacion === "exito") {
      window.location.reload();
    }
    if (mensajeDiv.classList.contains("bien")) {
      mensajeDiv.classList.remove("bien");
      limpiarDatos();
    }
    mensajeDiv.classList.remove("mal");
  }, 3000); // 2000 milisegundos = 2 segundos
}

function verificarCorreo() {
  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const correoInput = document.getElementById("email");
  let validar = correoRegex.test(correoInput.value);
  if (!validar) {
    mostrarModal(
      "El correo no es un correo valido",
      "mal",
      "mensaje-validacion"
    );
    return false;
  } else {
    return true;
  }
}
