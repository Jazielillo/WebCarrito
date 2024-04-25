function comprobarAdmin() {
    let sesionIniciada = localStorage.getItem("usuarioActual");
    let tipoUsuario = localStorage.getItem("tipoUsuario");
  
    if (!sesionIniciada || tipoUsuario === "admin") {
      // Si la sesión no está iniciada o no hay un usuario actual en el localStorage, redirige al login
      window.location.href = "../../html/login.html";
      return; // Termina la función para evitar ejecutar el resto del código
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    comprobarAdmin();
  });