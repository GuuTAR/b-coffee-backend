const mysql = require("mysql");

const pool = mysql.createPool({
  port: "3306",
  user: process.env.DB_USER || "GuuTAR",
  database: process.env.DB_NAME || "bcoffee",
  password: process.env.DB_PASS || "123456",
  socketPath: "/cloudsql/festive-canto-301608:asia-southeast1:b-coffee",
  multipleStatements: true,
});

module.exports = pool;
