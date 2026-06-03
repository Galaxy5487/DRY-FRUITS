import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const canSendEmails = Boolean(env.email.host && env.email.user && env.email.pass);

const transporter = canSendEmails
  ? nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      secure: env.email.secure,
      auth: {
        user: env.email.user,
        pass: env.email.pass
      }
    })
  : null;

export const sendOrderConfirmationEmail = async ({ to, order }) => {
  if (!transporter || !to) {
    return;
  }

  await transporter.sendMail({
    from: env.email.from,
    to,
    subject: `Order confirmed - ${order._id}`,
    html: `
      <h2>Thank you for shopping with NR Dry Fruit</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> Rs. ${order.totalAmount}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>
    `
  });
};
