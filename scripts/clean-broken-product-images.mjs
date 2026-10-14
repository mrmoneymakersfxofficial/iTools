
const PROJECT_ID = "3qqlwuul";
const DATASET = "production";
const TOKEN = "skX1ZDwS1UMzBOyAywCDlQoATjvZgmRj01eKR2uzyTvsZ4SiGFrLC8HQXXg6TCOSgdJIAggwi9pTYiicfumLawUUW6LRlABti7dHXuGdczZMirYrucFNvfrd4iycF8ynRsQdYwyXVDvRvsuTuLXYQUsKqraRtA6pxmZdaFfgGNylzB3dSsH5";

async function query(groq) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2023-08-01/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

async function mutate(mutations) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2023-08-01/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations }),
  });
  return res.json();
}

async function main() {
  console.log("Finding products with broken kytfgk41 asset references...");
  const docs = await query(`*[_type == "product" && (image.asset->path match "kytfgk41*" || count(images[asset->path match "kytfgk41*"]) > 0)]{
    _id,
    name,
    "hasBrokenImage": image.asset->path match "kytfgk41*",
    "hasBrokenImages": count(images[asset->path match "kytfgk41*"]) > 0
  }`);

  console.log(`Found ${docs.length} products to clean.`);

  const mutations = [];
  for (const doc of docs) {
    const unsets = [];
    if (doc.hasBrokenImage) unsets.push("image");
    if (doc.hasBrokenImages) unsets.push("images");

    if (unsets.length > 0) {
      mutations.push({
        patch: {
          id: doc._id,
          unset: unsets,
        },
      });
    }
  }

  // Send in chunks of 50
  for (let i = 0; i < mutations.length; i += 50) {
    const batch = mutations.slice(i, i + 50);
    console.log(`Sending batch ${i / 50 + 1} (${batch.length} mutations)...`);
    const res = await mutate(batch);
    if (res.error) {
      console.error("Batch error:", res.error);
    } else {
      console.log("Batch successful.");
    }
  }

  console.log("Cleanup complete!");
}

main().catch(console.error);
