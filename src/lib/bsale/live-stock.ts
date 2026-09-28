/**
 * Live Bsale Stock & Sync Helper
 * Fetches real-time stock directly from Bsale API with caching/timeout safeguards.
 */

const BSALE_BASE_URL = "https://api.bsale.io/v1";

export interface LiveBsaleData {
  stock: number;
  price: number | null;
  salePrice: number | null;
  discountPercentage?: number;
  variantId?: number;
}

export async function getLiveBsaleData(sku?: string): Promise<LiveBsaleData | null> {
  const token = process.env.BSALE_ACCESS_TOKEN;
  if (!token || !sku || !sku.trim()) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const cleanSku = sku.trim();
    const variantRes = await fetch(
      `${BSALE_BASE_URL}/variants.json?code=${encodeURIComponent(cleanSku)}`,
      {
        headers: { access_token: token },
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timeout);

    if (!variantRes.ok) return null;
    const variantData = await variantRes.json();
    const variant = variantData.items?.[0];
    if (!variant?.id) return null;

    // Safeguard: Price List 1 does not exist in Bsale; active base list is 3 ("Lista de Precios Base")
    const envListId = process.env.BSALE_PRICE_LIST_ID;
    const priceListId = (!envListId || envListId === "1") ? "3" : envListId;

    // Fetch stock, base price, and active Bsale discounts in parallel
    const [stockRes, priceRes, discRes] = await Promise.all([
      fetch(`${BSALE_BASE_URL}/stocks.json?variantid=${variant.id}`, {
        headers: { access_token: token },
        cache: "no-store",
      }).catch(() => null),
      fetch(`${BSALE_BASE_URL}/price_lists/${priceListId}/details.json?variantid=${variant.id}`, {
        headers: { access_token: token },
        cache: "no-store",
      }).catch(() => null),
      fetch(`${BSALE_BASE_URL}/variant/${variant.id}/price_list/${priceListId}/discounts.json`, {
        headers: { access_token: token },
        cache: "no-store",
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
        // variantValueWithTaxes is the retail base price in Soles (including 18% IGV)
        const val = Number(detail.variantValueWithTaxes ?? detail.variantValue);
        if (!isNaN(val) && val > 0) {
          price = Math.round(val * 100) / 100;
        }
      }
    }

    let salePrice: number | null = null;
    let discountPercentage = 0;
    if (discRes && discRes.ok && price && price > 0) {
      const discData = await discRes.json();
      const activeDiscounts = (discData.data || []).filter(
        (d: any) => d.discountState === 0 && Number(d.discountPercentage) > 0
      );
      if (activeDiscounts.length > 0) {
        discountPercentage = Number(activeDiscounts[0].discountPercentage);
        const discounted = Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
        if (discounted > 0 && discounted < price) {
          salePrice = discounted;
        }
      }
    }

    return {
      stock: Math.max(0, Math.floor(totalAvailable)),
      price,
      salePrice,
      discountPercentage,
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
