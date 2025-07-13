import dotenv from "dotenv";
if (process.env.KUBERNETES_SERVICE_HOST === undefined) {
  dotenv.config({ path: ".env" });
}

import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
