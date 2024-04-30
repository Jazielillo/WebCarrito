import { obtenerTodosLosDocumentos } from "./prueba.js";
let todosLosDocumentos;
let contenedorTabla = document.querySelector(".contenedor-tabla");
let grafica = document.querySelector(".grafica");
let grafica2 = document.querySelector(".grafica2");

document.addEventListener("DOMContentLoaded", async () => {
  todosLosDocumentos = await obtenerTodosLosDocumentos("Compras");
  let thTabla = ["NOMBRE_PRODUCTO", "DINERO_GENERADO"];
  contenedorTabla.append(await construirTabla(ordernarProductos(), thTabla));
  $(".tabla").DataTable({
    lengthChange: false,
    info: false,
    pageLength: 10,
    order: [[1, "desc"]], // Ordenar por la segunda columna (cantidad) de manera descendente
    orderSequence: ["desc", "asc"], // Ordenar de manera descendente por defecto
  });
  construirGrafica(grafica, ordernarProductos(), true);
  construirGrafica(grafica2, ordernarProductos(), false);
});

function ordernarProductos() {
  // Objeto para almacenar la cantidad total vendida de cada producto
  const productosGenerados = {};

  // Recorremos las ventas
  // Recorremos las ventas
  todosLosDocumentos.forEach((venta) => {
    // Recorremos los productos de cada venta
    venta.productos.forEach((producto) => {
      const { nombre, totalCompra } = producto;
      // Si el producto ya está en productosGenerados, sumamos el totalCompra, de lo contrario, lo inicializamos
      productosGenerados[nombre] =
        (productosGenerados[nombre] || 0) + totalCompra;
    });
  });

  // Convertimos el objeto a un array de objetos para poder ordenarlo
  const productosOrdenados = Object.keys(productosGenerados).map((nombre) => ({
    nombre,
    totalCompra: productosGenerados[nombre],
  }));

  // Ordenamos el array de productosOrdenados de mayor a menor totalCompra
  productosOrdenados.sort((a, b) => b.totalCompra - a.totalCompra);

  console.log(productosOrdenados)

  return productosOrdenados;
}

async function construirTabla(datos, thTabla) {
  console.log(datos);
  const div = document.createElement("div");
  div.classList.add("tablas");
  const tabla = document.createElement("table");
  tabla.classList.add("tabla");
  // Encabezado de la tabla
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  thTabla.forEach((thText) => {
    const th = document.createElement("th");
    let titulo = formatText(thText);
    th.textContent = titulo;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  tabla.appendChild(thead);

  // Cuerpo de la tabla
  const tbody = document.createElement("tbody");

  if (datos && datos.length > 0) {
    datos.forEach((fila) => {
      const tr = document.createElement("tr");
      let cc = 0;
      thTabla.forEach((columna) => {
        const td = document.createElement("td");
        if (cc === 0) {
          td.textContent = fila.nombre; // Utilizar directamente la columna como clave
        } else {
          td.textContent = fila.totalCompra;
        }
        tr.appendChild(td);
        cc++;
      });
      tbody.appendChild(tr);
    });
  } else {
    // Crear una fila de "sin datos" si no hay datos
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = "Sin datos disponibles";
    td.colSpan = thTabla.length;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  tabla.appendChild(tbody);
  div.append(tabla);
  // Limpiar y añadir la tabla al contenedor
  return div;
}

function formatText(text) {
  // Paso 1: Reemplazar guiones bajos con espacios
  let formattedText = text.replace(/_/g, " ");

  // Paso 2: Capitalizar la primera letra
  formattedText =
    formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

  return formattedText;
}

function construirGrafica(divDatos, contenido, aux) {
  let titulo;
  if (aux) {
    titulo = "Productos mas generadores";
  } else {
    titulo = "Productos menos generadores";
  }
  divDatos.classList.add("tablas");
  divDatos.innerHTML = `<div id="chartContainer" style="width: 800px;"></div>`;
  activarGrafica(contenido, aux, titulo);
}

function activarGrafica(productos, mostrarMenorAMayor = true, titulo) {
  // Ordenar los productos según la cantidad
  productos.sort((a, b) => a.cantidad - b.cantidad);

  // Si se quiere mostrar de mayor a menor, invertir el orden
  if (!mostrarMenorAMayor) {
    productos.reverse();
  }

  // Tomar solo los primeros 5 productos
  const productosLimitados = productos.slice(0, 5);

  const datasets = productosLimitados.map((producto) => {
    let colorAleatorio = generarColorAleatorio();

    return {
      label: producto.nombre,
      backgroundColor: `${colorAleatorio}`,
      borderColor: `${colorAleatorio}`,
      borderWidth: 1,
      data: [producto.totalCompra],
    };
  });

  const salesData = {
    labels: [`${titulo}`], // O puedes ajustar esto según tus necesidades
    datasets: datasets,
  };

  let canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  document.getElementById("chartContainer").appendChild(canvas);

  // Configurar el contexto y dibujar el gráfico
  var ctx = canvas.getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: salesData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function generarColorAleatorio() {
  const tono = Math.floor(Math.random() * 4); // 0: azul, 1: verde, 2: naranja, 3: amarillo

  let r, g, b;

  switch (tono) {
    case 0: // Azul
      r = Math.floor(Math.random() * 51); // Rango entre 0 y 50
      g = Math.floor(Math.random() * 102); // Rango entre 0 y 100
      b = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
      break;
    case 1: // Verde
      r = Math.floor(Math.random() * 102); // Rango entre 0 y 100
      g = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
      b = Math.floor(Math.random() * 51); // Rango entre 0 y 50
      break;
    case 2: // Naranja
      r = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
      g = Math.floor(Math.random() * 102); // Rango entre 0 y 100
      b = Math.floor(Math.random() * 51); // Rango entre 0 y 50
      break;
    case 3: // Amarillo
      r = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
      g = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
      b = Math.floor(Math.random() * 51); // Rango entre 0 y 50
      break;
    default:
      break;
  }

  return `rgb(${r}, ${g}, ${b})`;
}
