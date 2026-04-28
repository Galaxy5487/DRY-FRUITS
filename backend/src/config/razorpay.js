import Razorpay from "razorpay";
import { env } from "./env.js";

export const razorpayClient = env.razorpayKeyId && env.razorpayKeySecret
  ? new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret
    })
  : null;
