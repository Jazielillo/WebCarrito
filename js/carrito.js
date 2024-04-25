import { entregarImg, entregarURL, subirImagen } from "../admin/js/firebase.js";
import {
  entregarId,
  obtenerCarrito,
  obtenerTodosLosDocumentos,
  movimientosCarrito,
  ventaCarrito,
  eliminarCarrito,
} from "../admin/js/prueba.js";
let _carrito = document.querySelector(".productos-totales");
let totalCompra = 0;
let cantProd = 0;

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  ponerUsuario();
});

function ponerUsuario(){
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;
}

let urlsFotos = []; // Declarar el array fuera de la función cargarProductos
async function cargarProductos() {
  totalCompra = 0;
  entregarImg()
    .then(async (fotos) => {
      //EL USUARIO EN EL QUE ESTOY, Y EL CARRITO
      let usuario = localStorage.getItem("usuarioActual");

      let aux = await entregarId("Usuarios", "usuario", usuario);
      let idUsuario = aux[0].id;

      let carrito = await obtenerCarrito(idUsuario);

      fotos.forEach((foto) => {
        carrito.forEach((producto) => {
          if (parseInt(producto.id) === parseInt(foto.id)) {
            urlsFotos.push({ url: foto.url, id: foto.id }); // Agregar objeto con URL e ID al array
          }
        });
      });
      // console.log(urlsFotos);
      pintarMiCosa(urlsFotos, carrito, idUsuario);
    })
    .catch((error) => {
      console.error("Error al obtener las fotos:", error);
    });
}

function pintarMiCosa(url, carrito, idUsuario) {
  //AGARRAR MI CARRITO

  if (carrito) {
    carrito.forEach((el) => {
      rellenarEspacio(el, url);
    });

    ponerTotal();

    agregarEventos(idUsuario);

    let btnContinuarComprar = document.getElementById("continuarCompra");

    btnContinuarComprar.addEventListener("click", () => {
      realizarInventario(idUsuario);
    });
  } else {
    let div = document.querySelector(".productos-totales");

    let h2 = document.createElement("h2");
    h2.classList.add("texto-bonito");
    h2.innerText = "Aun no hay productos agregados al carrito :C";
    div.appendChild(h2);
  }
}

async function realizarInventario(idUsuario) {
  //ocupo conseguir las cantidades de los productos vendidos, y su id;
  let cantidad = document.querySelectorAll(".cantidad");

  cantidad.forEach(async el => {
    await ventaCarrito(idUsuario, parseInt(el.classList[1]), parseInt(el.innerText));
  })

  await eliminarCarrito(idUsuario);
  mostrarModal("Compra realizada correctamente")
  limpiarDiv("productos-totales");
}

function ponerTotal() {
  let total = document.getElementById("cantidadFinal");

  total.innerText = `$${totalCompra}`;
}

function rellenarEspacio(producto, urls) {
  let productosTotales = document.querySelector(".productos-totales");
  let url = urls.find((foto) => foto.id === parseInt(producto.id));
  let div = document.createElement("div");
  div.classList.add("productos-totales-productos");

  let totalProducto =
    parseInt(producto.data.cantidad) * parseInt(producto.data.precio);
  div.innerHTML = `
          <img class="imagen-productos" src="${url.url}" alt="">
                      <div class="descripcion-productos">
                          <p class="nombre-producto">${producto.data.nombre}</p>
                          <p class="nombre-producto eliminar" id="${producto.data.id}">Eliminar</p>
                      </div>
                      <div class="cantidad-productos">
                          <p class="menos ${producto.id}">-</p>
                           <p class="cantidad ${producto.id}">${producto.data.cantidad}</p>
                           <p class="mas ${producto.id}">+</p>
                       </div> 
                       <div class="total-productos">
                                                  <p id="precio" class="precioTotal ${producto.id}">$${totalProducto}</p>
                        </div>                        
          `;
  productosTotales.appendChild(div);
  totalCompra += parseInt(totalProducto);
}

function limpiarDiv(clase) {
  let div = document.querySelector(`.${clase}`);
  let primerHijo = div.firstElementChild; // Obtener el primer hijo del contenedor

  // Eliminar todos los hijos excepto el primero
  while (div.childElementCount > 1) {
    div.removeChild(div.lastElementChild);
  }

  let hr = document.createElement("hr");
  // Limpiar el contenido del primer hijo si es necesario
  div.append(hr);
  cargarProductos();
}

function agregarEventos(idUsuario) {
  let menos = document.querySelectorAll(".menos");
  menos.forEach((el) => {
    el.addEventListener("click", (e) => {
      movimientoCarrito("menos", parseInt(e.target.classList[1]), idUsuario);
    });
  });

  let mas = document.querySelectorAll(".mas");
  mas.forEach((el) => {
    el.addEventListener("click", (e) => {
      movimientoCarrito("mas", parseInt(e.target.classList[1]), idUsuario);
    });
  });

  // let eliminar = document.querySelectorAll(".eliminar");
  // eliminar.forEach((el) => {
  //   el.addEventListener("click", (e) => {
  //     eliminarProductoCarrito(e.target.id);
  //   });
  // });
}

async function movimientoCarrito(operacion, id, idUsuario) {
  let carrito = await obtenerCarrito(idUsuario);
  let objetoEncontrado = carrito.find((item) => parseInt(item.id) === id);

  if (operacion === "mas" && objetoEncontrado) {
    let carritoCorrecto = await movimientosCarrito(idUsuario, id, operacion);
    if (!carritoCorrecto) {
      mostrarModal(
        "No se puede incrementar la cantidad, excede el stock disponible.",
        "bien"
      );
    }
  } else if (operacion === "menos" && objetoEncontrado) {
    let carritoCorrecto = await movimientosCarrito(idUsuario, id, operacion);
    if (!carritoCorrecto) {
      mostrarModal(
        "No se puede incrementar la cantidad, excede el stock disponible.",
        "bien"
      );
    }
  }

  await ponerDatosNuevos(id, idUsuario);
}

async function ponerDatosNuevos(id, idUsuario){
  let cantidad = document.querySelectorAll('.cantidad');
  let cantidadModificable;
  let carrito = await obtenerCarrito(idUsuario);
  
  let cantidadTotalProducto = document.querySelectorAll(".precioTotal");

  cantidad.forEach(el => {
    if(el.classList.contains(id)){
      cantidadModificable = el;
    }
  })

  let cantidadExacta;
  let precio;

  carrito.forEach(el => {
    if(parseInt(el.id) === id){
      cantidadExacta = el.data.cantidad;
      precio = el.data.precio;
    }
  })

  cantidadModificable.innerText = `${cantidadExacta}`;

  cantidadTotalProducto.forEach(el => {
    if(el.classList.contains(id)){
      cantidadModificable = el;
    }
  })
  
  let totalProducto = parseInt(cantidadExacta) * parseInt(precio);

  cantidadModificable.innerText = `$${totalProducto}`
  
  //ponerTotal

  let htmlCantidad = document.querySelectorAll(".cantidad");
  let htmlPrecio = document.querySelectorAll(".precioTotal");

  let auxPrecio = 0;
  let auxCantidad = 0;

  let locuraCantidad = [];

  htmlCantidad.forEach(el => {
    let auxP = parseInt(el.innerText);
    locuraCantidad.push(auxP);
  })

  let locuraPrecio = [];

  htmlPrecio.forEach(el => {
    let nombreWE = el.innerText.replace(/\$/g, '');
    let auxP = parseInt(nombreWE);
    locuraPrecio.push(auxP);
  })

  let cantidadVenta = document.getElementById("cantidadFinal");
  let auxVenta = 0;
  
  for (let i = 0; i < locuraCantidad.length; i++) {
    auxVenta += locuraPrecio[i];
  }
  cantidadVenta.innerText = `$${auxVenta}`;
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
    }
    mensajeDiv.classList.remove("mal");
  }, 3000); // 2000 milisegundos = 2 segundos
}
