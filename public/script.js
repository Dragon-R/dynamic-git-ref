// Variables para el modal
const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtns = document.querySelectorAll(".close-modal");

// Mostrar la ventana modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Cerrar el modal al hacer clic en "Cancelar"
closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => (modal.style.display = "none"));
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
});

// Variable global para almacenar los comandos cargados
let commandsList = [];

// Funciones para interactuar con la API (suponiendo que se tiene una API configurada)
async function fetchCommands() {
    const res = await fetch("/api/commands");
    const data = await res.json();
    return data.commands;
}

async function addCommand(command) {
    const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
    });
    return await res.json();
}

async function deleteCommand(id) {
    const res = await fetch("/api/commands/" + id, {
        method: "DELETE",
    });
    return await res.json();
}

// Crear el elemento HTML para cada comando
function createBoxElement(boxData) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.dataset.id = boxData.id;

    // Título (interpreta HTML)
    const h2 = document.createElement("h2");
    h2.innerHTML = boxData.title;
    box.appendChild(h2);

    // Contenido (interpreta HTML)
    const p = document.createElement("p");
    p.innerHTML = boxData.content;
    box.appendChild(p);

    // Contenedor de botones
    const btnContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("toggle-btn");
    toggleButton.textContent = "Más información";
    btnContainer.appendChild(toggleButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Eliminar";
    btnContainer.appendChild(deleteButton);

    box.appendChild(btnContainer);

    // Sección de más información (interpreta HTML)
    const moreInfoDiv = document.createElement("div");
    moreInfoDiv.classList.add("more-info");
    moreInfoDiv.innerHTML = `<p>${boxData.moreInfo || ""}</p>`;
    box.appendChild(moreInfoDiv);

    // Eventos para mostrar/ocultar más información
    toggleButton.addEventListener("click", () => {
        moreInfoDiv.style.display =
            moreInfoDiv.style.display === "block" ? "none" : "block";
    });

    // Evento para eliminar el comando
    deleteButton.addEventListener("click", async () => {
        await deleteCommand(boxData.id);
        loadCommands();
    });

    return box;
}

// Función para cargar y renderizar los comandos
async function loadCommands() {
    const container = document.getElementById("boxesContainer");
    container.innerHTML = "";
    commandsList = await fetchCommands();
    commandsList.forEach((command) => {
        const boxElement = createBoxElement(command);
        container.appendChild(boxElement);
    });
}

// Filtro de búsqueda: filtra los comandos según el input de búsqueda
document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const container = document.getElementById("boxesContainer");
    container.innerHTML = "";
    const filtered = commandsList.filter(
        (cmd) =>
            cmd.title.toLowerCase().includes(query) ||
            cmd.content.toLowerCase().includes(query)
    );
    filtered.forEach((command) => {
        const boxElement = createBoxElement(command);
        container.appendChild(boxElement);
    });
});

// Manejador del formulario para agregar un nuevo comando
document
    .getElementById("formAddBox")
    .addEventListener("submit", async function (e) {
        e.preventDefault();
        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();
        const moreInfo = document.getElementById("moreInfo").value.trim();

        if (!title || !content) return;

        await addCommand({ title, content, moreInfo });

        // Actualizar la lista de comandos, cerrar el modal y reiniciar el formulario
        await loadCommands();
        modal.style.display = "none";
        this.reset();
    });

// Cargar los comandos al iniciar la página
document.addEventListener("DOMContentLoaded", loadCommands);
