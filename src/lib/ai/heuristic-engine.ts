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

export async function loadAICatalog() {
  // No longer needed, we search server-side to save bandwidth
  return Promise.resolve();
}

export async function generateHeuristicResponse(msg: string): Promise<{ type: "text" | "products", text: string, products?: AIProduct[] }> {
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

  if (lower.match(/(categorias|categoria|tipos|herramientas electricas|manuales|inalambricas)/)) {
    return { type: "text", text: "Ofrecemos varias categorías: Herramientas Inalámbricas, Eléctricas, Manuales, Accesorios y Almacenamiento (Packout). Puedes ver todas las categorías en el menú inferior o buscando una herramienta específica." };
  }

  if (lower.match(/(marcas|marca|milwaukee|dewalt|makita|bosch)/)) {
    return { type: "text", text: "Trabajamos con las mejores marcas profesionales: Milwaukee, DeWalt, Makita, Bosch, Stanley, entre otras. ¡Pídeme el precio de cualquier herramienta!" };
  };
  }

  if (lower.match(/(gracias|ok|perfecto|entendido)/)) {
    return { type: "text", text: "¡De nada! Aquí estoy si necesitas buscar algo más." };
  }
  
  // Product Search Intent
  const cleanSearch = lower.replace(/(tienes|tienen|busco|precio de|cuanto esta|cuanto cuesta|quiero|necesito|algún|algun|un|una)/g, "").trim();
  
  if (cleanSearch.length > 2) {
    try {
      const res = await fetch(`/api/catalog-ai?q=${encodeURIComponent(cleanSearch)}`);
      const data = await res.json();
      
      if (data.products && data.products.length > 0) {
        return {
          type: "products",
          text: `¡Claro! He encontrado estas opciones para "${cleanSearch}":`,
          products: data.products
        };
      } else {
        return { type: "text", text: `Lo siento, no he encontrado resultados exactos para "${cleanSearch}". Revisa la ortografía o intenta buscar por la marca (ej. "Taladro Milwaukee").` };
      }
    } catch (err) {
      return { type: "text", text: `Ocurrió un error al buscar "${cleanSearch}". Por favor intenta nuevamente en unos segundos.` };
    }
  }
  
  return { type: "text", text: "No he logrado entender tu consulta. Por favor, sé más específico o prueba buscando el nombre de una herramienta (Ej: 'Llave de impacto DeWalt')." };
}

