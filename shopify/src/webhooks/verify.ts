import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyWebhook(rawBody: string, hmacHeader: string | undefined, secret: string): boolean {
  if (!hmacHeader || !secret) {
    return false;
  }
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  const received = Buffer.from(hmacHeader, "base64");
  return received.length === expected.length && timingSafeEqual(received, expected);
}
