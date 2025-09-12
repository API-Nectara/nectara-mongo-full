import { connectDB, disconnectDB } from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";

beforeAll(async () => {
  await connectDB();
  // Limpia la colección antes de empezar los tests
  await ButterflyModel.deleteMany({});
});

// Limpia la colección después de cada test
afterEach(async () => {
  await ButterflyModel.deleteMany({});
});

afterAll(async () => {
  // Limpia la colección al final
  await ButterflyModel.deleteMany({});
  await disconnectDB();
});