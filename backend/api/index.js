import { app } from "../src/app.js";
import { connectDb } from "../src/config/db.js";
import { bootstrapData } from "../src/data/bootstrap.js";

let readyPromise;

const ensureReady = () => {
  if (!readyPromise) {
    readyPromise = connectDb().then(() => bootstrapData());
  }

  return readyPromise;
};

export default async function handler(req, res) {
  await ensureReady();
  return app(req, res);
}
