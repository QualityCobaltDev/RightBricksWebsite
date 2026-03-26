export function formatCurrency(value: string | number | bigint) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value));
}

export function startCase(input: string) {
  return input.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
