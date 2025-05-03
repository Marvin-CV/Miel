import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '9887609',
    database: 'bd_taller',
    port: 3308,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool.promise();