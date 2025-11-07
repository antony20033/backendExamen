// participantes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// 1️⃣ Listado completo con búsqueda opcional
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;

    if (query) {
      // Búsqueda con filtro
      const [results] = await db.query(
        `SELECT * FROM participantes 
         WHERE nombre LIKE ? OR apellidos LIKE ? OR email LIKE ? OR ocupacion LIKE ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
      );
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } else {
      // Listado completo
      const [results] = await db.query('SELECT * FROM participantes ORDER BY id DESC');
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 2️⃣ Obtener participante por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [results] = await db.query('SELECT * FROM participantes WHERE id = ?', [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Participante no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: results[0]
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 3️⃣ Registrar nuevo participante
router.post('/', async (req, res) => {
  try {
    const { nombre, apellidos, email, twitter, enlace, ocupacion, avatar } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !apellidos || !email) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'Faltan campos obligatorios: nombre, apellidos y email son requeridos' 
      });
    }

    const [result] = await db.query(
      'INSERT INTO participantes (nombre, apellidos, email, twitter, enlace, ocupacion, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, email, twitter || null, enlace || null, ocupacion || null, avatar || null]
    );

    res.status(201).json({ 
      success: true,
      mensaje: 'Participante registrado correctamente', 
      id: result.insertId 
    });
  } catch (error) {
    // Manejo de errores específicos
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false,
        mensaje: 'El email ya está registrado' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 4️⃣ EXTRA: Actualizar participante
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, email, twitter, enlace, ocupacion, avatar } = req.body;

    const [result] = await db.query(
      'UPDATE participantes SET nombre=?, apellidos=?, email=?, twitter=?, enlace=?, ocupacion=?, avatar=? WHERE id=?',
      [nombre, apellidos, email, twitter, enlace, ocupacion, avatar, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Participante no encontrado' 
      });
    }

    res.json({
      success: true,
      mensaje: 'Participante actualizado correctamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 5️⃣ EXTRA: Eliminar participante
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM participantes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Participante no encontrado' 
      });
    }

    res.json({
      success: true,
      mensaje: 'Participante eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;