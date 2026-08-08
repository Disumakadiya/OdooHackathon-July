import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import { syncDatabase } from "./database/sync.js";
import authRoutes from "./routes/authRoutes.js";
import assetCategoryRoutes from "./routes/assetCategory.routes.js";
import assetsRoutes from "./routes/assets.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/asset-categories", assetCategoryRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/maintenances", maintenanceRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("AssetFlow API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "assetflow-backend", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database Connected Successfully");
    await syncDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
