import { entregarImg, entregarURL, subirImagen } from "../admin/js/firebase.js";
import { modificarInformacion, obtenerTodosLosDocumentos } from "../admin/js/prueba.js";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  busquedaProductos();
  ponerUsuario();
});

function ponerUsuario(){
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;
}

function busquedaProductos(){
   let btnBuscar = document.getElementById("buscarProductos");

   btnBuscar.addEventListener("click", () => {
    let nombre = document.getElementById("searchInput").value;
    window.location.href = `../html/panel-busqueda.html?nombre=${nombre}`;
   })
}

function cargarProductos(palabraBusqueda) {
    let mal = true;
    let noHay = 0;
    entregarImg()
      .then(async (fotos) => {
        
        let productosAlmacenados = await obtenerTodosLosDocumentos("Productos");
  
        if (palabraBusqueda) {
          let productosFiltrados = fotos.filter((foto) =>
            foto.nombre.toLowerCase().includes(palabraBusqueda.toLowerCase())
          );
          productosFiltrados.forEach((foto) => {
            console.log(foto, productosAlmacenados);
            // Agregar la condición dentro del forEach para filtrar los productos
            let productoEncontrado = productosAlmacenados.find(
              (producto) =>
                producto.id === foto.id && producto.estatus === "activo"
            );
            if (productoEncontrado) {
              pintarProductos(foto.url, foto.nombre, foto.id, productosAlmacenados);
              noHay += 1;
            } else {
              console.log(
                foto.id,
                "no cumple con la condición de producto activo"
              );
            }
          });
        } else {
          let productosActivos = productosAlmacenados.filter(
            (producto) => producto.estatus === "activo"
          );
  
          productosActivos.forEach((el) => {
            fotos.forEach(({ url, nombre, id }) => {
              if (el.id === id) {
                pintarProductos(url, nombre, id, productosAlmacenados);
                noHay += 1;
              }
            });
          });
        }
  
        if(noHay === 0){
          noHayProductos();
        }
      })
      .catch((error) => {});
  
      
  } 

function pintarProductos(foto, nombre, id, productosAlmacenados) {
  const divProductos = document.querySelector(".productos-tendencias-totales");

  let productoEncontrado = productosAlmacenados.find(producto => producto.id === id && producto.cantidad > 0)

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
