import { entregarImg, entregarURL, subirImagen } from "./firebase.js";
import { modificarInformacion, obtenerTodosLosDocumentos } from "./prueba.js";

//pintar todos los productos
let idProductoModificado;

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  imagenCargadaForm();
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
function cargarProductos(palabraBusqueda) {

  if(palabraBusqueda === ""){
    limpiarDiv()
  }

  let mal = true;
  limpiarDiv();
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
            pintarProductos(foto.url, foto.nombre, foto.id);
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
              pintarProductos(url, nombre, id);
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

function noHayProductos() {
  let noHay = document.createElement("h2");
  let busqueda = document.querySelector(".busqueda-productos");
  noHay.innerHTML = "De momento, no hay productos en el sistema :C";
  noHay.classList.add("texto-centro");
  busqueda.appendChild(noHay);
}

function pintarProductos(foto, nombre, id) {
  const divProductos = document.querySelector(".busqueda-productos");
  let div = document.createElement("div");
  div.classList.add("info");
  div.classList.add(`${id}`);
  div.innerHTML = `
    <img src="${foto}" alt="chicle" class="info-imagen ${id}">
    <p class="info-nombre ${id}">${nombre}</p>
    `;
  divProductos.appendChild(div);

  div.addEventListener("click", (e) => ponerInformacion(e));
}

async function ponerInformacion(e) {
  //LLENAR LOS CAMPOS
  let img = document.getElementById("preview-img");
  let nombre = document.getElementById("nombreProducto");
  let precio = document.getElementById("precio");
  let cantidad = document.getElementById("cantidad");
  let descripcion = document.getElementById("descripcion");

  let productosAlmacenados = await obtenerTodosLosDocumentos("Productos");
  productosAlmacenados.forEach((el) => {
    if (el.id === parseInt(e.target.classList[1])) {
      nombre.value = el.nombre;
      precio.value = el.precio;
      cantidad.value = el.cantidad;
      descripcion.value = el.descripcion;

      entregarURL(parseInt(e.target.classList[1]))
        .then((url) => {
          img.src = url;
        })
        .catch((error) => {
          console.error("Error al obtener la URL de la imagen:", error);
        });
    } else {
      console.log(el.id, e.target.classList[1]);
    }
  });
  let btnEnviar = document.querySelector(".btnEnviar");

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
  let img = document.getElementById("input-imagen");
  let nombre = document.getElementById("nombreProducto").value;
  let precio = document.getElementById("precio").value;
  let cantidad = document.getElementById("cantidad").value;
  let descripcion = document.getElementById("descripcion").value;
  if (parseInt(cantidad) < 0 || parseInt(precio) < 1) {
    mostrarModal("Cantidad incorrecta", "mal");
  } else if (nombre && precio && cantidad && descripcion) {
    let productosAlmacenados = await obtenerTodosLosDocumentos("Productos");

    productosAlmacenados.forEach((el) => {
      if (id === el.id) {
        el.nombre = nombre;
        el.precio = precio;
        el.cantidad = cantidad;
        el.descripcion = descripcion;
      }
    });
    modificarInformacion(
      "Productos",
      nombre,
      cantidad,
      precio,
      descripcion,
      "activo",
      parseInt(id)
    );
    //PARA CUANDO CAMBIE LA IMAGEN
    await subirImagen(nombre, img, id);
    mostrarModal("Producto modificado correctamente");
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
