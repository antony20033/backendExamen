require('dotenv').config();
const mysql = require('mysql2');

let config;

if (process.env.DATABASE_URL) {
  // Si tenemos DATABASE_URL, usamos esa
  config = process.env.DATABASE_URL;
} else {
  // Si no, usamos las variables individuales
  config = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'trolley.proxy.rlwy.net',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 33972,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(config);

// Verificar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
    return;
  }
  console.log("✅ Conectado correctamente a MySQL Railway");
  connection.release();
});

module.exports = pool.promise();
