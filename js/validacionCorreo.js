import { modificarEstatus, modificarEstatusUsuario, subirInformacion } from "../admin/js/prueba.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener la URL actual
  let id = parseInt(obtenerIDURL());
  await modificarEstatusUsuario(id,"activo");
});

function descifradoCesar(textoCifrado, clave) {
  textoCifrado = decodeURIComponent(textoCifrado);
  var textoDescifrado = "";
  for (var i = 0; i < textoCifrado.length; i++) {
    var charCode = textoCifrado.charCodeAt(i);
    if (charCode !== 32) {
      // Ignorar espacios
      textoDescifrado += String.fromCharCode(
        (charCode - clave + 65536) % 65536
      ); // Desplazamiento inverso
    } else {
      textoDescifrado += " "; // Mantener espacios sin cambios
    }
  }
  return textoDescifrado;
}

function obtenerIDURL() {
  let urlActual = window.location.href;

  // Usar una expresión regular para obtener la parte después de ".html"
  let regex = /\.html\?(.*)/i; // El (.*) captura cualquier cosa después de ".html?"
  let resultado = regex.exec(urlActual);

  if (resultado !== null && resultado.length > 1) {
    let parteDeseada = resultado[1];
    let cosa = descifradoCesar(parteDeseada, 3);
    regex = /id=([^&]+)/i; // El ([^&]+) captura cualquier cosa que no sea "&"
    resultado = regex.exec(cosa);

    if (resultado !== null && resultado.length > 1) {
      let idDeseado = resultado[1];
      return idDeseado;
    } else {
      console.log("No se encontró 'id=' seguido de algo antes de '&'.");
    }
  } else {
    console.log(
      "No se encontró '.html?' en la URL o no hay nada después de '.html?'."
    );
  }
}
