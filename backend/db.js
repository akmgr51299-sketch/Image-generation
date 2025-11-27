import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234', // ⚠️ CHANGE THIS to your MySQL password if you have one
  database: 'ai_image_generator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('💡 Make sure:');
    console.error('   1. MySQL is running');
    console.error('   2. Database "ai_image_generator" exists');
    console.error('   3. Username and password are correct');
  });

export default pool;