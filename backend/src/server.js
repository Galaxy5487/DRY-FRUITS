import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { bootstrapData } from "./data/bootstrap.js";
import { app } from "./app.js";

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
