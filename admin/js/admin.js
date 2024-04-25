import { obtenerDocumentoPorRol, modificarInformacion } from "./prueba.js";

let btnModificar = document.getElementById("btnModificar");
let btnCerrar = document.getElementById("btnCerrar");
let id;

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
    if (mensajeDiv.classList.contains("bien")) {
      mensajeDiv.classList.remove("bien");
      window.location.reload();
    }
    mensajeDiv.classList.remove("mal");
  }, 3000); // 2000 milisegundos = 2 segundos
}

document.addEventListener("DOMContentLoaded", () => {
  llenarDatos();
  btnModificar.addEventListener("click", () => {
    modificarAdmin();
  });
  btnCerrar.addEventListener("click", () => {
    cerrarSesion();
  });
});

function cerrarSesion() {
  mostrarModal("Cerrando sesion...");
  window.location.href = "../../html/login.html";
}

async function llenarDatos() {
  let nombre = document.getElementById("nombreAdmin");
  let usuario = document.getElementById("usuario");
  let contraseña = document.getElementById("contraseña");
  let email = document.getElementById("email");
  let edad = document.getElementById("edad");

  const documentoAdmin = await obtenerDocumentoPorRol(
    "Usuarios",
    "rol",
    "administrador"
  );

  nombre.value = documentoAdmin.nombre;
  usuario.value = documentoAdmin.usuario;
  contraseña.value = documentoAdmin.password;
  email.value = documentoAdmin.email;
  id = documentoAdmin.id;
  edad.value = documentoAdmin.edad;
}

async function modificarAdmin() {
  let nombre = document.getElementById("nombreAdmin");
  let usuario = document.getElementById("usuario");
  let contraseña = document.getElementById("contraseña");
  let email = document.getElementById("email");
  let edad = document.getElementById("edad");
  if (
    nombre.value === "" ||
    usuario.value === "" ||
    contraseña.value === "" ||
    email.value === "" ||
    edad.value === ""
  ) {
    mostrarModal("Llena correctamente los campos :c", "mal");
  } else {
    await modificarInformacion(
      "Usuarios",
      nombre.value,
      contraseña.value,
      usuario.value,
      edad.value,
      email.value,
      id
    );
    mostrarModal("Perfil de admin, modificado correctamente :D");
  }

  
}
