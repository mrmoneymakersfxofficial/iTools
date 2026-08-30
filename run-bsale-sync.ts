import { syncAllProducts } from "./src/lib/bsale/sync";
import dotenv from "dotenv";

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass local SSL issues

async function main() {
  console.log("Starting massive Bsale -> Sanity/Postgres sync...");
  const officeId = Number(process.env.BSALE_OFFICE_ID) || 1;
  const priceListId = Number(process.env.BSALE_PRICE_LIST_ID) || 1;
  
  await syncAllProducts(officeId, priceListId, (msg) => {
    console.log(`[Progress] ${msg}`);
  });
  console.log("Massive sync finished!");
}

main().catch(console.error);
