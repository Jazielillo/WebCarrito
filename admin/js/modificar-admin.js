import { entregarImg, entregarURL, subirImagen } from "./firebase.js";
import { modificarInformacion, obtenerTodosLosDocumentos } from "./prueba.js";

//pintar todos los productos
let idProductoModificado;
let usuariosActivos;

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  //   imagenCargadaForm();
  buscador();
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
    if (mensajeDiv.classList.contains("bien")) {
      mensajeDiv.classList.remove("bien");
      window.location.reload();
    }
    mensajeDiv.classList.remove("mal");
  }, 3000); // 2000 milisegundos = 2 segundos
}

function buscador() {
  let busqueda = document.getElementById("searchInput");
  busqueda.addEventListener("input", function () {
    cargarProductos(this.value);
  });
}

function limpiarDiv() {
  let div = document.querySelector(".busqueda-productos");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}
//AQUI TENGO QUE VER UNA FUNCION PARA QUE NO PUEDA REPETIR EL NOMBRE
async function cargarProductos() {
  // if (palabraBusqueda === "") {
  //   limpiarDiv();
  // }

  let mal = true;
  limpiarDiv();
  let noHay = 0;

  let usuariosAlmacenados = await obtenerTodosLosDocumentos("Usuarios");

  //   if (palabraBusqueda) {
  //     let productosFiltrados = usuariosAlmacenados.filter((foto) =>
  //       foto.nombre.toLowerCase().includes(palabraBusqueda.toLowerCase())
  //     );

  //     productosFiltrados.forEach((foto) => {
  //       console.log(foto, productosAlmacenados);
  //       // Agregar la condición dentro del forEach para filtrar los productos
  //       let productoEncontrado = productosAlmacenados.find(
  //         (producto) =>
  //           producto.id === foto.id && producto.estatus === "activo"
  //       );
  //       if (productoEncontrado) {
  //         pintarProductos(foto.url, foto.nombre, foto.id);
  //         noHay += 1;
  //       } else {
  //         console.log(
  //           foto.id,
  //           "no cumple con la condición de producto activo"
  //         );
  //       }
  //     });
  //   } else {
  usuariosActivos = usuariosAlmacenados.filter(
    (usuario) => usuario.estatus === "activo" && usuario.rol !== "administrador"
  );

  console.log(usuariosActivos);
  usuariosActivos.forEach((el) => {
    pintarProductos(el.nombre, el.id);
    noHay += 1;
  });
}

function noHayProductos() {
  let noHay = document.createElement("h2");
  let busqueda = document.querySelector(".busqueda-productos");
  noHay.innerHTML = "De momento, no hay productos en el sistema :C";
  noHay.classList.add("texto-centro");
  busqueda.appendChild(noHay);
}

function pintarProductos(nombre, id) {
  const divProductos = document.querySelector(".busqueda-productos");
  let div = document.createElement("div");
  div.classList.add("info");
  div.classList.add(`${id}`);
  div.innerHTML = `
    <img src="../img/user.png" alt="chicle" class="info-imagen ${id}">
    <p class="info-nombre ${id}">${nombre}</p>
    `;
  divProductos.appendChild(div);

  div.addEventListener("click", (e) => ponerInformacion(e));
}

async function ponerInformacion(e) {
  //LLENAR LOS CAMPOS
  let nombre = document.getElementById("nombreAdmin");
  let edad = document.getElementById("edad");
  let pass = document.getElementById("contraseña");
  let email = document.getElementById("email");
  let usuario = document.getElementById("usuario");
  usuariosActivos.forEach((el) => {
    if (el.id === parseInt(e.target.classList[1])) {
      nombre.value = el.nombre;
      edad.value = el.edad;
      pass.value = el.password;
      usuario.value = el.usuario;
      email.value = el.email;
    }
  });
  let btnEnviar = document.querySelector(".boton__agregar");

  let id = e.target.classList[1];
  btnEnviar.id = e.target.classList[1];

  if (!btnEnviar.classList.contains("con-evento")) {
    btnEnviar.addEventListener(
      "click",
      async (e) => await modificarProducto(parseInt(id))
    );
    btnEnviar.classList.add("con-evento"); // Marcar el elemento con la clase "con-evento"
  } else {
    console.log("YA TIENE");
  }
}

async function modificarProducto(id) {
  let nombre = document.getElementById("nombreAdmin").value;
  let edad = document.getElementById("edad").value;
  let pass = document.getElementById("contraseña").value;
  let email = document.getElementById("email").value;
  let usuario = document.getElementById("usuario").value;
  if (parseInt(edad) < 0 || parseInt(edad) > 100) {
    mostrarModal("Edad incorrecta", "mal");
  } else if (!verificarCorreo()) {
    mostrarModal("Correo incorrecto", "mal");
  } else if (!verificarNombre()) {
    mostrarModal("El nombre es incorrecto, verificalo", "mal");
  } else if (!verificarUsuario()) {
    mostrarModal("El usuario es incorrecto", "mal");
  } else if (nombre && edad && pass && email && usuario) {
    usuariosActivos.forEach((el) => {
      if (id === el.id) {
        el.nombre = nombre;
        el.edad = edad;
        el.email = email;
        el.usuario = usuario;
        el.password = pass;
      }
    });
    modificarInformacion(
      "Usuarios",
      nombre,
      pass,
      usuario, 
      edad,
      email,  
      parseInt(id),
    );
    //PARA CUANDO CAMBIE LA IMAGEN
    mostrarModal("Usuario modificado correctamente");
  } else {
    mostrarModal(
      "Por favor, llena correctamente los detalles que modificaste",
      "mal"
    );
  }
}

function imagenCargadaForm() {
  const inputImagen = document.getElementById("input-imagen");

  if (inputImagen) {
    const previewImg = document.getElementById("preview-img");

    inputImagen.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        previewImg.src = "#";
      }
    });
  }
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
