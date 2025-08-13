// utils/db.js
const mysql = require('mysql2/promise');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // change to your MySQL user
    password: 'root',      // change to your MySQL password
    database: 'wtest',  // change to your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
