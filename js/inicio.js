import { entregarImg, entregarURL, subirImagen } from "../admin/js/firebase.js";
import {
  modificarInformacion,
  obtenerTodosLosDocumentos,
} from "../admin/js/prueba.js";

let productosPintados = [];
let productosAlmacenados;
let contador = 0,
  valorActual = 6,
  paginasTotales = 0, 
  paginaActual = 0;

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  busquedaProductos();
  ponerUsuario();
  eventoPaginacion();
});

function limpiarDiv(clase) {
  let div = document.querySelector(`.${clase}`);

  // Eliminar todos los hijos excepto el primero
  while (div.childElementCount > 0) {
    div.removeChild(div.lastElementChild);
  }
}

function eventoPaginacion() {
  let flechaIzquierda = document.querySelector(".flecha-izquierda"),
    flechaDerecha = document.querySelector(".flecha-derecha");

  flechaIzquierda.addEventListener("click", () => {
    if (valorActual > 0 && paginaActual > 0) {
      limpiarDiv("productos-tendencias-totales");
      contador -= (valorActual * paginaActual);
      valorActual -= 6;
      paginaActual--;
      paginacionProductos();
    }
  });

  flechaDerecha.addEventListener("click", () => {
    let maximoPagina = paginasTotales * 5;
    if (valorActual < maximoPagina) {
      limpiarDiv("productos-tendencias-totales");
      paginaActual++;
      valorActual += 6;
      paginacionProductos();
    }
  });
}

function ponerUsuario() {
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;
}

function busquedaProductos() {
  let btnBuscar = document.getElementById("buscarProductos");

  btnBuscar.addEventListener("click", () => {
    let nombre = document.getElementById("searchInput").value;
    window.location.href = `../html/panel-busqueda.html?nombre=${nombre}`;
  });
}

async function cargarProductos(palabraBusqueda) {
  let mal = true;
  let noHay = 0;

  try {
    let fotos = await entregarImg();
    productosAlmacenados = await obtenerTodosLosDocumentos("Productos");

    if (palabraBusqueda) {
      let productosFiltrados = fotos.filter((foto) =>
        foto.nombre.toLowerCase().includes(palabraBusqueda.toLowerCase())
      );
      productosFiltrados.forEach((foto) => {
        let productoEncontrado = productosAlmacenados.find(
          (producto) => producto.id === foto.id && producto.estatus === "activo"
        );
        if (productoEncontrado) {
          productosPintados.push([foto.url, foto.nombre, foto.id]);
          noHay += 1;
        } else {
          console.log(foto.id, "no cumple con la condición de producto activo");
        }
      });
    } else {
      let productosActivos = productosAlmacenados.filter(
        (producto) => producto.estatus === "activo"
      );

      productosActivos.forEach((el) => {
        fotos.forEach(({ url, nombre, id }) => {
          if (el.id === id) {
            productosPintados.push([url, nombre, id]);
            noHay += 1;
          }
        });
      });
    }

    if (noHay === 0) {
      noHayProductos();
    }
    paginasTotales = Math.round(productosAlmacenados.length / 6);
    paginacionProductos(); // Llamada a la función de paginación después de que productosPintados esté listo
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
  }
}

async function paginacionProductos() {
  for (let i = contador; i < valorActual; i++) {
    let el = productosPintados[i];
    if (contador < valorActual) {
      if (el) {
        pintarProductos(el[0], el[1], el[2], productosAlmacenados);
        contador++;
      } else {
        contador++;
      }
    } else {
      break;
    }
  }

  console.log(contador, valorActual);
}

function pintarProductos(foto, nombre, id, productosAlmacenados) {
  const divProductos = document.querySelector(".productos-tendencias-totales");
  let productoEncontrado = productosAlmacenados.find(
    (producto) => producto.id === id && producto.cantidad > 0
  );

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
