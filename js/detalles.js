import { entregarImg, entregarURL, subirImagen } from "../admin/js/firebase.js";
import { obtenerTodosLosDocumentos, agregarAlCarrito, entregarId } from "../admin/js/prueba.js";

function obtenerIdDeUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductoPorId(obtenerIdDeUrl());
  ponerUsuario();
});

function ponerUsuario(){
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;
}

async function cargarProductoPorId(id) {
  let productosAlmacenados = await obtenerTodosLosDocumentos("Productos");

  entregarImg()
    .then((fotos) => {
      let fotoEncontrada = fotos.find((foto) => foto.id === parseInt(id));

      if (fotoEncontrada) {
        let producto = productosAlmacenados.find(
          (producto) =>
            producto.id === parseInt(id) && producto.estatus === "activo"
        );
        if (producto) {
          pintarProductos(
            fotoEncontrada.url,
            fotoEncontrada.nombre,
            fotoEncontrada.id,
            productosAlmacenados
          );
        } else {
          console.error("Producto no encontrado o inactivo");
        }
      } else {
        console.error("Foto no encontrada");
      }
    })
    .catch((error) => {
      console.error("Error al obtener las fotos:", error);
    });
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
    }
    mensajeDiv.classList.remove("mal");
  }, 3000); // 2000 milisegundos = 2 segundos
}

async function pintarProductos(foto, nombre, id, productosAlmacenados) {
  let productoEncontrado = productosAlmacenados.find(
    (producto) => producto.id === id && producto.cantidad > 0
  );

  let contenedor = document.querySelector(".contenedor-detalles");

  contenedor.innerHTML = `
            <div class="contenedor-detalles__foto">
                <img src="${foto}" alt="fotoProductos">
            </div>
    
            <div class="contenedor-detalles_texto">
                <h3 class="contenedor-detalles__nombre centrar-texto">${productoEncontrado.nombre}</h3>
                <p class="texto-negritas">Precio: <span class="texto-normal contenedor-detalles__precio">$${productoEncontrado.precio}</span></p>
                <p class="texto-negritas">Descripción: <span class="texto-normal contenedor-detalles__descripcion">${productoEncontrado.descripcion}.</span></p>
                <p class="texto-negritas">Stock: <span class="texto-normal contenedor-detalles__stock">${productoEncontrado.cantidad}</span></p>

                <div class="contenedor-botones">
                    <div class="campo">
                    <p class="texto-negritas">Cantidad:</p>
                    <input type="number" id="numero" min="1" max="${productoEncontrado.cantidad}" >
                    <p id="mensaje-error"></p>
                    </div>
                    <div class="boton__agregar centrar-texto">
                        Agregar al carrito
                    </div>
                </div>
            </div>
    `;

  let input = document.getElementById("numero");

  input.addEventListener("oninput", validarNumero());

  let btnEnviar = document.querySelector(".boton__agregar");

  btnEnviar.addEventListener("click", async (e) => {
    let productoEncontrados = productosAlmacenados.find(
      (producto) => producto.id === id && producto.cantidad > 0
    );

    let inputNumero = document.getElementById("numero").value;
    if (inputNumero === "") {
      mostrarModal("Llena los campos correctamente", "mal");
    } else if (parseInt(inputNumero) > parseInt(productoEncontrados.cantidad)) {
      mostrarModal(
        "No hay suficientes unidades en el almacen para esto",
        "mal"
      );
    } else {
      let nombre = localStorage.getItem("usuarioActual");
      console.log(nombre)
      let aux = await entregarId("Usuarios", "usuario", nombre);
      let idUsuario = aux[0].id;
      let f = await agregarAlCarrito(idUsuario, productoEncontrado.id, parseInt(inputNumero));
      if(f){
        mostrarModal("Producto agregado correctamente al carrito");
      }else{
        mostrarModal("Stock insuficiente", "mal");
      }
    }
  });
}

function ponerCarrito(productoEncontrado, noMasProductos, noPasarAqui) {
  let carritos = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito(productoEncontrado, carritos, noMasProductos, noPasarAqui);
}

function carrito(producto, carrito, noMasProductos, noPasarAqui) {
  // Verificar si el producto ya está en el carrito por su ID
  const productoExistente = carrito.find((item) => item.id === producto.id);

  console.log(noMasProductos);
  if (productoExistente) {
    let aux = parseInt(productoExistente.cantidad) + noMasProductos;
    console.log(aux, noPasarAqui);
    if (aux <= noPasarAqui && noMasProductos >= 1) {
      productoExistente.cantidad =
        parseInt(productoExistente.cantidad) + parseInt(noMasProductos);

      mostrarModal("Producto agregado correctamente");
    } else {
      mostrarModal("No hay suficiente stock, verifica tu carrito", "mal");
    }
  } else {
    if (noMasProductos < 1) {
      mostrarModal("Que andas haciendo tramposo", "mal");
    } else {
      // Si el producto no está en el carrito, agregarlo
      mostrarModal("Producto agregado correctamente");
      console.log(producto);
      carrito.push({ ...producto, cantidad: parseInt(noMasProductos) });
    }
  }

  // Guardar el carrito actualizado en el localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function validarNumero() {
  let input = document.getElementById("numero");
  let valor = parseInt(input.value);
  let min = parseInt(input.min);
  let max = parseInt(input.max);

  if (isNaN(valor) || valor < min || valor > max) {
    document.getElementById(
      "mensaje-error"
    ).textContent = `La cantidad maxima a comprar es de ${max} productos`;
    input.value = ""; // Vaciar el campo si el valor no es válido
  } else {
    document.getElementById("mensaje-error").textContent = "";
  }
}
