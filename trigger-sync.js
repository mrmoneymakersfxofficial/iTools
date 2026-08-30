const https = require("https");

const BSALE_TOKEN = "d8da7565d32dd2cbe70f6b53ff0fbd52a53b3d36";
const VERCEL_API = "https://itools.pe/api/bsale/sync";
const VERCEL_SECRET = "itools2024";

// Bypass SSL for local outbound requests (Vercel has valid SSL, but Bsale might or local might have issues)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function fetchAllBsaleProductIds() {
  let offset = 0;
  const limit = 50;
  const productIds = [];
  let hasMore = true;

  console.log("Fetching product list from Bsale...");
  while (hasMore) {
    const res = await fetch(`https://api.bsale.io/v1/products.json?limit=${limit}&offset=${offset}&state=0`, {
      headers: { "access_token": BSALE_TOKEN }
    });
    if (!res.ok) throw new Error("Failed to fetch from Bsale: " + res.status);
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) break;
    
    for (const item of data.items) {
      productIds.push(item.id);
    }
    
    console.log(`Fetched ${productIds.length} product IDs...`);
    hasMore = data.items.length === limit;
    offset += limit;
  }
  
  return productIds;
}

async function triggerVercelSync(ids) {
  const res = await fetch(VERCEL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${VERCEL_SECRET}`
    },
    body: JSON.stringify({ productIds: ids })
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vercel API Error ${res.status}: ${text}`);
  }
  
  return await res.json();
}

async function main() {
  try {
    const allIds = await fetchAllBsaleProductIds();
    console.log(`\nFound ${allIds.length} active products in Bsale.`);
    console.log("Starting batch sync to Vercel...");
    
    // Batch size of 10 to ensure it finishes within Vercel's timeout
    const BATCH_SIZE = 10;
    
    for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
      const batch = allIds.slice(i, i + BATCH_SIZE);
      console.log(`\nSyncing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(allIds.length / BATCH_SIZE)} (${batch.length} products)...`);
      
      try {
        const result = await triggerVercelSync(batch);
        console.log(`? Success: ${result.productsSynced} products synced (variants: ${result.variantsSynced})`);
        if (result.errors && result.errors.length > 0) {
          console.log(`?? Errors in batch:`, result.errors);
        }
      } catch (e) {
        console.error(`? Failed to sync batch:`, e.message);
      }
      
      // Wait 1 second between batches so we don't hammer the API limits
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log("\n?? Massive Sync Completed!");
  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

main();
