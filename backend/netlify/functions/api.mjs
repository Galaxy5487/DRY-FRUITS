import serverless from 'serverless-http';
import { app } from '../../src/app.js';
import { demoApp } from '../../src/demoApp.js';
import { connectDb } from '../../src/config/db.js';
import { bootstrapData } from '../../src/data/bootstrap.js';

let wrappedHandler;
let readyPromise;

const ensureReady = () => {
  if (!readyPromise) {
    readyPromise = connectDb().then(() => bootstrapData());
  }
  return readyPromise;
};

export const handler = async (event, context) => {
  if (!process.env.MONGODB_URI) {
    if (!wrappedHandler) {
      wrappedHandler = serverless(demoApp);
    }
    return wrappedHandler(event, context);
  }

  await ensureReady();
  if (!wrappedHandler) {
    wrappedHandler = serverless(app);
  }
  return wrappedHandler(event, context);
};
