require('dotenv').config(); // ⚠️ IMPORTANTE: Esta línea al inicio
const mysql = require('mysql2/promise');

async function setup() {
  try {
    console.log('🔄 Conectando a Railway MySQL...');
    console.log('URL:', process.env.MYSQL_URL ? '✓ Configurada' : '✗ No encontrada');
    
    const conn = await mysql.createConnection(process.env.MYSQL_URL);
    console.log('✅ Conectado exitosamente\n');
    
    // Crea tabla
    await conn.query(`
      CREATE TABLE IF NOT EXISTS participantes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        apellidos VARCHAR(100),
        email VARCHAR(150),
        twitter VARCHAR(100),
        enlace VARCHAR(255),
        ocupacion VARCHAR(100),
        avatar INT
      )
    `);
    console.log('✅ Tabla "participantes" creada\n');
    
    // Inserta datos
    await conn.query(`
      INSERT INTO participantes (nombre, apellidos, email, twitter, enlace, ocupacion, avatar)
      VALUES 
        ('otro00', 'Gómez Díaz', 'carlos@example.com', '@carlos_dev', 'https://carlos.dev', 'Desarrollador Full Stack', 2)
    `);
    console.log('✅ Datos insertados\n');
    
    // Verifica
    const [rows] = await conn.query('SELECT * FROM participantes');
    console.log('📋 Participantes:');
    console.table(rows);
    
    await conn.end();
    console.log('\n🎉 ¡Listo!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

setup();