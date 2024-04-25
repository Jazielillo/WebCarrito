import { entregarImg, entregarURL } from "../admin/js/firebase.js";
import { obtenerTodosLosDocumentos } from "../admin/js/prueba.js";
let nombreBusqueda = obtenerIdDeUrl();

document.addEventListener("DOMContentLoaded", () => {
  buscarProducto(nombreBusqueda);
  ponerUsuario();
  //   busquedaProductos();
});

function ponerUsuario(){
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;
}

function obtenerIdDeUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("nombre");
}

function busquedaProductos() {
  let btnBuscar = document.getElementById("buscarProductos");

  btnBuscar.addEventListener("click", () => {
    let nombre = document.getElementById("searchInput").value;
    window.location.href = `../html/panel-busqueda.html?nombre=${nombre}`;
  });
}

function buscarProducto(nombre) {
  let titulo = document.querySelector(".titulo");
  titulo.innerText = `Productos relacionados a tu busqueda: ${nombre}`;

  cargarProductos(nombre);
}

function cargarProductos(palabraBusqueda) {
  let mal = true;
  // limpiarDiv();
  entregarImg()
    .then(async (fotos) => {
      let productosAlmacenados = await obtenerTodosLosDocumentos("Productos");
      console.log(productosAlmacenados);
      
      if (palabraBusqueda) {
        let productosFiltrados = fotos.filter((foto) =>
          foto.nombre.toLowerCase().includes(palabraBusqueda.toLowerCase())
        );
        productosFiltrados.forEach((foto) => {
          console.log(foto, productosAlmacenados);
          // Agregar la condición dentro del forEach para filtrar los productos
          let productoEncontrado = productosAlmacenados.find(
            (producto) =>
              producto.id === foto.id
          );
          if (productoEncontrado) {
            pintarProductos(foto.url, foto.nombre, foto.id, productosAlmacenados);
          } else {
            console.log(
              foto.id,
              "no cumple con la condición de producto activo"
            );
          }
        });
      } else {
        fotos.forEach(({ url, nombre, id }) => {
          pintarProductos(url, nombre, id);
        });
      }
    })
    .catch((error) => {
      // noHayProductos();
    });
}

function pintarProductos(foto, nombre, id, productosAlmacenados) {
  const divProductos = document.querySelector(".productos-tendencias-totales");

  let productoEncontrado = productosAlmacenados.find(
    (producto) => producto.id === id && producto.cantidad > 0
  );

  console.log(productoEncontrado);

  let divProducto = document.createElement("div");
  divProducto.classList.add("producto");
  divProducto.innerHTML = `
      <div class="foto-producto">
        <img src="${foto}" alt="">
      </div>
      <hr>
      <div class="descripcion-producto">
        <p>${productoEncontrado.nombre}</p>
        <p class="precio">$${productoEncontrado.precio}</p>
      </div>
      <a href="detalle.html?id=${id}">
      <div class="cajita-agregar">
        <div class="agregar">
          <p>Ver detalles</p>
        </div>
      </div>
      </a>
    `;
  divProductos.appendChild(divProducto);
}
