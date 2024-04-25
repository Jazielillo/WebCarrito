import {
  obtenerDocumentoPorRol,
  modificarInformacion,
} from "../admin/js/prueba.js";

let btnModificar = document.getElementById("btnModificar");
let btnCerrar = document.getElementById("btnCerrar");
let id;

function ponerUsuario(){
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;
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
  ponerUsuario();
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

  let usuarioActual = localStorage.getItem("usuarioActual");
  console.log(usuarioActual);
  let documentoUsuarioActual = await obtenerDocumentoPorRol(
    "Usuarios",
    "usuario",
    `${usuarioActual}`
  );

  nombre.value = documentoUsuarioActual.nombre;
  usuario.value = documentoUsuarioActual.usuario;
  contraseña.value = documentoUsuarioActual.password;
  email.value = documentoUsuarioActual.email;
  id = documentoUsuarioActual.id;
  edad.value = documentoUsuarioActual.edad;
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
    let usuarioActual = localStorage.getItem("usuarioActual");
    usuarioActual = usuario.value;
    localStorage.setItem("usuarioActual", usuarioActual);
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
