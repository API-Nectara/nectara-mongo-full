import mongoose from "mongoose";
import * as dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
 dotenv.config({ path: envFile });


export async function connectDB() {
  mongoose.set("strictQuery", true);

  const uri = process.env.MONGODB_URI;   // ← tu cadena Atlas SIN /nombreBD
  const dbName = process.env.DB_NAME;    // ← nombre de BD desde .env

  if (!uri)   throw new Error("❌ Falta MONGODB_URI");
  if (!dbName) throw new Error("❌ Falta DB_NAME");

  await mongoose.connect(uri, {
    autoIndex: true,
    dbName, // ← forzamos la BD aquí
  });

  console.log("✅ MongoDB connected to DB:", mongoose.connection.name);
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}
