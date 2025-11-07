// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const participantesRoutes = require('./participantes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Rutas
app.use('/api/participantes', participantesRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🎓 API Backend Congreso',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      'GET /api/participantes': 'Obtener todos los participantes',
      'GET /api/participantes/:id': 'Obtener un participante',
      'POST /api/participantes': 'Crear participante',
      'PUT /api/participantes/:id': 'Actualizar participante',
      'DELETE /api/participantes/:id': 'Eliminar participante'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Puerto dinámico para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});