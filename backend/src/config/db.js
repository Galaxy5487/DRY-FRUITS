import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

let memoryServer;

export const connectDb = async () => {
  mongoose.set("strictQuery", true);
  if (env.mongoUri) {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
    return;
  }

  if (!env.useInMemoryDb) {
    throw new Error("MONGODB_URI is not set and USE_IN_MEMORY_DB is disabled");
  }

  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: "nr-dry-fruit"
    }
  });
  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
  console.log("MongoDB connected (in-memory)");
};

export const disconnectDb = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
