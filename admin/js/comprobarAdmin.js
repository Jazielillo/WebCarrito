function comprobarAdmin() {
  let tipoUsuario = localStorage.getItem("tipoUsuario");

  if (tipoUsuario!="admin" || !tipoUsuario) {
    // Si la sesión no está iniciada o no hay un usuario actual en el localStorage, redirige al login
    window.location.href = "../../html/login.html";
    return; // Termina la función para evitar ejecutar el resto del código
  }
  // Si todo está en orden, puedes continuar con el resto de la lógica aquí
  console.log("Usuario autenticado como administrador.");
}

document.addEventListener("DOMContentLoaded", () => {
  comprobarAdmin();
});
