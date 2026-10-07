import { customerByEmail } from "../billing/customers.ts";
import { refundLastInvoice } from "../billing/invoices.ts";
import { planSummary, renewalDate } from "../billing/subscriptions.ts";
import { sendJson } from "../lib/http.ts";
import type { Router } from "../lib/router.ts";

export function registerBilling(router: Router) {
  router.add("GET", "/billing/renewal", async ({ res, url }) => {
    const date = await renewalDate(url.searchParams.get("subscription") ?? "");
    sendJson(res, 200, { renews: date.toISOString() });
  });

  router.add("GET", "/billing/plans", async ({ res, url }) => {
    const customer = await customerByEmail(url.searchParams.get("email") ?? "");
    sendJson(res, 200, await planSummary(customer.id));
  });

  router.add("POST", "/billing/invoices/:id/refund", async ({ res, params }) => {
    sendJson(res, 200, { refund: await refundLastInvoice(params.id ?? "") });
  });
}
