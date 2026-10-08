import fs from "fs";

const PROJECT_ID = "3qqlwuul";
const DATASET = "production";
const TOKEN = "skX1ZDwS1UMzBOyAywCDlQoATjvZgmRj01eKR2uzyTvsZ4SiGFrLC8HQXXg6TCOSgdJIAggwi9pTYiicfumLawUUW6LRlABti7dHXuGdczZMirYrucFNvfrd4iycF8ynRsQdYwyXVDvRvsuTuLXYQUsKqraRtA6pxmZdaFfgGNylzB3dSsH5";
const NDJSON_FILE = "sanity-clean-migration.ndjson";

function makeReferencesWeak(obj) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      makeReferencesWeak(item);
    }
  } else {
    if (obj._type === "reference" || (obj._ref && typeof obj._ref === "string")) {
      obj._weak = true;
    }
    for (const key of Object.keys(obj)) {
      makeReferencesWeak(obj[key]);
    }
  }
}

async function sendBatch(mutations) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2023-08-01/data/mutate/${DATASET}?visibility=async`;
  let retries = 5;

  while (retries > 0) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mutations }),
      });

      if (res.ok) {
        return true;
      }

      const errText = await res.text();
      console.warn(`Mutation warning (${res.status}): ${errText.slice(0, 200)}`);
      retries--;
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (err) {
      console.warn("Network error:", err.message);
      retries--;
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  return false;
}

async function main() {
  console.log("=== INICIANDO MIGRACIÓN A PROYECTO 3qqlwuul ===");
  const lines = fs.readFileSync(NDJSON_FILE, "utf8").trim().split("\n");

  const imageAssets = [];
  const structuralDocs = [];
  const productDocs = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const doc = JSON.parse(line);
      delete doc._rev;
      delete doc._system;
      makeReferencesWeak(doc);

      if (doc._type === "sanity.imageAsset") {
        imageAssets.push(doc);
      } else if (doc._type === "product") {
        productDocs.push(doc);
      } else {
        structuralDocs.push(doc);
      }
    } catch (e) {
      console.error("Error al parsear línea:", e);
    }
  }

  console.log(`Documentos a migrar:`);
  console.log(`- Image Assets: ${imageAssets.length}`);
  console.log(`- Estructura y Configuración: ${structuralDocs.length}`);
  console.log(`- Productos: ${productDocs.length}`);
  console.log(`- Total general: ${imageAssets.length + structuralDocs.length + productDocs.length}`);

  const allDocuments = [...imageAssets, ...structuralDocs, ...productDocs];
  const BATCH_SIZE = 50;
  let processed = 0;

  for (let i = 0; i < allDocuments.length; i += BATCH_SIZE) {
    const batch = allDocuments.slice(i, i + BATCH_SIZE);
    const mutations = batch.map((doc) => ({ createOrReplace: doc }));

    const ok = await sendBatch(mutations);
    if (ok) {
      processed += batch.length;
      const pct = ((processed / allDocuments.length) * 100).toFixed(1);
      if (processed % 250 === 0 || processed === allDocuments.length) {
        console.log(`[PROGRESO ${pct}%] ${processed} de ${allDocuments.length} documentos subidos exitosamente.`);
      }
    } else {
      console.error(`Error crítico en lote ${i} - ${i + BATCH_SIZE}`);
    }
  }

  console.log("\n================================================");
  console.log(`¡MIGRACIÓN COMPLETADA EXITOSAMENTE!`);
  console.log(`Total documentos migrados: ${processed} / ${allDocuments.length}`);
  console.log("================================================");
}

main().catch(console.error);
