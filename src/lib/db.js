import mysql from "mysql2/promise";

let connection;

export async function getDbConnection() {
  if (connection && connection.connection && connection.connection.state !== "disconnected") {
    return connection;
  }
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "expenseTracker2",
    // add port if needed
  });
  return connection;
}
