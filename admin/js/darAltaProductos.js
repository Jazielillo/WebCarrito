import { subirImagen } from "./firebase.js";

import { productoIgual, subirInformacion } from "./prueba.js";

const btnEnviar = document.getElementById("btnEnviar");

btnEnviar.addEventListener("click", (e) => {
  comprobarFormulario();
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

async function comprobarFormulario() {
  let nombre = document.getElementById("nombreProducto").value;
  let precio = document.getElementById("precio").value;
  let cantidad = document.getElementById("cantidad").value;
  let descripcion = document.getElementById("descripcion").value;
  let img = document.getElementById("input-imagen");

  if (parseInt(cantidad) < 0 || parseInt(precio) < 1) {
    mostrarModal("Elige una cantidad valida", "mal");
  } else if (
    nombre &&
    precio &&
    cantidad &&
    descripcion &&
    img.files.length > 0
  ) {
    const horaActual = new Date();
    const idProducto = horaActual.getTime();
    // // Verificar si hay productos guardados
    // if (productosGuardados) {
    //   // Convertir el JSON a un arreglo de JavaScript
    //   productosGuardados = JSON.parse(productosGuardados);

    //   // Verificar si el producto ya existe en el arreglo
    //   const productoExistente = productosGuardados.find(
    //     (producto) => producto.nombre === nombre
    //   );
    //   console.log(productoExistente);
    //   if (productoExistente) {
    //     mostrarModal(
    //       "El producto ya se encuentra en el sistema, favor de ingresar otro",
    //       "mal"
    //     );
    //   } else {
    //     // Crear el objeto del producto
    //     const producto = {
    //       id: idProducto,
    //       nombre,
    //       precio,
    //       cantidad,
    //       descripcion,
    //       estatus: "activo",
    //     };

    //     // Agregar el producto al arreglo
    //     productosGuardados.push(producto);

    //     // Convertir el arreglo a JSON y guardar en localStorage
    //     localStorage.setItem("productos", JSON.stringify(productosGuardados));
    
    const prodIgual = await productoIgual(nombre);

    if(prodIgual){
      mostrarModal("El producto ya se encuentra registrado en el sistema","mal")
    }else{
      subirInformacion("Productos",nombre,img,idProducto,cantidad,precio,descripcion,"activo")
      subirImagen(nombre,img,parseInt(idProducto));
      mostrarModal("Producto registrado correctamente :D")
    }
    //PRODUCTO AGREGADO CORRECTAMENTE, QUE APAREZCA ALGO
  } else {
    //AQUI NO ESTAN LLENANDO CORRECTAMENTE EL FORMULARIO
    mostrarModal("Por favor, llena todos los campos del formulario", "mal");
  }
}

const inputImagen = document.getElementById("input-imagen");
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
