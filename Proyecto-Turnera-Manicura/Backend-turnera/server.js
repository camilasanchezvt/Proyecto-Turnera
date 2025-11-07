const express = require('express');
const path = require('path');
const fs = require('fs');
// 1. 🟢 Importar CORS para permitir comunicación con Angular
/// 1. 🟢 Importar CORS para permitir comunicación con Angular
const cors = require('cors'); 
const app = express();

// Obtener la URL permitida desde las Variables de Entorno de Render
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200'; // Fallback para desarrollo

const corsOptions = {
    origin: allowedOrigin,
    optionsSuccessStatus: 200 // Para navegadores antiguos
};

// 2. 🟢 MIDDLEWARES
app.use(cors(corsOptions)); // <-- Usa la configuración restringida
app.use(express.json());
// Nombre del archivo de "base de datos"
const DB_FILE = 'turnos.json';

// --- Funciones de Utilidad para Manejo de Archivos ---

// Función para leer el archivo de forma segura
const leerTurnos = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            // Si el archivo no existe, crea uno vacío
            fs.writeFileSync(DB_FILE, '[]', 'utf-8'); 
            return [];
        }
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de turnos:', error);
        return [];
    }
};

// Función para escribir el archivo
const escribirTurnos = (turnos) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(turnos, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error al escribir el archivo de turnos:', error);
    }
};

// -------------------- 📦 RUTAS API (CRUD COMPLETO) --------------------

// 📘 GET: Obtener todos los turnos
app.get('/api/turnos', (req, res) => {
    res.json(leerTurnos());
});

// ➕ POST: Agregar un turno
app.post('/api/turnos', (req, res) => {
    const turnos = leerTurnos();
    const nuevoTurno = req.body;
    
    // Asignar un ID simple
    const ultimoId = turnos.length > 0 ? turnos[turnos.length - 1].id : 0;
    nuevoTurno.id = ultimoId + 1;

    turnos.push(nuevoTurno);
    escribirTurnos(turnos);

    // 🟢 Importante: Devolver el objeto creado con su ID
    res.status(201).json(nuevoTurno); 
});

// ✏️ PUT: Modificar un turno
app.put('/api/turnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const turnos = leerTurnos();
    const index = turnos.findIndex(t => t.id === id);

    if (index !== -1) {
        const turnoActualizado = req.body;
        turnoActualizado.id = id;
        turnos[index] = turnoActualizado;
        escribirTurnos(turnos);
        res.json({ mensaje: `Turno ID ${id} actualizado.`, turno: turnoActualizado });
    } else {
        res.status(404).json({ mensaje: `Turno ID ${id} no encontrado.` });
    }
});

// ❌ DELETE: Eliminar un turno
app.delete('/api/turnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let turnos = leerTurnos();
    const longitudInicial = turnos.length;
    
    // Filtra el array, dejando solo los turnos cuyo ID no coincida
    turnos = turnos.filter(t => t.id !== id);

    if (turnos.length < longitudInicial) {
        escribirTurnos(turnos);
        res.json({ mensaje: `Turno ID ${id} eliminado correctamente.` });
    } else {
        res.status(404).json({ mensaje: `Turno ID ${id} no encontrado.` });
    }
});

// -------------------- 🌐 SERVIR FRONTEND --------------------
// Nota: Ajusté la ruta de Angular. Verifica que la ruta 'turnera-manicura/dist/turnera-manicura' sea correcta.

const DIST_PATH = path.join(__dirname, 'turnera-manicura/dist/turnera-manicura');

if (fs.existsSync(DIST_PATH)) {
    app.use(express.static(DIST_PATH));

    app.get('*', (req, res) => {
        // Asegura que la petición no sea para una ruta de la API
        if (!req.url.startsWith('/api')) { 
             res.sendFile(path.join(DIST_PATH, 'index.html'));
        }
    });
} else {
    app.get('/', (req, res) => {
        res.send('Backend API funcionando. Faltan archivos estáticos del frontend.');
    });
}


// -------------------- 🚀 INICIAR SERVIDOR --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));