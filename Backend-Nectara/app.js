import mongoose from "mongoose";
import express from "express";
import butterflyRouter from "./routes/butterflyRoutes.js";
import cors from "cors";
import { connectDB, disconnectDB } from "./database/db_connection.js";


export const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Rutas
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("Hola API"));
app.use("/butterflies", butterflyRouter);
app.get("/health/db", (_req, res) => {
  const state = ["disconnected","connected","connecting","disconnecting","uninitialized"][mongoose.connection.readyState] || "unknown";
  res.json({ dbState: state });
});

// En tests NO levantamos servidor
let server = null;

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await connectDB();                 //  Mongo
      console.log("🍃 Mongo conectado");
    } catch (error) {
      console.error("DB error:", error);
    }

    const PORT = process.env.PORT || 8080;
    server = app.listen(PORT, () => {
      console.log(`🚀 Server up at http://localhost:${PORT}/`);
    });

    process.on("SIGINT", async () => {
      await disconnectDB();
      process.exit(0);
    });
  })();
}

export { server };
