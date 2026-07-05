import type { Product, Brand, Category, HeroSlide } from "@/types";

// ── Brands ────────────────────────────────────────────────
export const brands: Brand[] = [
  { id: "b1", name: "Milwaukee", slug: "milwaukee", logo: null, featured: true },
  { id: "b2", name: "DeWalt", slug: "dewalt", logo: null, featured: true },
  { id: "b3", name: "Bosch", slug: "bosch", logo: null, featured: true },
  { id: "b4", name: "Makita", slug: "makita", logo: null, featured: false },
  { id: "b5", name: "Stanley", slug: "stanley", logo: null, featured: false },
  { id: "b6", name: "3M", slug: "3m", logo: null, featured: false },
  { id: "b7", name: "Husky", slug: "husky", logo: null, featured: false },
  { id: "b8", name: "Ridge Tool", slug: "ridge-tool", logo: null, featured: false },
];

// ── Categories ────────────────────────────────────────────
export const categories: Category[] = [
  {
    id: "c1", name: "Herramientas Eléctricas", slug: "herramientas-electricas",
    parentId: null, image: null, icon: "Zap", order: 1,
    children: [
      { id: "c1-1", name: "Taladros", slug: "taladros", parentId: "c1", image: null, icon: "CircleDot", order: 1 },
      { id: "c1-2", name: "Atornilladores", slug: "atornilladores", parentId: "c1", image: null, icon: "Settings", order: 2 },
      { id: "c1-3", name: "Sierras", slug: "sierras", parentId: "c1", image: null, icon: "Scissors", order: 3 },
      { id: "c1-4", name: "Esmeriladoras", slug: "esmeriladoras", parentId: "c1", image: null, icon: "Disc", order: 4 },
      { id: "c1-5", name: "Rotomartillos", slug: "rotomartillos", parentId: "c1", image: null, icon: "Hammer", order: 5 },
    ],
  },
  {
    id: "c2", name: "Herramientas Manuales", slug: "herramientas-manuales",
    parentId: null, image: null, icon: "Wrench", order: 2,
    children: [
      { id: "c2-1", name: "Llaves", slug: "llaves", parentId: "c2", image: null, icon: "Wrench", order: 1 },
      { id: "c2-2", name: "Pinzas", slug: "pinzas", parentId: "c2", image: null, icon: "Grip", order: 2 },
      { id: "c2-3", name: "Destornilladores", slug: "destornilladores", parentId: "c2", image: null, icon: "Screwdriver", order: 3 },
      { id: "c2-4", name: "Martillos", slug: "martillos", parentId: "c2", image: null, icon: "Hammer", order: 4 },
    ],
  },
  {
    id: "c3", name: "Jardín y Exterior", slug: "jardin-exterior",
    parentId: null, image: null, icon: "Trees", order: 3,
  },
  {
    id: "c4", name: "Seguridad Industrial", slug: "seguridad-industrial",
    parentId: null, image: null, icon: "Shield", order: 4,
  },
  {
    id: "c5", name: "Servicio Técnico Milwaukee", slug: "servicio-tecnico-milwaukee",
    parentId: null, image: null, icon: "Settings", order: 5,
  },
  {
    id: "c6", name: "Accesorios", slug: "accesorios",
    parentId: null, image: null, icon: "Package", order: 6,
  },
  {
    id: "c7", name: "Almacenamiento", slug: "almacenamiento",
    parentId: null, image: null, icon: "HardHat", order: 7,
  },
  {
    id: "c8", name: "Medición", slug: "medicion",
    parentId: null, image: null, icon: "Ruler", order: 8,
  },
];

// ── Products ──────────────────────────────────────────────
export const products: Product[] = [
  // ── Taladros Milwaukee ──
  {
    id: "p1", sku: "MIL-2801-20", name: "Taladro Percutor M18 FUEL 1/2\" Milwaukee",
    slug: "taladro-percutor-m18-fuel-12-milwaukee",
    description: "El Taladro Percutor M18 FUEL de 1/2\" cuenta con el motor POWERSTATE Brushless de Milwaukee, que ofrece hasta 60% más potencia que los taladros con cable. Con el sistema REDLINK PLUS Intelligence, el taladro proporciona un rendimiento óptimo al protegerse contra sobrecargas, sobrecalentamientos y descargas excesivas. Incluye 2 baterías M18 XC5.0 de alta capacidad, cargador M18 y maletín.",
    shortDescription: "Motor brushless POWERSTATE. Hasta 1,200 RPM y 18,000 BPM. Kit con 2 baterías XC5.0.",
    price: 2899.00, comparePrice: 3499.00,
    categoryId: "c1-1", brandId: "b1", brand: brands[0], category: categories[0]?.children?.[0],
    stock: 15, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Tipo de Motor": "Brushless POWERSTATE",
      "Velocidad (RPM)": "0-550 / 0-1,800", "Golpes por Minuto (BPM)": "0-18,500 / 0-31,500",
      "Mandril": "1/2\" metálico de 3 quijadas", "Capacidad Máx. Concreto": "1-1/4\"",
      "Peso": "5.3 lb (2.4 kg)", "Garantía": "5 años herramienta / 2 años batería",
    },
    rating: 4.8, reviewCount: 124, isFeatured: true, isOnSale: true, isNewArrival: false,
  },
  {
    id: "p2", sku: "MIL-2802-20", name: "Taladro Percutor Compacto M18 1/2\" Milwaukee",
    slug: "taladro-percutor-compacto-m18-12-milwaukee",
    description: "Taladro percutor compacto de la serie M18 diseñado para espacios reducidos sin sacrificar potencia. Cuenta con motor brushless, mandril de 1/2\" y solo 3.4 lb de peso, ideal para trabajos prolongados. Kit incluye 2 baterías M18 CP2.0, cargador y maletín.",
    shortDescription: "Ultra compacto. Solo 3.4 lb. Mandril 1/2\". Kit con 2 baterías CP2.0.",
    price: 1799.00, comparePrice: 2199.00,
    categoryId: "c1-1", brandId: "b1", brand: brands[0], category: categories[0]?.children?.[0],
    stock: 22, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Tipo de Motor": "Brushless",
      "Velocidad (RPM)": "0-450 / 0-1,700", "Peso": "3.4 lb (1.5 kg)",
      "Mandril": "1/2\"", "Longitud": "7.0\"",
    },
    rating: 4.6, reviewCount: 87, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  // ── Atornilladores Milwaukee ──
  {
    id: "p3", sku: "MIL-2953-20", name: "Impacto Inalámbrico M18 FUEL 1/4\" Hex Milwaukee",
    slug: "impacto-inalambrico-m18-fuel-14-hex-milwaukee",
    description: "El Impacto Inalámbrico M18 FUEL 1/4\" Hex de Milwaukee ofrece hasta 2,000 in-lbs de par de apriete, el más potente de su clase. Cuenta con el motor POWERSTATE Brushless de 4 polos y tecnología REDLINK PLUS. Kit completo con 2 baterías M18 XC5.0.",
    shortDescription: "2,000 in-lbs de par. El más potente de su clase. Kit con 2 baterías XC5.0.",
    price: 2599.00, comparePrice: 3099.00,
    categoryId: "c1-2", brandId: "b1", brand: brands[0], category: categories[0]?.children?.[1],
    stock: 18, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Par Máximo": "2,000 in-lbs",
      "Velocidad (RPM)": "0-3,500", "Golpes por Minuto": "0-4,300",
      "Peso": "3.1 lb (1.4 kg)", "Garantía": "5 años",
    },
    rating: 4.9, reviewCount: 203, isFeatured: true, isOnSale: true, isNewArrival: false,
  },
  // ── Sierras Milwaukee ──
  {
    id: "p4", sku: "MIL-2730-20", name: "Sierra Circular M18 FUEL 7-1/4\" Milwaukee",
    slug: "sierra-circular-m18-fuel-714-milwaukee",
    description: "Sierra circular con el motor POWERSTATE Brushless de Milwaukee que corta hasta 600 pies de tablero OSB por carga. El sistema REDLITHIUM XC5.0 proporciona hasta 370 cortes por carga. Incluye disco de 7-1/4\" y maletín.",
    shortDescription: "Motor brushless POWERSTATE. Hasta 600 pies de corte por carga. Disco 7-1/4\" incluido.",
    price: 2199.00, comparePrice: 2699.00,
    categoryId: "c1-3", brandId: "b1", brand: brands[0], category: categories[0]?.children?.[2],
    stock: 10, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Diámetro de Disco": "7-1/4\"",
      "Profundidad de Corte (90°)": "2-7/16\"", "Profundidad de Corte (45°)": "1-15/16\"",
      "Velocidad sin Carga": "5,800 RPM", "Peso": "5.5 lb (2.5 kg)",
    },
    rating: 4.7, reviewCount: 76, isFeatured: true, isOnSale: false, isNewArrival: false,
  },
  {
    id: "p5", sku: "MIL-2520-20", name: "Sierra Caladora M18 FUEL Milwaukee",
    slug: "sierra-caladora-m18-fuel-milwaukee",
    description: "La Sierra Caladora M18 FUEL de Milwaukee es la primera sierra caladora que elimina los desafíos que los usuarios han enfrentado con las sierras caladoras inalámbricas. Hasta 30% más potencia y el sistema ONE-KEY para personalización.",
    shortDescription: "30% más potencia que la generación anterior. Systema ONE-KEY. Cortes limpios en madera y metal.",
    price: 1599.00, comparePrice: null,
    categoryId: "c1-3", brandId: "b1", brand: brands[0], category: categories[0]?.children?.[2],
    stock: 8, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Velocidad Variable": "0-3,000 SPM",
      "Capacidad de Corte Madera": "2-3/4\"", "Capacidad de Corte Metal": "3/8\"",
      "Peso": "5.1 lb (2.3 kg)", "Longitud de Golpe": "1\"",
    },
    rating: 4.5, reviewCount: 54, isFeatured: false, isOnSale: false, isNewArrival: true,
  },
  // ── Rotomartillos ──
  {
    id: "p6", sku: "MIL-2715-20", name: "Rotomartillo SDS-Plus M18 FUEL 1-1/8\" Milwaukee",
    slug: "rotomartillo-sds-plus-m18-fuel-118-milwaukee",
    description: "El Rotomartillo SDS-Plus M18 FUEL de Milwaukee ofrece la potencia de un taladro con cable en formato inalámbrico. Con el motor POWERSTATE Brushless, proporciona 1.7 ft-lbs de energía de impacto. Ideal para perforación pesada en concreto.",
    shortDescription: "1.7 ft-lbs de energía de impacto. SDS-Plus. Kit con 2 baterías XC5.0.",
    price: 3299.00, comparePrice: 3899.00,
    categoryId: "c1-5", brandId: "b1", brand: brands[0], category: categories[0]?.children?.[4],
    stock: 6, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Energía de Impacto": "1.7 ft-lbs (EPTA)",
      "Velocidad (RPM)": "0-1,250 / 0-2,100", "Golpes por Minuto": "0-4,600 / 0-7,800",
      "Tipo de Encastre": "SDS-Plus", "Diámetro Máx. Concreto": "1-1/8\"",
      "Peso": "6.2 lb (2.8 kg)",
    },
    rating: 4.9, reviewCount: 92, isFeatured: true, isOnSale: true, isNewArrival: false,
  },
  // ── Esmeriladoras ──
  {
    id: "p7", sku: "MIL-2864-20", name: "Esmeriladora Angular M18 FUEL 4-1/2\" - 5\" Milwaukee",
    slug: "esmeriladora-angular-m18-fuel-45-5-milwaukee",
    description: "La Esmeriladora Angular M18 FUEL de 4-1/2\" / 5\" es la primera esmeriladora inalámbrica que supera el rendimiento de las herramientas con cable. Sistema de frenado REDLITHIUM que detiene el disco en menos de 2 segundos.",
    shortDescription: "Supera el rendimiento de herramientas con cable. Frenado en <2 seg. Kit completo.",
    price: 1899.00, comparePrice: 2299.00,
    categoryId: "c1-4", brandId: "b1", brand: brands[0], category: categories[0]?.children?.[3],
    stock: 12, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Diámetro de Disco": "4-1/2\" - 5\"",
      "Velocidad sin Carga": "8,500 RPM", "Interruptor": "Sin retención / con retención (ambos incluidos)",
      "Peso": "4.8 lb (2.2 kg)", "Longitud": "12.3\"",
    },
    rating: 4.7, reviewCount: 68, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  // ── DeWalt Products ──
  {
    id: "p8", sku: "DW-DCD791D2", name: "Taladro Inalámbrico DeWalt 20V MAX XR 1/2\"",
    slug: "taladro-inalambrico-dewalt-20v-max-xr-12",
    description: "Taladro DeWalt 20V MAX XR con motor brushless de alta eficiencia. Cuenta con 2 velocidades, mandril de 1/2\" metal rígido y LED integrado con modo de 20 segundos de retardo. Kit incluye 2 baterías 2.0Ah.",
    shortDescription: "Motor brushless XR. 2 velocidades. LED de 20 seg. Kit con 2 baterías 2.0Ah.",
    price: 1699.00, comparePrice: 1999.00,
    categoryId: "c1-1", brandId: "b2", brand: brands[1], category: categories[0]?.children?.[0],
    stock: 20, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "20V MAX", "Motor": "Brushless",
      "Velocidad": "0-650 / 0-2,000 RPM", "Mandril": "1/2\" metal rígido",
      "Peso": "3.4 lb", "Batería Incluida": "2x 2.0Ah",
    },
    rating: 4.5, reviewCount: 145, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  {
    id: "p9", sku: "DW-DCF887D2", name: "Impacto DeWalt 20V MAX XR 1/4\" Hex",
    slug: "impacto-dewalt-20v-max-xr-14-hex",
    description: "Impacto inalámbrico DeWalt con motor brushless XR de 3 velocidades. Ofrece hasta 1,825 in-lbs de par de apriete con modo de precisión a 3 velocidades. Compacto y liviano para máxima maniobrabilidad.",
    shortDescription: "3 velocidades. 1,825 in-lbs de par. Modo de precisión. Kit con 2 baterías.",
    price: 1499.00, comparePrice: 1799.00,
    categoryId: "c1-2", brandId: "b2", brand: brands[1], category: categories[0]?.children?.[1],
    stock: 25, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "20V MAX", "Par Máximo": "1,825 in-lbs",
      "Velocidad": "0-400 / 0-1,200 / 0-1,750 / 0-2,250 RPM",
      "Peso": "3.4 lb", "Garantía": "3 años limitada",
    },
    rating: 4.6, reviewCount: 178, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  // ── Bosch Products ──
  {
    id: "p10", sku: "BOS-GBH18V-28DK", name: "Taladro Percutor Bosch 18V 1/2\" con Kit",
    slug: "taladro-percutor-bosch-18v-12-con-kit",
    description: "Taladro percutor Bosch 18V con tecnología brushless de alto rendimiento. Máxima potencia en perforación de madera, metal y concreto. Diseño ergonómico con empuñadura suave. Kit con 2 baterías ProCore18V 4.0Ah.",
    shortDescription: "Brushless ECC. Ergonómico. Kit con 2 baterías ProCore 4.0Ah.",
    price: 2199.00, comparePrice: null,
    categoryId: "c1-1", brandId: "b3", brand: brands[2], category: categories[0]?.children?.[0],
    stock: 14, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Par Máximo (duro)": "57 Nm",
      "Velocidad": "0-500 / 0-1,900 RPM", "Peso": "1.7 kg",
      "Batería": "2x ProCore18V 4.0Ah", "Garantía": "3 años",
    },
    rating: 4.4, reviewCount: 63, isFeatured: false, isOnSale: false, isNewArrival: true,
  },
  {
    id: "p11", sku: "BOS-GSR18V-190", name: "Taladro Destornillador Bosch 18V EC Brushless",
    slug: "taladro-destornillador-bosch-18v-ec-brushless",
    description: "Taladro destornillador Bosch 18V con motor EC Brushless para mayor durabilidad y tiempos de ejecución. 20 posiciones de torque para una gran variedad de aplicaciones. Incluye 2 baterías 2.0Ah.",
    shortDescription: "Motor EC Brushless. 20 posiciones de torque. Compacto y ligero.",
    price: 1199.00, comparePrice: 1499.00,
    categoryId: "c1-2", brandId: "b3", brand: brands[2], category: categories[0]?.children?.[1],
    stock: 30, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Par Máximo": "54 Nm (duro)",
      "Velocidad": "0-500 / 0-1,900 RPM", "Torque": "20+1 posiciones",
      "Peso": "1.5 kg",
    },
    rating: 4.3, reviewCount: 91, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  // ── Herramientas Manuales ──
  {
    id: "p12", sku: "STN-90-947", name: "Juego de Llaves Combinadas Stanley 14 Piezas 1/4\" - 3/4\"",
    slug: "juego-llaves-combinadas-stanley-14-piezas",
    description: "Juego de 14 llaves combinadas Stanley con acabado cromado brillante. Fabricadas en acero al carbono de alta calidad con restricción de torque. Incluye maletín de plástico para almacenamiento organizado.",
    shortDescription: "14 llaces combinadas. Acero cromado. Maletín incluido.",
    price: 189.00, comparePrice: 249.00,
    categoryId: "c2-1", brandId: "b5", brand: brands[4], category: categories[1]?.children?.[0],
    stock: 50, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Cantidad de Piezas": "14", "Tamaño": "1/4\" a 3/4\"",
      "Material": "Acero al carbono cromado", "Acabado": "Cromado brillante",
      "Tipo": "Combinadas (boca + estrella)",
    },
    rating: 4.5, reviewCount: 234, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  {
    id: "p13", sku: "STN-20-045", name: "Juego de Destornilladores Stanley 10 Piezas",
    slug: "juego-destornilladores-stanley-10-piezas",
    description: "Juego de 10 destornilladores Stanley con puntas magnéticas. Mango bi-material ergonómico para mayor comodidad. Incluye destornilladores de punta plana y Phillips en diferentes tamaños.",
    shortDescription: "10 piezas. Puntas magnéticas. Mango ergonómico bi-material.",
    price: 79.90, comparePrice: 99.90,
    categoryId: "c2-3", brandId: "b5", brand: brands[4], category: categories[1]?.children?.[2],
    stock: 75, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Cantidad": "10 piezas", "Tipo de Puntas": "Plana y Phillips",
      "Mango": "Bi-material", "Magnetizado": "Sí",
    },
    rating: 4.2, reviewCount: 156, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  {
    id: "p14", sku: "STN-84-098", name: "Cinta Métrica Stanley 25ft x 1\" POWERLOCK",
    slug: "cinta-metrica-stanley-25ft-powerlock",
    description: "Cinta métrica Stanley POWERLOCK de 25 pies con diseño duradero y resistente. Caja de plástico resistente a impactos, gancho de cinta de 3 remaches y marcaciones fáciles de leer.",
    shortDescription: "25 pies. POWERLOCK. Resistente a impactos. 3 remaches en gancho.",
    price: 49.90, comparePrice: null,
    categoryId: "c8", brandId: "b5", brand: brands[4], category: categories[7],
    stock: 100, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Longitud": "25 ft (7.5m)", "Ancho de Cinta": "1\" (25mm)",
      "Material Cinta": "Acero", "Tipo": "POWERLOCK",
    },
    rating: 4.6, reviewCount: 312, isFeatured: false, isOnSale: false, isNewArrival: false,
  },
  // ── Seguridad Industrial ──
  {
    id: "p15", sku: "3M-1100-132501", name: "Protectores Auditivos 3M Peltor Optime",
    slug: "protectores-auditivos-3m-peltor-optime",
    description: "Protectores auditivos 3M Peltor Optime diseñados para entornos de alto ruido industrial. Reducción de ruido de 30 dB. Diadema ajustable y almohadillas reemplazables para máxima comodidad durante todo el día.",
    shortDescription: "NRR 30 dB. Diadema ajustable. Almohadillas reemplazables. Uso industrial.",
    price: 159.00, comparePrice: null,
    categoryId: "c4", brandId: "b6", brand: brands[5], category: categories[3],
    stock: 40, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Reducción de Ruido (NRR)": "30 dB", "Tipo": "Diadema (over-ear)",
      "Material": "ABS / espuma", "Uso": "Industrial",
      "Certificación": "ANSI S3.19",
    },
    rating: 4.4, reviewCount: 87, isFeatured: false, isOnSale: false, isNewArrival: true,
  },
  {
    id: "p16", sku: "3M-11650", name: "Gafas de Seguridad 3M Virtua con Lente Clara",
    slug: "gafas-seguridad-3m-virtua-lente-clara",
    description: "Gafas de seguridad 3M Virtua con lente clara anti-rayas. Montura ligera en policarbonato, protector de nariz integrado y protección UV400. Ideales para entornos de trabajo donde se requiere protección ocular básica.",
    shortDescription: "Lente anti-rayas. UV400. Montura ligera. Paquete de 12 unidades.",
    price: 189.00, comparePrice: 228.00,
    categoryId: "c4", brandId: "b6", brand: brands[5], category: categories[3],
    stock: 60, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Cantidad": "12 unidades", "Lente": "Clara anti-rayas",
      "Material Montura": "Policarbonato", "Protección UV": "UV400",
      "Certificación": "ANSI Z87.1",
    },
    rating: 4.3, reviewCount: 145, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  // ── More Milwaukee ──
  {
    id: "p17", sku: "MIL-49-24-0216", name: "Kit de Baterías M18 REDLITHIUM XC5.0 (2 unidades)",
    slug: "kit-baterias-m18-redlithium-xc5-2-unidades",
    description: "Kit de 2 baterías Milwaukee M18 REDLITHIUM XC5.0 de 5.0Ah. Proporcionan hasta 2.5x más tiempo de ejecución, 20% más potencia y 2x más recargas que las baterías estándar. Compatible con toda la línea M18.",
    shortDescription: "2x 5.0Ah. 2.5x más duración. Compatible con toda la línea M18.",
    price: 1199.00, comparePrice: 1499.00,
    categoryId: "c6", brandId: "b1", brand: brands[0], category: categories[5],
    stock: 35, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Capacidad": "5.0 Ah", "Voltaje": "18V",
      "Tecnología": "REDLITHIUM XC", "Células": "18650 premium",
      "Temperatura Operación": "-20°C a 60°C",
    },
    rating: 4.8, reviewCount: 267, isFeatured: true, isOnSale: true, isNewArrival: false,
  },
  {
    id: "p18", sku: "MIL-48-59-1812", name: "Cargador Rápido M18/M12 Milwaukee",
    slug: "cargador-rapido-m18-m12-milwaukee",
    description: "Cargador de baterías rápido Milwaukee compatible con los sistemas M18 y M12. Carga una batería M18 XC5.0 en solo 60 minutos. Diseño compacto con indicadores LED de estado de carga y protección contra sobrecarga.",
    shortDescription: "Compatible M18/M12. Carga en 60 min. Indicadores LED.",
    price: 399.00, comparePrice: null,
    categoryId: "c6", brandId: "b1", brand: brands[0], category: categories[5],
    stock: 45, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Compatible con": "M18 y M12", "Tiempo de Carga XC5.0": "~60 min",
      "Voltaje Entrada": "120V", "Peso": "1.1 lb",
    },
    rating: 4.7, reviewCount: 189, isFeatured: false, isOnSale: false, isNewArrival: true,
  },
  // ── Almacenamiento ──
  {
    id: "p19", sku: "MIL-48-22-8425", name: "Organizador Modular Milwaukee PACKOUT 2 Piezas",
    slug: "organizador-modular-milwaukee-packout-2-piezas",
    description: "Sistema de almacenamiento modular Milwaukee PACKOUT con 2 organizadores. Cuentas con 11 compartimientos removibles en el organizador superior y protección IP65 contra polvo y agua. Se conectan entre sí y con otros componentes PACKOUT.",
    shortDescription: "2 organizadores. 11 compartimientos. IP65. Sistema modular PACKOUT.",
    price: 449.00, comparePrice: 549.00,
    categoryId: "c7", brandId: "b1", brand: brands[0], category: categories[6],
    stock: 20, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Compartimientos": "11 removibles", "Protección": "IP65 (polvo y agua)",
      "Material": "Polipropileno de impacto", "Sistema": "PACKOUT modular",
      "Peso": "3.5 lb",
    },
    rating: 4.6, reviewCount: 98, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  {
    id: "p20", sku: "MIL-48-22-8430", name: "Caja de Herramientas PACKOUT Rolling Milwaukee",
    slug: "caja-herramientas-packout-rolling-milwaukee",
    description: "Caja de herramientas rodante Milwaukee PACKOUT de 22 pulgadas. Ruedas de 9\" todo terreno, asa retráctil y capacidad de carga de 100 lb. Interior amplio con organizador removible. Compatible con todo el ecosistema PACKOUT.",
    shortDescription: "22\" rodante. Ruedas 9\" todo terreno. 100 lb capacidad. PACKOUT.",
    price: 799.00, comparePrice: 999.00,
    categoryId: "c7", brandId: "b1", brand: brands[0], category: categories[6],
    stock: 8, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Capacidad": "100 lb", "Ruedas": "9\" todo terreno",
      "Interior": "30.5\" x 16.5\" x 14\"", "Material": "Polipropileno de impacto",
      "Protección": "IP65",
    },
    rating: 4.9, reviewCount: 56, isFeatured: true, isOnSale: true, isNewArrival: false,
  },
  // ── Makita ──
  {
    id: "p21", sku: "MKT-XRFO1Z", name: "Rotomartillo SDS-Plus Makita 18V LXT Brushless",
    slug: "rotomartillo-sds-plus-makita-18v-lxt-brushless",
    description: "Rotomartillo Makita 18V LXT con motor brushless de alta eficiencia. Ofrece 3 modos de operación: solo rotación, rotación con percusión y solo percusión. Con sistema XPT (Extreme Protection Technology) contra polvo y agua.",
    shortDescription: "3 modos de operación. Brushless. XPT (resistente al polvo/agua).",
    price: 2499.00, comparePrice: 2899.00,
    categoryId: "c1-5", brandId: "b4", brand: brands[3], category: categories[0]?.children?.[4],
    stock: 11, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Voltaje": "18V", "Energía de Impacto": "1.7 Joules",
      "Velocidad (RPM)": "0-680 / 0-1,200 / 0-2,350",
      "Golpes por Minuto": "0-4,600 / 0-8,200 / 0-17,500",
      "Encastre": "SDS-Plus", "Protección": "XPT",
    },
    rating: 4.5, reviewCount: 72, isFeatured: false, isOnSale: true, isNewArrival: true,
  },
  // ── More manual tools ──
  {
    id: "p22", sku: "STN-84-106", name: "Nivel de Burbuja Stanley 24\" Torpedo",
    slug: "nivel-burbuja-stanley-24-torpedo",
    description: "Nivel de burbuja Stanley de 24 pulgadas con 3 viales de precisión (horizontal, vertical y 45°). Cuerpo de aluminio extruido con bordes reforzados. Precisión de 0.0005\" por pulgada.",
    shortDescription: "24\" aluminio. 3 viales de precisión. Precisión 0.0005\"/pulgada.",
    price: 69.90, comparePrice: 89.90,
    categoryId: "c8", brandId: "b5", brand: brands[4], category: categories[7],
    stock: 35, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Longitud": "24\"", "Material": "Aluminio extruido",
      "Viales": "3 (horizontal, vertical, 45°)", "Precisión": "0.0005\"/pulgada",
    },
    rating: 4.4, reviewCount: 167, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
  {
    id: "p23", sku: "MIL-48-22-2401", name: "Navaja Retráctil Milwaukee FASTBACK 10-1/4\"",
    slug: "navaja-retractil-milwaukee-fastback-10-14",
    description: "Navaja retráctil Milwaukee FASTBACK con apertura de una sola mano y cambio de hoja rápido sin herramientas. Mango ergonómico con inserto de goma para agarre firme. Incluye 5 hojas extra.",
    shortDescription: "Apertura 1 mano. Cambio rápido de hoja. Incluye 5 hojas extra.",
    price: 89.90, comparePrice: null,
    categoryId: "c2", brandId: "b1", brand: brands[0], category: categories[1],
    stock: 55, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Longitud Abierto": "10-1/4\"", "Cambio de Hoja": "Sin herramientas",
      "Hojas Incluidas": "5 extra", "Material Mango": "Aluminio + goma",
    },
    rating: 4.7, reviewCount: 289, isFeatured: false, isOnSale: false, isNewArrival: false,
  },
  {
    id: "p24", sku: "MIL-48-59-1202", name: "Set de Puntas y Bitas Milwaukee SHOCKWAVE 60 Piezas",
    slug: "set-puntas-bitas-milwaukee-shockwave-60-piezas",
    description: "Set completo de 60 piezas Milwaukee SHOCKWAVE con punta de impacto, bitas Phillips, Torx, Hex y Square. Geometría SHOCKWAVE para mayor durabilidad. Compatible con todos los impactos de 1/4\".",
    shortDescription: "60 piezas. Geometría SHOCKWAVE. Para impacto. Maletín incluido.",
    price: 349.00, comparePrice: 429.00,
    categoryId: "c6", brandId: "b1", brand: brands[0], category: categories[5],
    stock: 28, images: ["/images/products/placeholder-tool.jpg"],
    specs: {
      "Total de Piezas": "60", "Tipos": "Phillips, Torx, Hex, Square",
      "Compatible con": "Impacto 1/4\" hex", "Maletín": "Incluido",
    },
    rating: 4.8, reviewCount: 198, isFeatured: false, isOnSale: true, isNewArrival: false,
  },
];

// ── Hero Slides ───────────────────────────────────────────
export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "M18 FUEL™ — El Poder Sin Límites",
    subtitle: "Herramientas inalámbricas de mayor rendimiento. Servicio Técnico Oficial Milwaukee Perú.",
    cta: "Ver Colección M18",
    ctaLink: "#",
    image: "/images/hero/hero-1.jpg",
    badge: "NUEVO",
    badgeColor: "bg-itools-red",
  },
  {
    id: 2,
    title: "Ofertas del Mes — Hasta 30% OFF",
    subtitle: "Taladros, impactos, sierras y más. Aprovecha los mejores precios en herramientas profesionales.",
    cta: "Ver Ofertas",
    ctaLink: "#",
    image: "/images/hero/hero-2.jpg",
    badge: "OFERTA",
    badgeColor: "bg-amber-500",
  },
  {
    id: 3,
    title: "Servicio Técnico Oficial Milwaukee",
    subtitle: "Reparación, mantenimiento y garantía. RUC: 20610613749. Atención profesional garantizada.",
    cta: "Conocer Más",
    ctaLink: "#",
    image: "/images/hero/hero-3.jpg",
    badge: "SERVICIO",
    badgeColor: "bg-itools-blue",
  },
];

// ── Helper functions ──────────────────────────────────────
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getOnSaleProducts(): Product[] {
  return products.filter((p) => p.isOnSale);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategorySlug(categorySlug: string): Product[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  // If it has children, include products from all children
  if (cat.children?.length) {
    const childIds = cat.children.map((c) => c.id);
    return products.filter((p) => p.categoryId && childIds.includes(p.categoryId));
  }
  // Otherwise, return products directly in this category
  const parentCat = categories.find((c) => c.children?.some(ch => ch.slug === categorySlug));
  if (parentCat) {
    const child = parentCat.children!.find((c) => c.slug === categorySlug);
    if (child) return products.filter((p) => p.categoryId === child.id);
  }
  return products.filter((p) => p.categoryId === cat.id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProductsByBrand(brandId: string): Product[] {
  return products.filter((p) => p.brandId === brandId);
}

export function getTopCategories(): Category[] {
  return categories.filter((c) => !c.parentId);
}

export function getFeaturedBrands(): Brand[] {
  return brands.filter((b) => b.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.brand?.name.toLowerCase().includes(q)
  );
}

// ── Brand helpers ──────────────────────────────────────────
export const brandThemes: Record<string, { color: string; textColor: string; tabs?: string[] }> = {
  milwaukee: { color: "#D1001C", textColor: "#FFF", tabs: ["M18", "M12", "MX FUEL", "PACKOUT", "FORGE", "PIPELINE", "RED HOT DEALS"] },
  dewalt: { color: "#FFD700", textColor: "#1A1A1A", tabs: ["20V MAX", "12V MAX", "FLEXVOLT", "ATOMIC", "PROFORMANCE"] },
  bosch: { color: "#005691", textColor: "#FFF", tabs: ["18V", "12V", "GREEN", "PROFESSIONAL"] },
  makita: { color: "#0077C8", textColor: "#FFF", tabs: ["18V LXT", "12V CXT", "X2", "LXT 40V"] },
  ego: { color: "#0d5c4a", textColor: "#FFF", tabs: ["56V", "POWER+", "TOOL ONLY"] },
  stanley: { color: "#E35205", textColor: "#FFF", tabs: ["FATMAX", "STANLEY PRO"] },
  "3m": { color: "#CC3300", textColor: "#FFF", tabs: ["SEGURIDAD", "INDUSTRIAL"] },
  "metabo-hpt": { color: "#1b7a3a", textColor: "#FFF", tabs: ["MULTIVOLT", "AIR NAILER"] },
  stihl: { color: "#E35205", textColor: "#FFF", tabs: ["BATERÍA", "GASOLINA"] },
  fein: { color: "#666666", textColor: "#FFF", tabs: ["MULTIMASTER", "SLIPPER"] },
  flex: { color: "#1A1A1A", textColor: "#FFF", tabs: ["24V", "40V MAX"] },
  festool: { color: "#1A1A1A", textColor: "#00A651", tabs: ["SISTEMA", "TSC", "CT"] },
  honda: { color: "#CC0000", textColor: "#FFF", tabs: ["GENERADORES", "MOTORES", "BOMBAS"] },
  "klein-tools": { color: "#FFC220", textColor: "#1A1A1A", tabs: ["ELÉCTRICAS", "MANUALES"] },
  toro: { color: "#1A1A1A", textColor: "#CC0000", tabs: ["CÉSPED", "SOPLORES"] },
  skil: { color: "#CC0000", textColor: "#FFF", tabs: ["12V", "20V"] },
  jet: { color: "#CC0000", textColor: "#FFF", tabs: ["SIERRAS", "TORNO"] },
  knaack: { color: "#8B6914", textColor: "#FFF", tabs: ["ALMACENAMIENTO"] },
};

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getProductsByBrandSlug(slug: string): Product[] {
  return products.filter(
    (p) => p.brand?.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getBrandTheme(slug: string) {
  return brandThemes[slug] || { color: "#333", textColor: "#FFF", tabs: [] };
}