import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { bootstrapData } from "./data/bootstrap.js";
import { app } from "./app.js";
import { onRequest } from "firebase-functions/v2/https";

// Establish DB connection on function execution
let isDbConnected = false;
const ensureDb = async () => {
  if (!isDbConnected) {
    await connectDb();
    await bootstrapData();
    isDbConnected = true;
  }
};

// Handle regular server startup if not in Firebase Functions
if (!process.env.FUNCTION_NAME && !process.env.FUNCTIONS_EMULATOR && !process.env.FUNCTION_TARGET) {
  const startServer = async () => {
    try {
      await connectDb();
      await bootstrapData();
      app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
      });
    } catch (error) {
      console.error("Failed to start server", error);
      process.exit(1);
    }
  };
  startServer();
}

// Export the Firebase function
export const api = onRequest({ cors: true, maxInstances: 10 }, async (req, res) => {
  await ensureDb();
  return app(req, res);
});

