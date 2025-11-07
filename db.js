// db.js
require('dotenv').config();
const mysql = require('mysql2');

// Crear pool de conexiones (mejor que connection simple)
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Verificar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a Railway MySQL');
  connection.release();
});

// Exportar el pool con promesas
module.exports = pool.promise();