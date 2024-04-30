import {
  obtenerDocumentoPorRol,
  obtenerTodosLosDocumentos,
} from "../admin/js/prueba.js";

let contenedorPrincipal = document.querySelector(".contenedor-principal");
let productosTotales;

function ponerUsuario() {
  let usuario = localStorage.getItem("usuarioActual");
  let p = document.getElementById("nombre");

  p.innerText = usuario;

  return p.innerText;
}

document.addEventListener("DOMContentLoaded", async () => {
  let usuario = await obtenerTodosLosDocumentos("Compras");
  let usuarioActual = usuario.filter((el) => el.usuario === ponerUsuario());
  productosTotales = await obtenerTodosLosDocumentos("Productos");

  generarHistorial(usuarioActual);
});

function generarHistorial(todasCompras) {
  todasCompras.forEach((compra) => {
    let cc = 0;
    let div = document.createElement("div");
    div.classList.add("contenedor-historial", "centrar-texto", "contenedor");

    let stringAux = "";
    stringAux = `
    <div class="historial-fecha">
        <p>Compra realizada el: <span class="fecha">${compra.fecha}</span></p>
    </div>
    `;
    compra.productos.forEach((el) => {
      let objeto = productosTotales.filter((prod) => prod.nombre === el.nombre);
      stringAux += `
      <div class="historia">
      <div class="historia-imagen">
                    <img class="imagen" src="${objeto[0].url}" alt="">
      </div>
        <div class="historia-info">
        <p class="info-nombre">${el.nombre}</p>
      </div>
      <div class="historia-cantidad">
        <p class="info-precio">Cantidad: <span class="cantidad-numero">${el.cantidad}</span></p>
      </div>
      <div class="historia-total">
        <p class="total-cantidad">Total: <span class="simbolo">$</span><span class="cantidad-numero">${el.totalCompra}</span></p>
      </div> 
      </div>
      `;
    });
    div.innerHTML = stringAux;
    contenedorPrincipal.append(div);
  });
}
