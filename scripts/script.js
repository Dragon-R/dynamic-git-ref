// Obtener el botón y el body
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

// Verificar preferencia previa del usuario
if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
}

// Función para alternar el modo oscuro
darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

  // Guardar preferencia del usuario
    if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
    } else {
    localStorage.removeItem("dark-mode");
    }
});
