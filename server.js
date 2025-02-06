// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos (nuestro index.html y assets)
app.use(express.static(path.join(__dirname, "public")));

// Crear o abrir la base de datos SQLite
const db = new sqlite3.Database("./commands.db", (err) => {
    if (err) {
        console.error("Error abriendo la base de datos:", err.message);
    } else {
        db.run(
            `CREATE TABLE IF NOT EXISTS commands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            moreInfo TEXT
            )`,
            (err) => {
                if (err) {
                    console.error("Error creando la tabla:", err.message);
                }
            }
        );
    }
});

// Endpoint para obtener todos los comandos
app.get("/api/commands", (req, res) => {
    db.all("SELECT * FROM commands", [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ commands: rows });
    });
});

// Endpoint para agregar un nuevo comando
app.post("/api/commands", (req, res) => {
    const { title, content, moreInfo } = req.body;
    if (!title || !content) {
        res.status(400).json({ error: "Se requieren 'title' y 'content'" });
        return;
    }
    const sql = "INSERT INTO commands (title, content, moreInfo) VALUES (?,?,?)";
    const params = [title, content, moreInfo];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Endpoint para eliminar un comando por ID
app.delete("/api/commands/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM commands WHERE id = ?", id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
