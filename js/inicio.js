import { entregarImg, entregarURL, subirImagen } from "../admin/js/firebase.js";
import {
  modificarInformacion,
  obtenerTodosLosDocumentos,
} from "../admin/js/prueba.js";

let productosPintados = [];
let productosAlmacenados;
let contador = 0;
let paginaActual = 0; // Variable para controlar la página actual

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  busquedaProductos();
  ponerUsuario();
  eventoPaginacion();
});

function eventoPaginacion() {
  let flechaIzquierda = document.querySelector(".flecha-izquierda"),
    flechaDerecha = document.querySelector(".flecha-derecha");

  // flechaIzquierda.addEventListener("click", () => {
  //   paginaAnterior();
  // });

  // flechaDerecha.addEventListener("click", () => {
  //   siguientePagina();
  // });
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

    paginacionProductos(); // Llamada a la función de paginación después de que productosPintados esté listo
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
  }
}

async function paginacionProductos() {
  await cargarProductos(); // Esperar a que cargarProductos termine de cargar los productos

  // Calcular el rango de índices de los productos a mostrar en la página actual
  let inicio = paginaActual * 6; // Suponiendo que cada página muestra 6 productos
  let fin = inicio + 5; // Fin del rango

  console.log(inicio, fin)

  // Verificar si el rango está dentro de los límites del arreglo productosPintados
  if (inicio >= 0 && fin < productosPintados.length) {
    console.log("hola");
    let productosPaginaActual = productosPintados.slice(inicio, fin + 1); // Obtener los productos de la página actual
    productosPaginaActual.forEach((producto) => {
      pintarProductos(
        producto[0],
        producto[1],
        producto[2],
        productosAlmacenados
      );
    });
  } else {
    console.log("No hay más productos para mostrar en esta página.");
  }
}

// Función para avanzar a la siguiente página
function siguientePagina() {
  paginaActual++;
  paginacionProductos();
}

// Función para retroceder a la página anterior
function paginaAnterior() {
  if (paginaActual > 0) {
    paginaActual--;
    paginacionProductos();
  } else {
    console.log("Ya estás en la primera página.");
  }
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
