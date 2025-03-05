import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "super_secreto";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

// ✅ Configuración del pool de conexiones a MySQL en Google Cloud SQL
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Dirección del servidor de MySQL en Google Cloud
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 1433,
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones activas
  queueLimit: 0,
});

// ✅ Función para obtener una conexión del pool
async function getDBConnection() {
  try {
    return await pool.getConnection();
  } catch (err) {
    console.error("❌ Error al obtener conexión a la BD:", err);
    throw err;
  }
}

// ✅ Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// ✅ Ruta de login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username y password son obligatorios" });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login exitoso", token });
  } else {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
});

// ✅ Ruta de prueba para verificar conexión a MySQL
app.get("/api/test-db", async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();
    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows[0].result });
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  } finally {
    if (connection) connection.release(); // ✅ Liberar conexión
  }
});

// ✅ Ruta para obtener las mesas
app.get("/api/tables", verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();
    const [tables] = await connection.query("SELECT * FROM tables");
    res.status(200).json(tables);
  } catch (error) {
    console.error("❌ Error al obtener mesas:", error);
    res.status(500).json({ error: "No se pudieron obtener las mesas" });
  } finally {
    if (connection) connection.release(); // ✅ Liberar conexión
  }
});

// ✅ Ruta para crear una nueva reserva
app.post("/api/reservations", verifyToken, async (req, res) => {
  const { tableId, turno, date } = req.body;

  if (!tableId || !turno || !date) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  let connection;
  try {
    connection = await getDBConnection();

    // Verificar si la mesa ya está reservada
    const [existing] = await connection.query(
      "SELECT * FROM reservations WHERE table_id = ? AND turno = ? AND date = ?",
      [tableId, turno, date]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Mesa ya reservada en ese turno" });
    }

    // Insertar la reserva
    const [result] = await connection.query(
      "INSERT INTO reservations (table_id, turno, date, username) VALUES (?, ?, ?, ?)",
      [tableId, turno, date, req.user.username]
    );

    res.status(201).json({ id: result.insertId, tableId, turno, date, username: req.user.username });
  } catch (error) {
    console.error("❌ Error al realizar reserva:", error);
    res.status(500).json({ error: "No se pudo realizar la reserva" });
  } finally {
    if (connection) connection.release(); // ✅ Liberar conexión
  }
});

// ✅ Iniciar el servidor
app.listen(3001, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3001");
});
