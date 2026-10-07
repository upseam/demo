import Stripe from "stripe";
import { loadConfig } from "./config.ts";

export const stripe = new Stripe(loadConfig().secretKey, {
  apiVersion: "2024-06-20",
});
