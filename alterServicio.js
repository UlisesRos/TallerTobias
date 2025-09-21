import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "junction.proxy.rlwy.net",
  user: "root",
  password: "chaGGwtoyqKJEqTofBQzAepIgKPnAIQQ",
  database: "railway",
});

await connection.query(`
  ALTER TABLE Servicios ADD COLUMN kmProximoServicio INT DEFAULT 0
`);

console.log("Columna agregada con valor 0 por defecto ✅");

await connection.end();
