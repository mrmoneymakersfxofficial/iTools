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
  console.log("Searching for all documents with broken kytfgk41 image/logo references...");
  const docs = await query(`*[
    image.asset->path match "kytfgk41*" ||
    logo.asset->path match "kytfgk41*" ||
    bannerImage.asset->path match "kytfgk41*" ||
    backgroundImage.asset->path match "kytfgk41*" ||
    count(images[asset->path match "kytfgk41*"]) > 0
  ]{
    _id,
    _type,
    "hasDeadImage": image.asset->path match "kytfgk41*",
    "hasDeadLogo": logo.asset->path match "kytfgk41*",
    "hasDeadBanner": bannerImage.asset->path match "kytfgk41*",
    "hasDeadBg": backgroundImage.asset->path match "kytfgk41*",
    "hasDeadImages": count(images[asset->path match "kytfgk41*"]) > 0
  }`);

  console.log(`Found ${docs.length} documents.`);

  const mutations = [];
  for (const doc of docs) {
    const unsets = [];
    if (doc.hasDeadImage) unsets.push("image");
    if (doc.hasDeadLogo) unsets.push("logo");
    if (doc.hasDeadBanner) unsets.push("bannerImage");
    if (doc.hasDeadBg) unsets.push("backgroundImage");
    if (doc.hasDeadImages) unsets.push("images");

    if (unsets.length > 0) {
      mutations.push({
        patch: {
          id: doc._id,
          unset: unsets,
        },
      });
    }
  }

  for (let i = 0; i < mutations.length; i += 50) {
    const batch = mutations.slice(i, i + 50);
    console.log(`Sending batch ${Math.floor(i / 50) + 1} (${batch.length} mutations)...`);
    const res = await mutate(batch);
    if (res.error) {
      console.error("Batch error:", res.error);
    } else {
      console.log("Batch successful.");
    }
  }

  console.log("Done cleaning dead asset references!");
}

main().catch(console.error);
