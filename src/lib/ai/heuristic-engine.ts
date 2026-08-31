import Fuse from "fuse.js";

export interface AIProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
  image: string;
}

let fuseIndex: Fuse<AIProduct> | null = null;
let isLoaded = false;

export async function loadAICatalog() {
  if (isLoaded) return;
  try {
    const res = await fetch("/api/catalog-ai");
    const data = await res.json();
    if (data.products) {
      fuseIndex = new Fuse(data.products, {
        keys: ["name", "sku"],
        threshold: 0.3,
        distance: 100,
        includeScore: true,
      });
      isLoaded = true;
    }
  } catch (err) {
    console.error("Failed to load AI catalog", err);
  }
}

export function generateHeuristicResponse(msg: string): { type: "text" | "products", text: string, products?: AIProduct[] } {
  const lower = msg.toLowerCase().trim();
  
  if (lower.match(/^(hola|buenas|buenos|saludos|hi|hello)/)) {
    return { type: "text", text: "¡Hola! Soy tu asistente IA de iTools. No soy humano, pero conozco nuestro catálogo de más de 7,500 productos de memoria. ¿Qué herramienta buscas hoy?" };
  }
  
  if (lower.match(/(ubicacion|donde estan|direccion|local|tienda)/)) {
    return { type: "text", text: "Nuestra oficina central se encuentra en Lima, Perú. Pero no te preocupes, realizamos envíos seguros a nivel nacional. ¿Buscabas alguna herramienta?" };
  }
  
  if (lower.match(/(envio|delivery|reparto|llega|cuanto tarda)/)) {
    return { type: "text", text: "🚚 Hacemos envíos a todo el Perú.\n- Lima: Entrega en 24h a 48h hábiles.\n- Provincias: De 2 a 4 días hábiles mediante nuestro courier de confianza." };
  }
  
  if (lower.match(/(garantia|original|nuevo)/)) {
    return { type: "text", text: "Todos nuestros productos son 100% originales, nuevos en caja sellada y cuentan con garantía oficial de la marca en Perú." };
  }

  if (lower.match(/(gracias|ok|perfecto|entendido)/)) {
    return { type: "text", text: "¡De nada! Aquí estoy si necesitas buscar algo más." };
  }
  
  // Product Search Intent
  if (!fuseIndex) {
    return { type: "text", text: "Estoy procesando el catálogo de herramientas... por favor, pregúntame de nuevo en 3 segundos." };
  }
  
  const cleanSearch = lower.replace(/(tienes|tienen|busco|precio de|cuanto esta|cuanto cuesta|quiero|necesito|algún|algun|un|una)/g, "").trim();
  
  if (cleanSearch.length > 2) {
    const results = fuseIndex.search(cleanSearch);
    
    if (results.length > 0) {
      // Filter out low confidence
      const topResults = results.slice(0, 4).map(r => r.item);
      return {
        type: "products",
        text: `¡Claro! He encontrado estas opciones para "${cleanSearch}":`,
        products: topResults
      };
    } else {
      return { type: "text", text: `Lo siento, no he encontrado resultados exactos para "${cleanSearch}". Revisa la ortografía o intenta buscar por la marca (ej. "Taladro Milwaukee").` };
    }
  }
  
  return { type: "text", text: "No he logrado entender tu consulta. Por favor, sé más específico o prueba buscando el nombre de una herramienta (Ej: 'Llave de impacto DeWalt')." };
}
