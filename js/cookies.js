const contenedor = document.querySelector(".container");
const btnConfiguracion = document.querySelector(".panel-btn");
const header = document.querySelector(".header");
const contenidoPrincipal = document.querySelector(".principal-pagina");
const footer = document.querySelector(".parte-abajo");
let arreglo = [header, contenidoPrincipal, footer];
let usuario;

document.addEventListener('DOMContentLoaded', function () {
    const sesionIniciada = localStorage.getItem('sesionIniciada');
    const usuarioActual = localStorage.getItem('usuarioActual');
    us = document.getElementById("nombre");

    if (sesionIniciada === 'true' && usuarioActual) {
        // El usuario ha iniciado sesión
        us.innerText = `${usuarioActual}`;
        usuario = usuarioActual;
        cargarConfiguracionDesdeCookies(usuario)
        // Aquí puedes mostrar contenido específico para usuarios autenticados
    } else {
        // No hay sesión iniciada, redirigir a la página de inicio de sesión
        window.location.href = './login.html'; // Cambia esto por la ruta de tu página de inicio de sesión
    }
});

btnConfiguracion.addEventListener("click", (e) => {
  contenedor.lastElementChild.classList.add("hidden");
  abrirNota();
});

function abrirNota() {
  const div = document.createElement("div");
  div.classList.add("crear-nota");
  div.innerHTML = `
    <div class="salir">
      <i class="fa-solid fa-circle-xmark"></i>
    </div>
    <h2 class="titulo-conf">Configuración</h2>
    <div class="opciones">
      <div class="opcion">
        <h3 class="opciones-fondo">Fondo</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-enlace">Enlaces</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-imagenes">Imagenes</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-texto">Texto</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-configuracion-back">Restablecer configuracion</h3>
      </div>
    </div>
    `;
  document.body.appendChild(div);

  arreglo.forEach((el) => {
    el.classList.add("glass");
  });

  const eliminar = document.querySelector(".salir");

  eliminar.addEventListener("click", () => {
    cerrar();
  });

  let opcionesConfiguracion = document.querySelectorAll(".opcion h3");

  opcionesConfiguracion.forEach((el) => {
    el.addEventListener("click", (e) => {
      configuracion(e.target);
    });
  });
}

function configuracion(nombre) {
  const divTexto = document.querySelector(".crear-nota .opciones");
  while (divTexto.firstChild) {
    divTexto.removeChild(divTexto.firstChild);
  }

  const tituloTexto = document.querySelector(".crear-nota .titulo-conf");

  tituloTexto.innerText = `${nombre.textContent}`;

  if (nombre.textContent === "Fondo") {
    fondos(tituloTexto, divTexto, "fondo-cuerpo");
  } else if (nombre.textContent === "Enlaces") {
    tituloTexto.innerText = `Elige la propiedad a modificar:`;
    divTexto.innerHTML = `
      <hr>
      <div class="opciones">
      <div class="opcion">
        <h3 class="opciones-redondear">Redondear enlaces</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-color-fondo">Color de fondo de enlace</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-color-enlace">Color de texto de enlace</h3>
      </div>
    </div>
    `;

    let opcionesEnlace = document.querySelectorAll(".opcion h3");

    opcionesEnlace.forEach((el) => {
      el.addEventListener("click", (e) => {
        enlaces(e.target);
      });
    });
  } else if (nombre.textContent === "Imagenes") {
    tituloTexto.innerText = `Elige la propiedad a modificar:`;
    divTexto.innerHTML = `
      <hr>
      <div class="opciones">
      <div class="opcion">
        <h3 class="opciones-tamaño">Tamaño de imagenes</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-color-borde">Color de borde de imagen</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-redondeo">Redondeo de esquinas</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-sombras">Sombras</h3>
      </div>
    </div>
    `;

    let opcionesImagenes = document.querySelectorAll(".opcion h3");

    opcionesImagenes.forEach((el) => {
      el.addEventListener("click", (e) => {
        imagenes(e.target);
      });
    });
  } else if (nombre.textContent === "Texto") {
    tituloTexto.innerText = `Elige la propiedad a modificar:`;
    divTexto.innerHTML = `
      <hr>
      <div class="opciones">
      <div class="opcion">
        <h3 class="opciones-tamaño">Tamaño de texto</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-color-texto">Color de texto</h3>
      </div>
      <div class="opcion">
        <h3 class="opciones-fondo">Color de fondo</h3>
      </div>
    </div>
    `;

    let opcionesImagenes = document.querySelectorAll(".opcion h3");

    opcionesImagenes.forEach((el) => {
      el.addEventListener("click", (e) => {
        texto(e.target);
      });
    });
  } else if (nombre.textContent === "Restablecer configuracion") {
    tituloTexto.innerText = "Bien hecho :D"
    limpiarTodo();
    divTexto.innerHTML = `
      <h1 class="centrado">La configuracion se restablecido correctamente</h2>
    `
  }
}

function limpiarTodo() {
  limpiarCookie('backcolor'+`_${usuario}`);

    limpiarCookie('round-link'+`_${usuario}`)

    limpiarCookie('backcolor-link'+`_${usuario}`);

    limpiarCookie('color-link'+`_${usuario}`)

    limpiarCookie('widhtimg'+`_${usuario}`)

    limpiarCookie('borderimg'+`_${usuario}`)

    limpiarCookie('bordersizeimg'+`_${usuario}`)
  
    limpiarCookie('borderroundimg'+`_${usuario}`)

    limpiarCookie('shadow-enabled'+`_${usuario}`)

    limpiarCookie('tablebordercolor'+`_${usuario}`)

    limpiarCookie('tabletitlecolor'+`_${usuario}`)
    
    limpiarCookie('textcolor'+`_${usuario}`)
 
    limpiarCookie('textsize'+`_${usuario}`)

    limpiarCookie('textbackcolor'+`_${usuario}`)
      
    limpiarCookie('titlecolor'+`_${usuario}`)

    limpiarCookie('titlesize'+`_${usuario}`)

    limpiarCookie('titlebackcolor'+`_${usuario}`)

    limpiarCookie('subtitlecolor'+`_${usuario}`)

    limpiarCookie('subtitlesize'+`_${usuario}`)

    limpiarCookie('subtitlebackcolor'+`_${usuario}`)
  // Obtén todos los elementos que tienen el atributo 'style' establecido
var elementosConStyle = document.querySelectorAll('[style]');

// Itera sobre todos los elementos con atributo 'style' y elimina el atributo
elementosConStyle.forEach(function(elemento) {
    elemento.removeAttribute('style');
});
  
}

function texto(tipoTexto) {
  const divTexto = document.querySelector(".crear-nota .opciones");
  while (divTexto.firstChild) {
    divTexto.removeChild(divTexto.firstChild);
  }

  const tituloTexto = document.querySelector(".crear-nota .titulo-conf");

  tituloTexto.innerText = `${tipoTexto.textContent}`;

  if (tipoTexto.textContent === "Tamaño de texto") {
    tituloTexto.innerText = `Elige el tamaño del texto:`;
    divTexto.innerHTML = `
    <hr>
      
    <div class="enlaces-form">
      <input type="range" id="nivel" name="nivel" min="1" max="50" value="1">
      <p id="enlace" class="texto-prueba">Texto de prueba</p>
    </div>

  `;
    // Seleccionar el input de tipo rango y el enlace
    const inputRango = document.getElementById("nivel");
    const enlace = document.getElementById("enlace");

    let valor;

    // Agregar un event listener para detectar cambios en el rango
    inputRango.addEventListener("input", function () {
      if (!document.querySelector(".btnCambios")) {
        // Crear el botón de "Aplicar cambios"
        let divBtn = document.createElement("div");
        divBtn.classList.add("btnCambios");
        divBtn.innerHTML = `
        <button class="button">Aplicar cambios</button>
      `;

        // Agregar el botón al final del div
        document.querySelector(".enlaces-form").appendChild(divBtn);

        divBtn.addEventListener("click", () => {
          ponterTexto();
        });
      }
      // Obtener el valor del rango
      let valorRango = inputRango.value;

      // Ajustar el radio de borde del enlace según el valor del rango
      enlace.style.fontSize = valorRango + "px";
    });
  } else if (tipoTexto.textContent === "Color de texto") {
    color1 = "texto1";
    color2 = "texto2";
    color3 = "texto3";
    tituloTexto.innerText = `Elige el color de texto:`;
    divTexto.innerHTML = `
      <hr>
      <div class="grid-colores">
        <div class="color ${color1}"></div>
        <div class="color ${color2}"></div>
        <div class="color ${color3}"></div>
      </div>
    `;
    let band = false;
    let divColores = document.querySelectorAll(".color");

    divColores.forEach((divColor) => {
      divColor.addEventListener("click", function () {
        // Remover la clase 'clicked' de todos los elementos
        divColores.forEach((divColor) => {
          divColor.classList.remove("clicked");
        });
        // Agregar la clase 'clicked' solo al elemento clicado
        this.classList.add("clicked");
        band = true;
      });
    });

    divColores.forEach((color) => {
      color.addEventListener("click", (e) => {
        if (band) {
          aplicarColorTexto(e.target, divTexto, tipoTexto);
          band = false;
        }
      });
    });
  } else if (tipoTexto.textContent === "Color de fondo") {
    color1 = "txt1";
    color2 = "txt2";
    color3 = "txt3";
    tituloTexto.innerText = `Elige el color de fondo:`;
    divTexto.innerHTML = `
      <hr>
      <div class="grid-colores">
        <div class="color ${color1}"></div>
        <div class="color ${color2}"></div>
        <div class="color ${color3}"></div>
      </div>
    `;
    let band = false;
    let divColores = document.querySelectorAll(".color");

    divColores.forEach((divColor) => {
      divColor.addEventListener("click", function () {
        // Remover la clase 'clicked' de todos los elementos
        divColores.forEach((divColor) => {
          divColor.classList.remove("clicked");
        });
        // Agregar la clase 'clicked' solo al elemento clicado
        this.classList.add("clicked");
        band = true;
      });
    });

    divColores.forEach((color) => {
      color.addEventListener("click", (e) => {
        if (band) {
          aplicarColorFondoTexto(e.target, divTexto, tipoTexto);
          band = false;
        }
      });
    });
  }
}

function aplicarColorFondoTexto(color, divTexto, tipoTexto) {
  if (!divTexto.querySelector(".btnCambios")) {
    let divBtn = document.createElement("div");
    divBtn.classList.add("btnCambios");
    divBtn.innerHTML = `
      <button class="button">Aplicar cambios</button>
    `;

    divTexto.appendChild(divBtn);

    divBtn.querySelector(".button").addEventListener("click", () => {
      // Aquí puedes usar la variable opcionSeleccionada para acceder al valor seleccionado
      aplicarColorFondos();
    });
  }
}

function aplicarColorFondos() {
  let color = document.querySelectorAll(".color");
  let colorFondo;
  color.forEach((el) => {
    if (el.classList[2] === "clicked") {
      colorFondo = el.classList[1];
    }
  });
  let enlaces = document.querySelectorAll("p");
  let titulo = document.querySelectorAll("h1");
  let titulo1 = document.querySelectorAll("h2");
  let titulo2 = document.querySelectorAll("h3");

  if (colorFondo === "txt1") {
    let colors = "#b56ba5";
    enlaces.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo1.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo2.forEach((el) => {
      el.style.backgroundColor = colors;
    });

    guardarConfiguracionEnCookies("textbackcolor", colors, usuario);
    guardarConfiguracionEnCookies("titlebackcolor", colors, usuario);
    guardarConfiguracionEnCookies("subtitlebackcolor", colors , usuario);
  } else if ((colorFondo = "txt2")) {
    let colors = "#51404d";
    enlaces.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo1.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo2.forEach((el) => {
      el.style.backgroundColor = colors;
    });

    guardarConfiguracionEnCookies("textbackcolor", colors , usuario);
    guardarConfiguracionEnCookies("titlebackcolor", colors , usuario);
    guardarConfiguracionEnCookies("subtitlebackcolor", colors , usuario);
  } else if ((colorFondo = "txt3")) {
    let colors = "#61d1b3";
    enlaces.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo1.forEach((el) => {
      el.style.backgroundColor = colors;
    });
    titulo2.forEach((el) => {
      el.style.backgroundColor = colors;
    });

    guardarConfiguracionEnCookies("textbackcolor", colors , usuario);
    guardarConfiguracionEnCookies("titlebackcolor", colors , usuario);
    guardarConfiguracionEnCookies("subtitlebackcolor", colors , usuario);
  }

  cerrar();
}

function aplicarColorTexto(color, divTexto, tipoFondo) {
  if (!divTexto.querySelector(".btnCambios")) {
    let divBtn = document.createElement("div");
    divBtn.classList.add("btnCambios");
    divBtn.innerHTML = `
      <button class="button">Aplicar cambios</button>
    `;

    divTexto.appendChild(divBtn);

    divBtn.querySelector(".button").addEventListener("click", () => {
      // Aquí puedes usar la variable opcionSeleccionada para acceder al valor seleccionado
      aplicarColor();
    });
  }
}

function aplicarColor() {
  let color = document.querySelectorAll(".color");
  let colorFondo;
  color.forEach((el) => {
    if (el.classList[2] === "clicked") {
      colorFondo = el.classList[1];
    }
  });
  let enlaces = document.querySelectorAll("p");
  let titulo = document.querySelectorAll("h1");
  let titulo1 = document.querySelectorAll("h2");
  let titulo2 = document.querySelectorAll("h3");

  if (colorFondo === "texto1") {
    let colors = "#DE1A1A";
    enlaces.forEach((el) => {
      el.style.color = "#DE1A1A";
    });
    titulo.forEach((el) => {
      el.style.color = "#DE1A1A";
    });
    titulo1.forEach((el) => {
      el.style.color = "#DE1A1A";
    });
    titulo2.forEach((el) => {
      el.style.color = "#DE1A1A";
    });

    guardarConfiguracionEnCookies("textcolor", colors, usuario);
    guardarConfiguracionEnCookies("titlecolor", colors, usuario);
    guardarConfiguracionEnCookies("subtitlecolor", colors , usuario);
  } else if ((colorFondo = "texto2")) {
    let colors = "#FFDD4A";
    enlaces.forEach((el) => {
      el.style.color = "#FFDD4A";
    });
    titulo.forEach((el) => {
      el.style.color = "#FFDD4A";
    });
    titulo1.forEach((el) => {
      el.style.color = "#FFDD4A";
    });
    titulo2.forEach((el) => {
      el.style.color = "#FFDD4A";
    });

    guardarConfiguracionEnCookies("textcolor", colors, usuario);
    guardarConfiguracionEnCookies("titlecolor", colors, usuario);
    guardarConfiguracionEnCookies("subtitlecolor", colors, usuario);
  } else if ((colorFondo = "texto3")) {
    let colors = "#16DB65";
    enlaces.forEach((el) => {
      el.style.color = "#16DB65";
    });
    titulo.forEach((el) => {
      el.style.color = "#16DB65";
    });
    titulo1.forEach((el) => {
      el.style.color = "#16DB65";
    });
    titulo2.forEach((el) => {
      el.style.color = "#16DB65";
    });

    guardarConfiguracionEnCookies("textcolor", colors, usuario);
    guardarConfiguracionEnCookies("titlecolor", colors, usuario);
    guardarConfiguracionEnCookies("subtitlecolor", colors, usuario);
  }

  cerrar();
}

function ponterTexto() {
  let parrafos = document.querySelectorAll("p");

  const inputRango = document.getElementById("nivel").value;
  console.log(parrafos);
  parrafos.forEach((el) => {
    el.style.fontSize = `${inputRango}px`;
    guardarConfiguracionEnCookies("textsize", `${inputRango}px`, usuario);
  });

  cerrar();
}

function imagenes(tipoImagen) {
  const divTexto = document.querySelector(".crear-nota .opciones");
  while (divTexto.firstChild) {
    divTexto.removeChild(divTexto.firstChild);
  }

  const tituloTexto = document.querySelector(".crear-nota .titulo-conf");

  tituloTexto.innerText = `${tipoImagen.textContent}`;

  if (tipoImagen.textContent === "Tamaño de imagenes") {
    tituloTexto.innerText = `Elige el tamaño de las imagenes:`;
    divTexto.innerHTML = `
      <hr>
      
      <div class="grid-colores">
        <div class="border color imagen-grande"><p>Grande</p></div>
        <div class="border color imagen-mediana"><p>Mediana</p></div>
        <div class="border color imagen-chica"><p>Chica</p></div>
      </div>
    `;

    let band = false;
    let divColores = document.querySelectorAll(".color");

    divColores.forEach((divColor) => {
      divColor.addEventListener("click", function () {
        // Remover la clase 'clicked' de todos los elementos
        divColores.forEach((divColor) => {
          divColor.classList.remove("clicked");
        });
        // Agregar la clase 'clicked' solo al elemento clicado
        this.classList.add("clicked");
        band = true;
      });
    });

    divColores.forEach((color) => {
      color.addEventListener("click", (e) => {
        if (band) {
          aplicarImagenTamaño(e.target, divTexto, tipoImagen);
          band = false;
        }
      });
    });
  } else if (tipoImagen.textContent === "Color de borde de imagen") {
    tituloTexto.innerText = `Elige el tamaño y color de los bordes:`;
    divTexto.innerHTML = `
      <hr>
      
      <div class="grid-colores">
        <div class="color borde-grueso flex"><p>Grande</p></div>
        <div class="color borde-mediano flex"><p>Mediana</p></div>
        <div class="color borde-chico flex"><p>Chica</p></div>
      </div>

      <div class="flex margin-top">
        <label for="color">Selecciona un color:</label>
        <input type="color" id="color" name="color" value="000">
      </div>

    `;

    const inputColor = document.getElementById("color");

    // Agregar un event listener para detectar cambios en el color
    inputColor.addEventListener("input", function () {
      const nuevoColor = this.value;

      // Obtener todos los elementos con las clases de borde
      const bordes = document.querySelectorAll(
        ".borde-grueso, .borde-mediano, .borde-chico"
      );

      // Aplicar el nuevo color de borde a cada elemento
      bordes.forEach((borde) => {
        borde.style.borderColor = nuevoColor;
      });
    });

    let band = false;
    let divColores = document.querySelectorAll(".color");

    divColores.forEach((divColor) => {
      divColor.addEventListener("click", function () {
        // Remover la clase 'clicked' de todos los elementos
        divColores.forEach((divColor) => {
          divColor.classList.remove("clicked");
        });
        // Agregar la clase 'clicked' solo al elemento clicado
        this.classList.add("clicked");
        band = true;
      });
    });

    divColores.forEach((color) => {
      color.addEventListener("click", (e) => {
        if (band) {
          aplicarGrosor(e.target, divTexto, tipoImagen);
          band = false;
        }
      });
    });
  } else if (tipoImagen.textContent === "Redondeo de esquinas") {
    tituloTexto.innerText = `Elige el redondeo de esquinas:`;
    divTexto.innerHTML = `
    <hr>
      
    <div class="enlaces-form">
      <div class="no-flex">
      <input type="range" id="nivel" name="nivel" min="1" max="100" value="1">
      <img  id="enlace" src="programacion.jpg">
      </div>
    </div>

  `;
    // Seleccionar el input de tipo rango y el enlace
    const inputRango = document.getElementById("nivel");
    const enlace = document.getElementById("enlace");

    let valor;

    // Agregar un event listener para detectar cambios en el rango
    inputRango.addEventListener("input", function () {
      if (!document.querySelector(".btnCambios")) {
        // Crear el botón de "Aplicar cambios"
        let divBtn = document.createElement("div");
        divBtn.classList.add("btnCambios");
        divBtn.innerHTML = `
        <button class="button">Aplicar cambios</button>
      `;

        // Agregar el botón al final del div
        document.querySelector(".enlaces-form").appendChild(divBtn);

        divBtn.addEventListener("click", () => {
          aplicarRadioImg();
        });
      }
      // Obtener el valor del rango
      let valorRango = inputRango.value;

      // Ajustar el radio de borde del enlace según el valor del rango
      enlace.style.borderRadius = valorRango + "px";
    });
  } else if (tipoImagen.textContent === "Sombras") {
    tituloTexto.innerText = `Elige la cantidad de sombras:`;
    divTexto.innerHTML = `
      <hr>
      
      <div class="grid-colores">
        <div class="border color mucha"><p>Mucha</p></div>
        <div class="border color normal"><p>Normal</p></div>
        <div class="border color poca"><p>Poca</p></div>
      </div>
    `;

    let band = false;
    let divColores = document.querySelectorAll(".color");

    divColores.forEach((divColor) => {
      divColor.addEventListener("click", function () {
        // Remover la clase 'clicked' de todos los elementos
        divColores.forEach((divColor) => {
          divColor.classList.remove("clicked");
        });
        // Agregar la clase 'clicked' solo al elemento clicado
        this.classList.add("clicked");
        band = true;
      });
    });

    divColores.forEach((color) => {
      color.addEventListener("click", (e) => {
        if (band) {
          aplicarImagenSombra(e.target, divTexto, tipoImagen);
          band = false;
        }
      });
    });
  }
}

function aplicarImagenSombra(color, divTexto, tipoImagen) {
  if (!divTexto.querySelector(".btnCambios")) {
    let divBtn = document.createElement("div");
    divBtn.classList.add("btnCambios");
    divBtn.innerHTML = `
      <button class="button">Aplicar cambios</button>
    `;

    divTexto.appendChild(divBtn);

    divBtn.querySelector(".button").addEventListener("click", () => {
      // Aquí puedes usar la variable opcionSeleccionada para acceder al valor seleccionado
      aplicarSombra();
    });
  }
}

function aplicarSombra() {
  let color = document.querySelectorAll(".color");
  let colorFondo;
  color.forEach((el) => {
    if (el.classList[3] === "clicked") {
      colorFondo = el.classList[2];
    }
  });

  let imagenes = document.querySelectorAll("img");

  imagenes.forEach((el) => {
    if (colorFondo === "poca") {
      el.style.boxShadow = "0 0 1rem rgba(231, 23, 0, 0.7)"; // Activar sombra
      guardarConfiguracionEnCookies(
        "shadow-enabled",
        "0 0 1rem rgba(231, 23, 0, 0.7)", usuario
      );
    } else if (colorFondo === "normal") {
      el.style.boxShadow = "0 0 5rem rgba(126, 18, 18, 0.7)";
      guardarConfiguracionEnCookies(
        "shadow-enabled",
        "0 0 5rem rgba(126, 18, 18, 0.7)", usuario
      );
    } else if (colorFondo === "mucha") {
      el.style.boxShadow = "0 0 10rem rgba(0, 105, 68, 0.7)";
      guardarConfiguracionEnCookies(
        "shadow-enabled",
        "0 0 10rem rgba(0, 105, 68, 0.7)", usuario
      );
    }
  });

  cerrar();
}

function aplicarRadioImg() {
  const inputRango = document.getElementById("nivel").value;

  let img = document.querySelectorAll("img");

  img.forEach((i) => {
    i.style.borderRadius = inputRango + "px";
    guardarConfiguracionEnCookies("borderroundimg", `${inputRango}px`, usuario);
  });

  cerrar();
}

function aplicarGrosor(color, divTexto, tipoImagen) {
  if (!divTexto.querySelector(".btnCambios")) {
    let divBtn = document.createElement("div");
    divBtn.classList.add("btnCambios");
    divBtn.innerHTML = `
      <button class="button">Aplicar cambios</button>
    `;

    divTexto.appendChild(divBtn);

    divBtn.querySelector(".button").addEventListener("click", () => {
      // Aquí puedes usar la variable opcionSeleccionada para acceder al valor seleccionado
      aplicarGrosorColor();
    });
  }
}

function aplicarGrosorColor() {
  let color1 = document.getElementById("color").value;

  let color = document.querySelectorAll(".color");
  let colorFondo;
  color.forEach((el) => {
    if (el.classList[3] === "clicked") {
      colorFondo = el.classList[1];
    }
  });

  let imagenes = document.querySelectorAll("img");

  imagenes.forEach((el) => {
    if (colorFondo === "borde-grueso") {
      el.style.border = "3rem solid " + color1;
      bordeImagen(color1);
      guardarConfiguracionEnCookies("bordersizeimg", "3rem", usuario);
    } else if (colorFondo === "borde-mediano") {
      el.style.border = "2rem solid " + color1;
      bordeImagen(color1);
      guardarConfiguracionEnCookies("bordersizeimg", "2rem", usuario);
    } else if (colorFondo === "borde-chico") {
      el.style.border = ".5rem solid " + color1;
      guardarConfiguracionEnCookies("bordersizeimg", "1rem", usuario);
      bordeImagen(color1);
    }
  });

  cerrar();
}

function aplicarImagenTamaño(color, divTexto, tipoImagen) {
  if (!divTexto.querySelector(".btnCambios")) {
    let divBtn = document.createElement("div");
    divBtn.classList.add("btnCambios");
    divBtn.innerHTML = `
      <button class="button">Aplicar cambios</button>
    `;

    divTexto.appendChild(divBtn);

    divBtn.querySelector(".button").addEventListener("click", () => {
      // Aquí puedes usar la variable opcionSeleccionada para acceder al valor seleccionado
      ajustarImagen();
    });
  }
}

function ajustarImagen() {
  let tamaño = document.querySelectorAll(".color");
  let tamañoTotal;
  tamaño.forEach((el) => {
    if (el.classList[3] === "clicked") {
      tamañoTotal = el.classList[2];
    }
  });

  if (tamañoTotal === "imagen-chica") {
    sizeImagen(1);
  } else if (tamañoTotal === "imagen-mediana") {
    sizeImagen(2);
  } else if (tamañoTotal === "imagen-grande") {
    sizeImagen(3);
  }

  cerrar();
}

function fondos(tituloTexto, divTexto, tipoFondo) {
  let color1, color2, color3;

  if (tipoFondo === "fondo-texto") {
    color1 = "texto1";
    color2 = "texto2";
    color3 = "texto3";
  } else {
    color1 = "azul-muy-fuerte";
    color2 = "azul-fuerte";
    color3 = "azul";
  }

  tituloTexto.innerText = `Elige el color de fondo:`;
  divTexto.innerHTML = `
      <hr>
      <div class="grid-colores">
        <div class="color ${color1}"></div>
        <div class="color ${color2}"></div>
        <div class="color ${color3}"></div>
      </div>
    `;
  let band = false;
  let divColores = document.querySelectorAll(".color");

  divColores.forEach((divColor) => {
    divColor.addEventListener("click", function () {
      // Remover la clase 'clicked' de todos los elementos
      divColores.forEach((divColor) => {
        divColor.classList.remove("clicked");
      });
      // Agregar la clase 'clicked' solo al elemento clicado
      this.classList.add("clicked");
      band = true;
    });
  });

  divColores.forEach((color) => {
    color.addEventListener("click", (e) => {
      if (band) {
        aplicarFondoColor(e.target, divTexto, tipoFondo);
        band = false;
      }
    });
  });
}

function enlaces(tipoEnlae) {
  const divTexto = document.querySelector(".crear-nota .opciones");
  while (divTexto.firstChild) {
    divTexto.removeChild(divTexto.firstChild);
  }

  const tituloTexto = document.querySelector(".crear-nota .titulo-conf");

  tituloTexto.innerText = `${tipoEnlae.textContent}`;

  if (tipoEnlae.textContent === "Redondear enlaces") {
    tituloTexto.innerText = `Elige el tamaño del redondeo:`;
    divTexto.innerHTML = `
      <hr>
      
      <div class="enlaces-form">
        <input type="range" id="nivel" name="nivel" min="1" max="50" value="1">
        <a class="enlace_rango" id="enlace">Contenedor de informacion</a>
      </div>

    `;
    // Seleccionar el input de tipo rango y el enlace
    const inputRango = document.getElementById("nivel");
    const enlace = document.getElementById("enlace");

    let valor;

    // Agregar un event listener para detectar cambios en el rango
    inputRango.addEventListener("input", function () {
      if (!document.querySelector(".btnCambios")) {
        // Crear el botón de "Aplicar cambios"
        let divBtn = document.createElement("div");
        divBtn.classList.add("btnCambios");
        divBtn.innerHTML = `
          <button class="button">Aplicar cambios</button>
        `;

        // Agregar el botón al final del div
        document.querySelector(".enlaces-form").appendChild(divBtn);

        divBtn.addEventListener("click", () => {
          aplicarRedondeoEnlaces();
        });
      }
      // Obtener el valor del rango
      let valorRango = inputRango.value;

      // Ajustar el radio de borde del enlace según el valor del rango
      enlace.style.borderRadius = valorRango + "px";
    });
  } else if (tipoEnlae.textContent === "Color de fondo de enlace") {
    fondos(tipoEnlae, divTexto, "fondo-enlaces");
  } else if (tipoEnlae.textContent === "Color de texto de enlace") {
    fondos(tipoEnlae, divTexto, "fondo-texto");
  }
}

function aplicarRedondeoEnlaces() {
  let enlaceRedondo = document.getElementById("nivel");

  let cantidad = enlaceRedondo.value;

  let enlacesTodos = document.querySelectorAll("a");

  enlacesTodos.forEach((enlace) => {
    enlace.style.borderRadius = cantidad + "px";
  });

  redondeoLinks(`${cantidad}px`);

  cerrar();
}

function aplicarFondoColor(color, divTexto, tipoFondo) {
  console.log(divTexto);
  if (!divTexto.querySelector(".btnCambios")) {
    let divBtn = document.createElement("div");
    divBtn.classList.add("btnCambios");
    divBtn.innerHTML = `
      <button class="button">Aplicar cambios</button>
    `;

    divTexto.appendChild(divBtn);

    divBtn.querySelector(".button").addEventListener("click", () => {
      // Aquí puedes usar la variable opcionSeleccionada para acceder al valor seleccionado
      pintarFondo(tipoFondo);
    });
  }
}

function cerrar() {
  arreglo.forEach((el) => {
    el.classList.remove("glass");
  });
  document.body.removeChild(document.body.lastChild);
  contenedor.lastElementChildocument.classList.remove("hidden");
}

function pintarFondo(tipoFondo) {
  let color = document.querySelectorAll(".color");
  let colorFondo;
  document.body.classList.remove("azul-muy-fuerte", "azul-fuerte", "azul");
  color.forEach((el) => {
    if (el.classList[2] === "clicked") {
      colorFondo = el.classList[1];
    }
  });

  if (tipoFondo === "fondo-cuerpo") {
    if (colorFondo === "azul-muy-fuerte") {
      cambiarBody("#150811");
    } else if (colorFondo === "azul-fuerte") {
      cambiarBody("#0F084B");
    } else if (colorFondo === "azul") {
      cambiarBody("#26408B");
    }
  } else if (tipoFondo === "fondo-enlaces") {
    let enlaces = document.querySelectorAll(".nav-principal a");

    enlaces.forEach((el) => {
      if (colorFondo === "azul-muy-fuerte") {
        fondoLinks("#150811");
      } else if (colorFondo === "azul-fuerte") {
        fondoLinks("#0F084B");
      } else if (colorFondo === "azul") {
        fondoLinks("#26408B");
      }
    });
  } else if (tipoFondo === "fondo-texto") {
    let textoEnlace = document.querySelectorAll(".nav-principal a");
    textoEnlace.forEach((el) => {
      if (colorFondo === "texto1") {
        textoLinks("#DE1A1A");
      } else if (colorFondo === "texto2") {
        textoLinks("#FFDD4A");
      } else if (colorFondo === "texto3") {
        textoLinks("#16DB65");
      }
    });
  }
  cerrar();
}

function bordeImagen(color) {
  guardarConfiguracionEnCookies("borderimg", color, usuario);
}

function sizeImagen(size) {
  var imagenes = document.querySelectorAll("img");

  imagenes.forEach(function (imagen) {
    switch (size) {
      case 1:
        imagen.style.width = "5rem";
        imagen.style.height = "auto";
        guardarConfiguracionEnCookies("widhtimg", "5rem", usuario);
        guardarConfiguracionEnCookies("heightimg", "auto", usuario);
        break;
      case 2:
        imagen.style.width = "10rem";
        imagen.style.height = "auto";
        guardarConfiguracionEnCookies("widhtimg", "10rem", usuario);
        guardarConfiguracionEnCookies("heightimg", "auto", usuario);
        break;
      case 3:
        imagen.style.width = "15rem";
        imagen.style.height = "auto";
        guardarConfiguracionEnCookies("widhtimg", "15rem", usuario);
        guardarConfiguracionEnCookies("heightimg", "auto", usuario);
        break;
      default:
        break;
    }
  });
}

function cambiarBody(color) {
  // Cambia el color de fondo del body
  document.body.style.backgroundColor = color; // Puedes cambiar este valor al color que desees
  guardarConfiguracionEnCookies("backcolor", color, usuario);
}

function guardarConfiguracionEnCookies(nombreConfiguracion, valor, usuario) {
    document.cookie = `${nombreConfiguracion}_${usuario}=${valor}; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`;
}

function cargarConfiguracionDesdeCookies(usuario) {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const [nombre, valor] = cookie.trim().split("=");
      const [nombreConfiguracion, nombreUsuario] = nombre.split("_");
  
      if (nombreUsuario === usuario) {
        // Aplica la configuración según el nombre de la cookie y su valor
        aplicarConfiguracion(nombreConfiguracion, valor);
      }
    });
  }

function aplicarsizeImagen(size) {
  var imagenes = document.querySelectorAll("img");

  imagenes.forEach(function (imagen) {
    imagen.style.width = size;
    imagen.style.height = "auto";
  });
}

// Función para aplicar la configuración
function aplicarConfiguracion(nombreConfiguracion, valor) {
  switch (nombreConfiguracion) {
    case "backcolor":
      aplicarColorBody(valor);
      break;
    case "round-link":
      aplicarredondeoLinks(valor);
      break;
    case "backcolor-link":
      aplicarfondoLinks(valor);
      break;
    case "color-link":
      aplicartextoLinks(valor);
      break;
    case "widhtimg":
      aplicarsizeImagen(valor);
      break;
    case "borderimg":
      aplicarbordeImagen(valor);
      break;
    case "bordersizeimg":
      aplicarborderSizeImagen(valor);
      break;
    case "borderroundimg":
      aplicarradiusSizeImagen(valor);
      break;
    case "shadow-enabled":
      aplicarsombraImagen(valor);
      break;
    case "tablebordercolor":
      aplicarcolorBordeTabla(valor);
      break;
    case "tabletitlecolor":
      aplicarcolorTituloTabla(valor);
      break;
    case "textcolor":
      aplicarcolorParrafo(valor);
      break;
    case "textsize":
      aplicarsizeParrafo(valor);
      break;
    case "textbackcolor":
      aplicarfondoParrafo(valor);
      break;
    case "titlecolor":
      aplicarcolorTitulo(valor);
      break;
    case "titlesize":
      aplicarsizeTitulo(valor);
      break;
    case "titlebackcolor":
      aplicarfondoTitulo(valor);
      break;
    case "subtitlecolor":
      aplicarcolorsubTitulo(valor);
      break;
    case "subtitlesize":
      aplicarsizesubTitulo(valor);
      break;
    case "subtitlebackcolor":
      aplicarfondosubTitulo(valor);
      break;

    default:
      break;
  }
}

function aplicarColorBody(color) {
  // Cambia el color de fondo del body
  document.body.style.backgroundColor = color; // Puedes cambiar este valor al color que desees
}
function aplicarredondeoLinks(pixeles) {
  let enlaces = document.querySelectorAll("a");

  enlaces.forEach(function (link) {
    link.style.borderRadius = pixeles;
  });
}

function redondeoLinks(pixel) {
  guardarConfiguracionEnCookies("round-link", pixel, usuario);
}

function aplicarfondoLinks(color) {
  var enlaces = document.querySelectorAll("a");

  enlaces.forEach(function (link) {
    link.style.backgroundColor = color;
  });
}

function fondoLinks(color) {
  var enlaces = document.querySelectorAll("a");

  enlaces.forEach(function (link) {
    link.style.backgroundColor = color;
  });

  guardarConfiguracionEnCookies("backcolor-link", color, usuario);
}

function textoLinks(color) {
  var enlaces = document.querySelectorAll("a");

  enlaces.forEach(function (link) {
    link.style.color = color;
  });
  guardarConfiguracionEnCookies("color-link", color, usuario);
}

function aplicartextoLinks(color) {
  var enlaces = document.querySelectorAll("a");

  enlaces.forEach(function (link) {
    link.style.color = color;
  });
}

function limpiarCookie(nombre) {
  document.cookie =
    nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}



function aplicarbordeImagen(color) {
  var imagenes = document.querySelectorAll("img");
  imagenes.forEach(function (imagen) {
    imagen.style.borderColor = `${color}`;
  });
}
function aplicarborderSizeImagen(size) {
  var imagenes = document.querySelectorAll("img");
  console.log(size);
  imagenes.forEach(function (imagen) {
    imagen.style.borderWidth = size;
    imagen.style.borderStyle = "solid";
  });
}

function aplicarradiusSizeImagen(size) {
  var imagenes = document.querySelectorAll("img");

  imagenes.forEach(function (imagen) {
    imagen.style.borderRadius = size;
  });
}

function aplicarsombraImagen(valor) {
  var imagenes = document.querySelectorAll("img");

  imagenes.forEach(function (imagen) {
    imagen.style.boxShadow = valor; // Activar sombra
  });
}



function aplicarsombraImagen(valor) {
  var imagenes = document.querySelectorAll("img");

  imagenes.forEach(function (imagen) {
    imagen.style.boxShadow = valor; // Activar sombra
  });
}

function aplicarcolorParrafo(color) {
  var parrafos = document.querySelectorAll("p");

  parrafos.forEach(function (parrafo) {
    parrafo.style.color = color;
  });
}

function aplicarsizeParrafo(size) {
  var parrafos = document.querySelectorAll("p");
  parrafos.forEach(function (parrafo) {
    parrafo.style.fontSize = size;
  });
}

function aplicarfondoParrafo(color) {
  var parrafos = document.querySelectorAll("p");

  parrafos.forEach(function (parrafo) {
    parrafo.style.background = color;
  });
}

function aplicarcolorTitulo(color) {
  var parrafos = document.querySelectorAll("h2");

  parrafos.forEach(function (parrafo) {
    parrafo.style.color = color;
  });
}

function aplicarsizeTitulo(size) {
  var parrafos = document.querySelectorAll("h2");

  parrafos.forEach(function (parrafo) {
    parrafo.style.fontSize = size;
  });
}

function aplicarfondoTitulo(color) {
  var parrafos = document.querySelectorAll("h2");

  parrafos.forEach(function (parrafo) {
    parrafo.style.background = color;
  });
}

function aplicarcolorsubTitulo(color) {
  var parrafos = document.querySelectorAll("h3");

  parrafos.forEach(function (parrafo) {
    parrafo.style.color = color;
  });
}

function aplicarsizesubTitulo(size) {
  var parrafos = document.querySelectorAll("h3");
  parrafos.forEach(function (parrafo) {
    parrafo.style.fontSize = size;
  });
}

function aplicarfondosubTitulo(color) {
  var parrafos = document.querySelectorAll("h3");

  parrafos.forEach(function (parrafo) {
    parrafo.style.background = color;
  });
}