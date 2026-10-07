import { formatAmount } from "./util/money.ts";

export interface RenewalNoticeInput {
  customerName: string;
  planName: string;
  amount: number;
  currency: string;
  daysLeft: number;
}

export function renderRenewalNotice(input: RenewalNoticeInput): string {
  const when = input.daysLeft <= 1 ? "tomorrow" : `in ${input.daysLeft} days`;
  return [
    `Hi ${input.customerName},`,
    `Your ${input.planName} plan renews ${when} for ${formatAmount(input.amount, input.currency)}.`,
    "You can change or cancel it from your billing page.",
  ].join("\n");
}

export function shouldNotify(daysLeft: number, noticeDays: number): boolean {
  return daysLeft > 0 && daysLeft <= noticeDays;
}
