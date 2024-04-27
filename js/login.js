import { verificarCredenciales, verificarAdmin } from "../admin/js/prueba.js";
let btnAceptar = document.getElementById("aceptar");
let btnListar = document.getElementById("listar");

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("usuarioActual");
  localStorage.removeItem("tipoUsuario");
});

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
    }
    mensajeDiv.classList.remove("mal");
  }, 3000); // 2000 milisegundos = 2 segundos
}

btnAceptar.addEventListener("click", (e) => {
  e.preventDefault();
  validarLogin();
});

function sesiones(usuario, tipoUsuario) {
  localStorage.setItem("usuarioActual", usuario);

  if (tipoUsuario === "admin") {
    localStorage.setItem("tipoUsuario", tipoUsuario);
  } else {
    localStorage.setItem("tipoUsuario", "usuarioNormal");
  }
}

// btnListar.addEventListener("click", (e) => {
//   e.preventDefault();
//   listarUsuarios();
// });

// function listarUsuarios() {
//   let usuariosYPass = "";

//   for (let i = 0; i < localStorage.length; i++) {
//     const clave = localStorage.key(i);
//     const valor = localStorage.getItem(clave);

//     try {
//       const usuario = JSON.parse(valor);
//       if (usuario && usuario.contrasena && usuario.usuario) {
//         usuariosYPass += `Usuario: ${usuario.usuario}, Contraseña: ${usuario.contrasena}\n`;
//       }
//     } catch (error) {
//       console.error("Error al analizar JSON:", error);
//     }
//   }

//   // Mostrar alerta con los usuarios y contraseñas
//   alert("Usuarios y Contraseñas:\n" + usuariosYPass);
// }

async function validarLogin() {
  const usuarioInput = document.getElementById("usuario").value;
  const contrasenaInput = document.getElementById("contrasena").value;

  // Verificar si el usuario y la contraseña coinciden
  const credencialesValidas = await verificarCredenciales(
    usuarioInput,
    contrasenaInput
  );

  const adminstradorValido = await verificarAdmin(
    usuarioInput,
    contrasenaInput
  );


  if (credencialesValidas) {
    // Las credenciales son válidas, continuar con el inicio de sesión
    if (adminstradorValido) {
      console.log("Inicio sesion admin");
      setTimeout(() => {
        sesiones(usuarioInput, "admin");
        window.location.href = "../admin/html/gestion.html"; // Cambia esto por la ruta de tu página principal
      }, 250);
    } else {
      setTimeout(() => {
        sesiones(usuarioInput);
        window.location.href = "../html/inicio.html"; // Cambia esto por la ruta de tu página principal
      }, 250);
    }
  } else {
    // Las credenciales son inválidas, mostrar un mensaje de error
    mostrarModal("Credenciales incorrectas", "mal");
    console.error("Credenciales inválidas, no se pudo iniciar sesión");
  }
}
