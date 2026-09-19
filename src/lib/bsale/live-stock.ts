/**
 * Live Bsale Stock & Sync Helper
 * Fetches real-time stock directly from Bsale API with caching/timeout safeguards.
 */

const BSALE_BASE_URL = "https://api.bsale.io/v1";

export async function getLiveBsaleStock(sku?: string): Promise<number | null> {
  const token = process.env.BSALE_ACCESS_TOKEN;
  if (!token || !sku || !sku.trim()) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const cleanSku = sku.trim();
    const variantRes = await fetch(
      `${BSALE_BASE_URL}/variants.json?code=${encodeURIComponent(cleanSku)}`,
      {
        headers: { access_token: token },
        signal: controller.signal,
        next: { revalidate: 30 }, // Cache up to 30 seconds for performance
      }
    );
    clearTimeout(timeout);

    if (!variantRes.ok) return null;
    const variantData = await variantRes.json();
    const variant = variantData.items?.[0];
    if (!variant?.id) return null;

    const stockRes = await fetch(
      `${BSALE_BASE_URL}/stocks.json?variantid=${variant.id}`,
      {
        headers: { access_token: token },
        next: { revalidate: 30 },
      }
    );

    if (!stockRes.ok) return null;
    const stockData = await stockRes.json();
    const totalAvailable = (stockData.items || []).reduce(
      (sum: number, item: any) => sum + (Number(item.quantityAvailable) || 0),
      0
    );

    return Math.max(0, Math.floor(totalAvailable));
  } catch (err) {
    // If Bsale is unreachable or times out, return null to fallback gracefully
    return null;
  }
}
