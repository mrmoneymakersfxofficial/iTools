/**
 * Format a price number to a currency string.
 * Defaults to Peruvian Sol (S/) with 2 decimal places.
 * Uses standard ASCII space to avoid font ligature issues (e.g. 'fl' glyphs).
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === undefined || price === null || price === "" || isNaN(Number(price))) {
    return "S/ 0.00";
  }
  const num = Number(price);
  return `S/ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

