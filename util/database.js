const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  username: 'root',
  database: 'node-complete',
  password: 'root1234',
});

module.exports = pool.promise();
