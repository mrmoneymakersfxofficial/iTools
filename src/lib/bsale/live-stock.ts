/**
 * Live Bsale Stock & Sync Helper
 * Fetches real-time stock directly from Bsale API with caching/timeout safeguards.
 */

const BSALE_BASE_URL = "https://api.bsale.io/v1";

export interface LiveBsaleData {
  stock: number;
  price: number | null;
  salePrice?: number | null;
  variantId?: number;
}

export async function getLiveBsaleData(sku?: string): Promise<LiveBsaleData | null> {
  const token = process.env.BSALE_ACCESS_TOKEN;
  if (!token || !sku || !sku.trim()) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const cleanSku = sku.trim();
    const variantRes = await fetch(
      `${BSALE_BASE_URL}/variants.json?code=${encodeURIComponent(cleanSku)}`,
      {
        headers: { access_token: token },
        signal: controller.signal,
        next: { revalidate: 15 }, // Cache 15s for high responsiveness and fast TTFB
      }
    );
    clearTimeout(timeout);

    if (!variantRes.ok) return null;
    const variantData = await variantRes.json();
    const variant = variantData.items?.[0];
    if (!variant?.id) return null;

    const priceListId = process.env.BSALE_PRICE_LIST_ID || "3";

    // Fetch stock and price in parallel
    const [stockRes, priceRes] = await Promise.all([
      fetch(`${BSALE_BASE_URL}/stocks.json?variantid=${variant.id}`, {
        headers: { access_token: token },
        next: { revalidate: 15 },
      }).catch(() => null),
      fetch(`${BSALE_BASE_URL}/price_lists/${priceListId}/details.json?variantid=${variant.id}`, {
        headers: { access_token: token },
        next: { revalidate: 15 },
      }).catch(() => null),
    ]);

    let totalAvailable = 0;
    if (stockRes && stockRes.ok) {
      const stockData = await stockRes.json();
      totalAvailable = (stockData.items || []).reduce(
        (sum: number, item: any) => sum + (Number(item.quantityAvailable) || 0),
        0
      );
    }

    let price: number | null = null;
    if (priceRes && priceRes.ok) {
      const priceData = await priceRes.json();
      const detail = priceData.items?.[0];
      if (detail) {
        // variantValueWithTaxes is the retail price in Soles (including 18% IGV)
        const val = Number(detail.variantValueWithTaxes ?? detail.variantValue);
        if (!isNaN(val) && val > 0) {
          price = Math.round(val * 100) / 100;
        }
      }
    }

    return {
      stock: Math.max(0, Math.floor(totalAvailable)),
      price,
      salePrice: null,
      variantId: variant.id,
    };
  } catch {
    return null;
  }
}

export async function getLiveBsaleStock(sku?: string): Promise<number | null> {
  const data = await getLiveBsaleData(sku);
  return data ? data.stock : null;
}
