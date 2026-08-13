/**
 * Format a price number to a currency string.
 * Defaults to Peruvian Sol (S/) with 2 decimal places.
 */
export function formatPrice(price: number, locale = "es-PE", currency = "PEN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
