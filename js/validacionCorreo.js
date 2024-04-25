import { subirInformacion } from "../admin/js/prueba.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener los datos del localStorage
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get("id"));
});
