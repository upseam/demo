export interface Money {
  amount: string;
  currencyCode: string;
}

export function toCents(money: Money): number {
  return Math.round(Number(money.amount) * 100);
}

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

export function sumMoney(values: Money[]): Money {
  const currencyCode = values[0]?.currencyCode ?? "USD";
  const cents = values.reduce((total, value) => total + toCents(value), 0);
  return { amount: (cents / 100).toFixed(2), currencyCode };
}
