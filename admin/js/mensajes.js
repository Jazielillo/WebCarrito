import { eliminarMensaje, obtenerTodosLosDocumentos, modificarEstatusMensaje } from "./prueba.js";

let todosMensajes;
let mensajesLeidos;
let mensajesNoLeidos;
let container = document.querySelector(".container");
document.addEventListener("DOMContentLoaded", async () => {
  todosMensajes = await obtenerTodosLosDocumentos("Mensajes");
  dividirMensajes();
  ponerEventos();
});

function ponerEventos() {
  let cajasMensaje = document.querySelectorAll(".leidos-boton");

  cajasMensaje.forEach((el) => {
    el.addEventListener("click", (e) => {
      abrirMensajes(e);
    });
  });
}

function limpiarDiv(clase) {
  let div = document.querySelector(`.${clase}`);
  let primerHijo = div.firstElementChild; // Obtener el primer hijo del contenedor

  // Eliminar todos los hijos excepto el primero
  while (div.childElementCount > 0) {
    div.removeChild(div.lastElementChild);
  }
}

function abrirMensajes(e) {
  let opcion;
  limpiarDiv("bandeja");
  if (e.target.classList[0] === "leidos") {
    opcion = "leido";
  } else if (e.target.classList[0] === "no-leidos") {
    opcion = "no-leido";
  }

  let bandeja = document.querySelector(".bandeja");

  todosMensajes.forEach((el) => {
    if (el.situacionMensaje === opcion) {
      let div = document.createElement("div");
      div.classList.add("contenedor-mensaje");
      div.innerHTML = `
                <div class="contenedor-mensaje_imagen">
                    <img src="../img/user.png" alt="">
                </div>
                <div class="contenedor-mensaje_info">
                    <p class="mensaje-nombre">${el.nombre}</p>
                    <p class="mensaje-correo">${el.email}</p>
                </div>
                <div class="seccion_usuario">
                    <img class="responder ${el.id}" src="../../img/responder.png" alt="">
                    <img class="borrar ${el.id}" src="../../img/basura.png" alt="">
                </div>
            `;
      bandeja.appendChild(div);
    }
  });

  let responder = document.querySelectorAll(".responder"),
    borrar = document.querySelectorAll(".borrar");

  if (responder && borrar) {
    responder.forEach((el) => {
      el.addEventListener("click", (e) => {
        responderMensaje(parseInt(e.target.classList[1]));
      });
    });

    borrar.forEach((el) => {
      el.addEventListener("click", (e) => {
        borrarMensaje(parseInt(e.target.classList[1]));
      });
    });
  }
}

function responderMensaje(id) {
  modalResponderEmail(id);
}

function borrarMensaje(id) {
  abrirNota(id);
}

function abrirNota(id) {
  let arreglo = [];
  let mensajeAutor;
  todosMensajes.forEach((el) => {
    if (el.id === id) {
      mensajeAutor = el.nombre;
    }
  });
  const div = document.createElement("div");
  div.classList.add("crear-nota");
  div.innerHTML = `
      <div class="salir">
        <i class="fa-solid fa-circle-xmark"></i>
      </div>
      <h3 class="titulo-conf">¿Desea borrar el mensaje de ${mensajeAutor}?</h2>
      <div class="botones">
        <div class="opcion si">Si</div>
        <div class="opcion no">No</div>
      </div>
      `;
  document.body.appendChild(div);

  let opcion = document.querySelectorAll(".opcion");

  opcion.forEach((el) => {
    el.addEventListener("click", (e) => {
      let opcion = e.target.classList[1];
      if (opcion === "no") {
        container.classList.remove("glass");
        document.body.removeChild(document.body.lastChild);
      } else if (opcion === "si") {
        eliminarMsjBD(id);
      }
    });
  });

  container.classList.add("glass");

  const eliminar = document.querySelector(".salir");

  eliminar.addEventListener("click", () => {
    borrarModal();
  });
}

function modalResponderEmail(id) {
  let mensajeAutor, mensajeMensaje;
  todosMensajes.forEach((el) => {
    if (el.id === id) {
      mensajeAutor = el.nombre;
      mensajeMensaje = el.mensaje;
    }
  });
  console.log(mensajeMensaje);
  const div = document.createElement("div");
  div.classList.add("crear-nota-responder");
  div.innerHTML = `
        <div class="salir">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>
        <h3 class="titulo-confi">Mensaje recibido por ${mensajeAutor}</h2>
        <div class="mensaje-no-respondido">
          <p>${mensajeMensaje}</p>
        </div>
        <div class="mensaje-responder">
        <textarea placeholder="Mensaje" id="mensaje"></textarea>
        </div>
        <div class="respuesta-btn">Enviar mensaje</div>
        `;
  document.body.appendChild(div);

  let opcion = document.querySelectorAll(".opcion");

  let btnRespuesta = document.querySelector(".respuesta-btn");

  btnRespuesta.addEventListener("click", () => {
    let mensajeRespondido = document.getElementById("mensaje").value;
    if (mensajeRespondido) {
      //template_zunrknq
      let email, nombre;
      todosMensajes.forEach((el) => {
        if (el.id === id) {
          email = el.email;
          nombre = el.nombre;
        }
      });
      enviarCorreo(nombre, email, mensajeRespondido);
      modificarEstatus(id);
    }
  });

  opcion.forEach((el) => {
    el.addEventListener("click", (e) => {
      let opcion = e.target.classList[1];
      if (opcion === "no") {
        container.classList.remove("glass");
        document.body.removeChild(document.body.lastChild);
      } else if (opcion === "si") {
        eliminarMsjBD(id);
      }
    });
  });

  container.classList.add("glass");

  const eliminar = document.querySelector(".salir");

  eliminar.addEventListener("click", () => {
    borrarModal();
  });
}

async function modificarEstatus(id) {
  //   borrarModal();
  await modificarEstatusMensaje(id, "leido");
  borrarModal();
  dividirMensajes();
}

function borrarModal() {
  container.classList.remove("glass");
  document.body.removeChild(document.body.lastChild);
}

async function eliminarMsjBD(id) {
  await eliminarMensaje(id);
  todosMensajes = await obtenerTodosLosDocumentos("Mensajes");
  dividirMensajes();
  borrarModal();
  limpiarDiv("bandeja");
}

function dividirMensajes() {
  mensajesLeidos = 0;
  mensajesNoLeidos = 0;
  todosMensajes.forEach((el) => {
    if (el.situacionMensaje === "no-leido") {
      mensajesNoLeidos++;
    } else if (el.situacionMensaje === "leido") {
      mensajesLeidos++;
    }
  });

  let leido = document.getElementById("leido"),
    noLeido = document.getElementById("no-leido");
  leido.innerText = `${mensajesLeidos}`;
  noLeido.innerText = `${mensajesNoLeidos}`;
}

function enviarCorreo(nombre, correo, message) {
  const serviceID = "default_service";
  const templateID = "template_zunrknq";

  emailjs
    .send(serviceID, templateID, {
      to_name: nombre,
      reply_to: correo,
      message: message,
    })
    .then(
      () => {
        alert("¡Correo enviado correctamente!");
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
}
