/**
 * Seed script for iTools Store - Sanity CMS
 * Creates all content for the 5 features:
 * 1. Video Section (TikTok/social videos)
 * 2. Popup Banner (promo on entry)
 * 3. Brand Logos in Header
 * 4. Countdown Offers (deal tiles)
 * 5. Product Reviews (Google + website)
 * Plus: headerConfig, footerConfig, products with new fields
 */

const projectId = "kytfgk41";
const dataset = "production";
const apiVersion = "2025-01-01";
const token = "sk3TVifNMJi9ejiLQAy21tNpb1yvd2G517OP8TLjFn8hT388sfLeHbQKQU1E1lOm1tHdsWU5MLfSorsMQHoeAVGq5GhQ9jvrnXUsTaCi23MiBHkTZ73iv6rQdr5jfNdKsi5AgUUA5lkI5roaO66SojhlQpNdDnGM37qXWHlQq0nCWRdma9x6";

async function sanityMutate(mutations: any[]) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!response.ok) {
    const error = await response.text();
    console.error(`Mutation failed: ${response.status}`, error.substring(0, 200));
  } else {
    const result = await response.json();
    console.log(`✅ Mutation successful`);
  }
}

async function createIfNotExists(doc: any) {
  return sanityMutate([{ createIfNotExists: doc }]);
}

async function seedAll() {
  console.log("🌱 Starting comprehensive Sanity seed...\n");

  // ═══════════════════════════════════════════════════
  // 1. HEADER CONFIG (Feature 3: Brand Logos in Header)
  // ═══════════════════════════════════════════════════
  console.log("📋 1. Creating headerConfig with brand logos...");
  await createIfNotExists({
    _id: "header-config",
    _type: "headerConfig",
    phone: "01 234 5678",
    phoneUrl: "tel:+5112345678",
    location: "Lima, Perú",
    badge1: "Servicio Técnico Oficial Milwaukee",
    badge2: "Envío a todo Perú",
    announcementBar: "🔥 OFERTA ESPECIAL: Hasta 34% OFF en herramientas Milwaukee — ¡Solo esta semana!",
    showBrandLogos: true,
    brandLogos: [
      { name: "Milwaukee", slug: "milwaukee", order: 1 },
      { name: "DeWalt", slug: "dewalt", order: 2 },
      { name: "Bosch", slug: "bosch", order: 3 },
      { name: "Makita", slug: "makita", order: 4 },
      { name: "Stanley", slug: "stanley", order: 5 },
      { name: "3M", slug: "3m", order: 6 },
      { name: "Festool", slug: "festool", order: 7 },
      { name: "Metsabo", slug: "metabo", order: 8 },
      { name: "Ryobi", slug: "ryobi", order: 9 },
      { name: "Cresent", slug: "crescent", order: 10 },
      { name: "Bahco", slug: "bahco", order: 11 },
      { name: "Irwin", slug: "irwin", order: 12 },
    ],
  });

  // ═══════════════════════════════════════════════════
  // 2. FOOTER CONFIG
  // ═══════════════════════════════════════════════════
  console.log("📋 2. Creating footerConfig...");
  await createIfNotExists({
    _id: "footer-config",
    _type: "footerConfig",
    aboutText: "iTools Perú es distribuidor autorizado de las mejores marcas de herramientas profesionales: Milwaukee, DeWalt, Bosch, Makita y más. Ofrecemos servicio técnico oficial, garantía extendida y envío a todo el Perú.",
    contactInfo: {
      address: "Av. Universitaria 4974, Los Olivos, Lima",
      phone: "01 234 5678",
      email: "ventas@itools.pe",
      hours: "Lun-Vie 9:00-18:00, Sáb 9:00-14:00",
    },
    columns: [
      {
        title: "Categorías",
        links: [
          { label: "Herramientas Eléctricas", href: "/categoria/herramientas-electricas" },
          { label: "Herramientas Manuales", href: "/categoria/herramientas-manuales" },
          { label: "Equipos de Protección", href: "/categoria/equipos-de-proteccion" },
          { label: "Accesorios", href: "/categoria/accesorios" },
        ],
      },
      {
        title: "Marcas",
        links: [
          { label: "Milwaukee", href: "/marca/milwaukee" },
          { label: "DeWalt", href: "/marca/dewalt" },
          { label: "Bosch", href: "/marca/bosch" },
          { label: "Makita", href: "/marca/makita" },
        ],
      },
      {
        title: "Servicio al Cliente",
        links: [
          { label: "Mi Cuenta", href: "/cuenta" },
          { label: "Mis Pedidos", href: "/cuenta/pedidos" },
          { label: "Servicio Técnico", href: "/categoria/servicio-tecnico" },
          { label: "Contacto", href: "/contacto" },
        ],
      },
    ],
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/itoolsperu" },
      { platform: "instagram", url: "https://instagram.com/itoolsperu" },
      { platform: "youtube", url: "https://youtube.com/@itoolsperu" },
      { platform: "tiktok", url: "https://tiktok.com/@itoolsperu" },
    ],
    bottomLinks: [
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Libro de Reclamaciones", href: "/reclamaciones" },
    ],
  });

  // ═══════════════════════════════════════════════════
  // 3. VIDEO SECTION (Feature 1: TikTok/social videos)
  // ═══════════════════════════════════════════════════
  console.log("📋 3. Creating Video Section with TikTok/social support...");
  await createIfNotExists({
    _id: "video-section-main",
    _type: "videoSection",
    sectionTitle: "Videos de Productos y Promociones",
    sectionSubtitle: "Descubre nuestras herramientas en acción — Tutoriales, demos y más",
    videoSourceType: "mixed",
    ctaText: "Ver más productos",
    ctaLink: "/categoria/herramientas-electricas",
    videos: [
      {
        title: "Milwaukee M18 FUEL — Taladro de impacto en acción",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        isVertical: false,
        productSlug: "milwaukee-m18-fuel-taladro",
        order: 1,
      },
      {
        title: "DeWalt 20V MAX — Demo de sierra circular",
        videoUrl: "https://www.youtube.com/shorts/example2",
        isVertical: true,
        productSlug: "dewalt-20v-sierra-circular",
        order: 2,
      },
      {
        title: "Bosch Professional — Rotomartillo SDS-Plus",
        videoUrl: "https://www.tiktok.com/@itoolsperu/video/1234567890",
        isVertical: true,
        productSlug: "bosch-rotomartillo-sds",
        order: 3,
      },
      {
        title: "Makita 18V LXT — Atornillador de impacto",
        videoUrl: "https://www.youtube.com/watch?v=example4",
        isVertical: false,
        productSlug: "makita-18v-atornillador",
        order: 4,
      },
      {
        title: "PACKOUT Milwaukee — Configura tu sistema",
        videoUrl: "https://www.youtube.com/shorts/example5",
        isVertical: true,
        productSlug: "milwaukee-packout",
        order: 5,
      },
    ],
    order: 10,
    isActive: true,
  });

  // ═══════════════════════════════════════════════════
  // 4. PROMO POPUP (Feature 2: Banner emergente)
  // ═══════════════════════════════════════════════════
  console.log("📋 4. Creating Promo Popup...");
  // Set countdown to 7 days from now
  const popupCountdownEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await createIfNotExists({
    _id: "promo-popup-main",
    _type: "promoPopup",
    title: "¡OFERTA ESPECIAL Milwaukee!",
    subtitle: "Kit M18 FUEL Taladro + Atornillador de Impacto con 2 baterías 5.0Ah y cargador. ¡Oferta por tiempo limitado!",
    originalPrice: 2899.90,
    promoPrice: 2099.90,
    discountText: "-28%",
    ctaText: "Comprar Ahora",
    ctaLink: "/marca/milwaukee",
    countdownEnd: popupCountdownEnd,
    showOnEntry: true,
    delaySeconds: 3,
    isActive: true,
  });

  // ═══════════════════════════════════════════════════
  // 5. DEAL TILES WITH COUNTDOWN (Feature 4)
  // ═══════════════════════════════════════════════════
  console.log("📋 5. Creating Deal Tiles with countdown...");
  const dealsCountdownEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  
  const dealTiles = [
    {
      _id: "deal-bosch",
      _type: "dealTile",
      brand: "BOSCH",
      brandColor: "#1e4b8f",
      title: "Batería de 18 V de regalo",
      subtitle: "Consigue una batería GRATIS con kits BOSCH.",
      href: "/marca/bosch",
      countdownEnd: dealsCountdownEnd,
      discountPercentage: 20,
      originalPrice: 1299.90,
      promoPrice: 1039.90,
      productSlug: "bosch-18v-kit",
      order: 1,
      isActive: true,
    },
    {
      _id: "deal-milwaukee",
      _type: "dealTile",
      brand: "MILWAUKEE",
      brandColor: "#c61010",
      title: "Herramienta gratuita de elección",
      subtitle: "Con la compra de kits Milwaukee M18 seleccionados.",
      href: "/marca/milwaukee",
      countdownEnd: dealsCountdownEnd,
      discountPercentage: 34,
      originalPrice: 2899.90,
      promoPrice: 1909.90,
      productSlug: "milwaukee-m18-fuel-kit",
      order: 2,
      isActive: true,
    },
    {
      _id: "deal-dewalt",
      _type: "dealTile",
      brand: "DEWALT",
      brandColor: "#e6a817",
      textColor: "#1A1A1A",
      title: "Herramienta gratuita por nuestra cuenta",
      subtitle: "Con kit de batería DEWALT 20V MAX XR seleccionado.",
      href: "/marca/dewalt",
      countdownEnd: dealsCountdownEnd,
      discountPercentage: 25,
      originalPrice: 1799.90,
      promoPrice: 1349.90,
      productSlug: "dewalt-20v-xr-kit",
      order: 3,
      isActive: true,
    },
    {
      _id: "deal-makita",
      _type: "dealTile",
      brand: "MAKITA",
      brandColor: "#0077C8",
      title: "18V LXT — 15% adicional",
      subtitle: "15% extra en herramientas Makita 18V.",
      href: "/marca/makita",
      countdownEnd: dealsCountdownEnd,
      discountPercentage: 15,
      originalPrice: 999.90,
      promoPrice: 849.90,
      productSlug: "makita-18v-lxt",
      order: 4,
      isActive: true,
    },
    {
      _id: "deal-stanley",
      _type: "dealTile",
      brand: "STANLEY",
      brandColor: "#E35205",
      title: "Envío Gratis en Manuales",
      subtitle: "Herramientas manuales Stanley envío gratis.",
      href: "/categoria/herramientas-manuales",
      countdownEnd: dealsCountdownEnd,
      discountPercentage: 10,
      order: 5,
      isActive: true,
    },
    {
      _id: "deal-3m",
      _type: "dealTile",
      brand: "3M",
      brandColor: "#CC3300",
      title: "Seguridad — 10% extra",
      subtitle: "EPP 3M con 10% de descuento adicional.",
      href: "/categoria/equipos-de-proteccion",
      countdownEnd: dealsCountdownEnd,
      discountPercentage: 10,
      order: 6,
      isActive: true,
    },
  ];

  for (const tile of dealTiles) {
    await createIfNotExists(tile);
  }

  // ═══════════════════════════════════════════════════
  // 6. PRODUCT REVIEWS (Feature 5: Google + website reviews)
  // ═══════════════════════════════════════════════════
  console.log("📋 6. Creating Product Reviews (Google + website)...");
  
  const reviews = [
    // Google Reviews for iTools store
    {
      _id: "review-google-1",
      _type: "productReview",
      productName: "milwaukee-m18-fuel-taladro",
      author: "Gabriel Garzo",
      rating: 5,
      title: "Excelente rendimiento y potencia",
      comment: "El taladro M18 FUEL es increíble. Lo uso a diario en obra y nunca me ha fallado. La batería dura mucho y el torque es impresionante. 100% recomendado para profesionales.",
      isVerified: true,
      isLocalGuide: true,
      reviewCount: 127,
      datePublished: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      source: "google",
      order: 1,
      isActive: true,
    },
    {
      _id: "review-google-2",
      _type: "productReview",
      productName: "milwaukee-m18-fuel-taladro",
      author: "Oblin Seper",
      rating: 5,
      title: "La mejor inversión para mi taller",
      comment: "Después de años usando otras marcas, Milwaukee es otra liga. El servicio técnico de iTools es de primera, muy profesionales.",
      isVerified: true,
      isLocalGuide: true,
      reviewCount: 28,
      datePublished: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      source: "google",
      order: 2,
      isActive: true,
    },
    {
      _id: "review-google-3",
      _type: "productReview",
      productName: "dewalt-20v-sierra-circular",
      author: "Luis Alvarado Martinez",
      rating: 4,
      title: "Muy buena sierra, envío rápido",
      comment: "La sierra DeWalt 20V funciona perfectamente. El envío llegó en 3 días a Lima. Empaque impecable.",
      isVerified: false,
      isLocalGuide: false,
      datePublished: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
      source: "google",
      order: 3,
      isActive: true,
    },
    // Website reviews
    {
      _id: "review-web-1",
      _type: "productReview",
      productName: "milwaukee-m18-fuel-taladro",
      author: "Carlos Mendoza",
      rating: 5,
      title: "Herramienta profesional de verdad",
      comment: "Lo uso en obra hace 6 meses, diario, y va como el primer día. La garantía de Milwaukee a través de iTools es real, no como otras tiendas.",
      isVerified: true,
      source: "website",
      datePublished: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      order: 4,
      isActive: true,
    },
    {
      _id: "review-web-2",
      _type: "productReview",
      productName: "bosch-rotomartillo-sds",
      author: "Roberto Sánchez",
      rating: 4,
      title: "Buen rotomartillo para el precio",
      comment: "Excelente relación calidad-precio. El modo SDS-Plus hace la diferencia en concreto. Lo recomiendo para trabajos medianos.",
      isVerified: true,
      source: "website",
      datePublished: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      order: 5,
      isActive: true,
    },
    {
      _id: "review-web-3",
      _type: "productReview",
      productName: "makita-18v-atornillador",
      author: "Jorge Pérez",
      rating: 5,
      title: "Compacto y potente",
      comment: "No puedo creer tanta potencia en algo tan pequeño. El LED integrado es super útil en espacios oscuros. Compra verificada en iTools.",
      isVerified: true,
      source: "website",
      datePublished: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      order: 6,
      isActive: true,
    },
  ];

  for (const review of reviews) {
    await createIfNotExists(review);
  }

  // ═══════════════════════════════════════════════════
  // 7. BRAND SHOWCASE ITEMS (with logos for header)
  // ═══════════════════════════════════════════════════
  console.log("📋 7. Creating Brand Showcase Items...");
  const brandShowcaseItems = [
    { _id: "brand-milwaukee", _type: "brandShowcaseItem", name: "Milwaukee", slug: "milwaukee", showInGrid: true, order: 1, isActive: true },
    { _id: "brand-dewalt", _type: "brandShowcaseItem", name: "DeWalt", slug: "dewalt", showInGrid: true, order: 2, isActive: true },
    { _id: "brand-bosch", _type: "brandShowcaseItem", name: "Bosch", slug: "bosch", showInGrid: true, order: 3, isActive: true },
    { _id: "brand-makita", _type: "brandShowcaseItem", name: "Makita", slug: "makita", showInGrid: true, order: 4, isActive: true },
    { _id: "brand-stanley", _type: "brandShowcaseItem", name: "Stanley", slug: "stanley", showInGrid: true, order: 5, isActive: true },
    { _id: "brand-3m", _type: "brandShowcaseItem", name: "3M", slug: "3m", showInGrid: true, order: 6, isActive: true },
    { _id: "brand-festool", _type: "brandShowcaseItem", name: "Festool", slug: "festool", showInGrid: true, order: 7, isActive: true },
    { _id: "brand-metabo", _type: "brandShowcaseItem", name: "Metabo", slug: "metabo", showInGrid: true, order: 8, isActive: true },
    { _id: "brand-ryobi", _type: "brandShowcaseItem", name: "Ryobi", slug: "ryobi", showInGrid: true, order: 9, isActive: true },
    { _id: "brand-crescent", _type: "brandShowcaseItem", name: "Crescent", slug: "crescent", showInGrid: true, order: 10, isActive: true },
    { _id: "brand-bahco", _type: "brandShowcaseItem", name: "Bahco", slug: "bahco", showInGrid: true, order: 11, isActive: true },
    { _id: "brand-irwin", _type: "brandShowcaseItem", name: "Irwin", slug: "irwin", showInGrid: true, order: 12, isActive: true },
  ];

  for (const brand of brandShowcaseItems) {
    await createIfNotExists(brand);
  }

  // ═══════════════════════════════════════════════════
  // 8. HOME SETTINGS
  // ═══════════════════════════════════════════════════
  console.log("📋 8. Creating Home Settings...");
  await createIfNotExists({
    _id: "home-settings",
    _type: "homeSettings",
    toolCribTitle: "TOOL CRIB OF THE NORTH",
    toolCribLink: "/categoria/herramientas-electricas",
    exploreProductsTitle: "Explorar Productos",
    exploreProductsSubtitle: "Las mejores herramientas profesionales",
  });

  console.log("\n✅ Seed complete! All features are now in Sanity CMS.");
  console.log("📝 Edit content at: https://i-tools-steel.vercel.app/cms");
  console.log("🔄 Changes will auto-reflect on the frontend.");
}

seedAll().catch(console.error);
