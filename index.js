import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

// middlewares
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ==========================
// DATABASE CONNECTION
// ==========================
let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log("✅ MySQL pool created");
} catch (err) {
  console.error("❌ DB pool creation failed:", err.message);
}

// ==========================
// ROUTES
// ==========================

// health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// database test route (SAFE)
app.get("/api/test-db", async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({
        success: false,
        message: "Database pool not initialized"
      });
    }

    const [rows] = await pool.query("SELECT 1 AS result");
    res.json({
      success: true,
      db: "connected",
      result: rows
    });
  } catch (error) {
    console.error("❌ DB error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
