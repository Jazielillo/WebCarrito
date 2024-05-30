import { obtenerInformacion, subirInformacion } from "./prueba.js";
let btnAceptar = document.getElementById("btnModificar");

btnAceptar.addEventListener("click", (e) => {
  e.preventDefault();
  let usuario = verificarUsuario();
  let nombre = verificarNombre();
  let correo = verificarCorreo();
  let password = verificarPassword();
  let edad = verificarEdad();

  if (usuario && nombre && correo && password && edad) {
    registrarUsuario();
  }
});

async function registrarUsuario() {
  let nombre = document.getElementById("nombreAdmin").value;
  let edad = document.getElementById("edad").value;
  let email = document.getElementById("email").value;
  let contrasena = document.getElementById("password").value;
  let usuario = document.getElementById("usuario").value;

  const horaActual = new Date();
  const idUsuario = horaActual.getTime();

  try {
    const existeUsuario = await obtenerInformacion(
      "Usuarios",
      "usuario",
      usuario
    );

    if (existeUsuario) {
      mostrarModal(
        "Ese nombre de usuario ya esta en uso, usa otro porfavor",
        "mal",
        "mensaje-validacion",
        "mensaje-validacion"
      );
    } else {
      mostrarModal("Usuario registrado correctamente");
      // Crear un objeto con los datos obtenidos
      enviarCorreo(idUsuario);

      await subirInformacion(
        "Usuarios",
        nombre,
        null,
        idUsuario,
        edad,
        contrasena,
        usuario,
        email
      );

      // setTimeout(() => {
      //   window.location.href = "../html/login.html"; // Cambia esto por la ruta de tu página principal
      // }, 250);
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
}

function mostrarModal(mensaje, operacion) {
  var mensajeDiv = document.getElementById("mensajeDiv");
  mensajeDiv.style.display = "block";

  if (operacion) {
    mensajeDiv.classList.add("mal", "mensaje-validacion");
  } else {
    mensajeDiv.classList.add("bien");
  }

  mensajeDiv.innerText = mensaje;

  setTimeout(function () {
    mensajeDiv.style.display = "none";
    if (mensajeDiv.classList.contains("bien")) {
      mensajeDiv.classList.remove("bien");
    }
    mensajeDiv.classList.remove("mal", "mensaje-validacion");
  }, 3000); // 2000 milisegundos = 2 segundos
}

function verificarNombre() {
  const nombreRegex = /^[a-zA-Z\s]+$/;
  const nombreInput = document.getElementById("nombreAdmin");
  let validar = nombreRegex.test(nombreInput.value);
  if (!validar) {
    mostrarModal(
      "El nombre del usuario no es correcto",
      "mal",
      "mensaje-validacion"
    );
    return false;
  } else {
    return true;
  }
}

function verificarUsuario() {
  const usuarioRegex = /^[a-zA-Z0-9]{5,}$/;
  const usuarioInput = document.getElementById("usuario");
  let validar = usuarioRegex.test(usuarioInput.value);
  if (!validar) {
    mostrarModal("El usuario no es correcto", "mal", "mensaje-validacion");
    return false;
  } else {
    return true;
  }
}

function verificarEdad() {
  const edadRegex = /^(0*[1-9]|[1-9][0-9])$/;
  const edadInput = document.getElementById("edad");
  let validar = edadRegex.test(edadInput.value);
  if (!validar) {
    mostrarModal("La edad es incorrecta", "mal", "mensaje-validacion");
    return false;
  } else {
    return true;
  }
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

function verificarPassword() {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  const passwordInput = document.getElementById("password");
  let pass = [passwordInput];
  let ahuevo = false;

  pass.forEach((p) => {
    let validar = passwordRegex.test(p.value);
    if (!validar) {
      mostrarModal(
        "La contraseña debe contener 1 mayuscula, 1 caracter especial y al menos 1 numero",
        "mal",
        "mensaje-validacion"
      );
    } else {
      ahuevo = true;
    }
  });

  return ahuevo;
}

function enviarCorreo(id) {
  // Reemplaza 'tu_template_ID' con tu Template ID de EmailJS

  // Obtener la URL actual

  let auxiliar = "id=" + id;

  let idEncriptado = cifradoCesar(auxiliar, 3);

  let urlActual = window.location.href;
  
  // Verificar si la URL termina con "registrarse.html"
  if (urlActual.endsWith("alta-usuarios.html")) {
    // Reemplazar "registrarse.html" con "login.html"
    urlActual = urlActual.replace("alta-usuarios.html", "validacionCorreo.html");
  }

  urlActual += `?${idEncriptado}`;

  console.log(urlActual)

  const serviceID = "default_service";
  const templateID = "template_ryp16yk";
  const message = `Da click en este enlace para validar el registro: ${urlActual}`;

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("email").value;

  emailjs
    .send(serviceID, templateID, {
      to_name: nombre,
      reply_to: correo,
      message: message,
    })
    .then(
      () => {
        alert("¡Correo enviado correctamente!");
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );

}

function cifradoCesar(texto, clave) {
  var textoEncriptado = "";
  for (var i = 0; i < texto.length; i++) {
    var charCode = texto.charCodeAt(i);
    if (charCode !== 32) {
      // Ignorar espacios
      textoEncriptado += String.fromCharCode((charCode + clave) % 65536); // Cifrado para todos los caracteres
    } else {
      textoEncriptado += " "; // Mantener espacios sin cambios
    }
  }
  return encodeURIComponent(textoEncriptado);
}

function descifradoCesar(textoCifrado, clave) {
  var textoDescifrado = "";
  for (var i = 0; i < textoCifrado.length; i++) {
    var charCode = textoCifrado.charCodeAt(i);
    if (charCode !== 32) {
      // Ignorar espacios
      textoDescifrado += String.fromCharCode((charCode - clave + 256) % 256); // Desplazamiento inverso
    } else {
      textoDescifrado += " "; // Mantener espacios sin cambios
    }
  }
  return textoDescifrado;
}
