import { app } from "../src/app.js";
import { connectDb } from "../src/config/db.js";
import { bootstrapData } from "../src/data/bootstrap.js";
import { demoApp } from "../src/demoApp.js";

let readyPromise;

const ensureReady = () => {
  if (!readyPromise) {
    readyPromise = connectDb().then(() => bootstrapData());
  }

  return readyPromise;
};

export default async function handler(req, res) {
  if (!process.env.MONGODB_URI) {
    return demoApp(req, res);
  }

  await ensureReady();
  return app(req, res);
}
