export interface SubcategoryItem {
  name: string;
  href: string;
}

export interface OfficialCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  subcategories: SubcategoryItem[];
}

export const officialCategories: OfficialCategory[] = [
  {
    id: "cat-electricas",
    name: "Herramientas Eléctricas",
    slug: "herramientas-electricas",
    icon: "Zap",
    order: 1,
    subcategories: [
      { name: "Taladros Percutores", href: "/buscar?q=taladro+percutor" },
      { name: "Taladros Especiales", href: "/buscar?q=taladro+especial" },
      { name: "Llave De Impacto", href: "/buscar?q=llave+de+impacto" },
      { name: "Demoledores", href: "/buscar?q=demoledores" },
      { name: "Rotomartillos", href: "/buscar?q=rotomartillo" },
      { name: "Pistolas De Calor", href: "/buscar?q=pistola+de+calor" },
      { name: "Pistola Para Pintar", href: "/buscar?q=pistola+para+pintar" },
      { name: "Esmeriles Angulares", href: "/buscar?q=esmeril+angular" },
      { name: "Esmeriles De Banco", href: "/buscar?q=esmeril+de+banco" },
      { name: "Lijadoras", href: "/buscar?q=lijadoras" },
      { name: "Aspiradoras", href: "/buscar?q=aspiradoras" },
      { name: "Engalletadora", href: "/buscar?q=engalletadora" },
      { name: "Hidrolavadoras", href: "/buscar?q=hidrolavadoras" },
      { name: "Mezclador De Pintura", href: "/buscar?q=mezclador+de+pintura" },
      { name: "Multipropósito", href: "/buscar?q=multiproposito" },
      { name: "Pulidoras", href: "/buscar?q=pulidoras" },
      { name: "Rectificadoras", href: "/buscar?q=rectificadoras" },
      { name: "Ruteadoras / Canteadoras", href: "/buscar?q=ruteadoras" },
      { name: "Cepillos Eléctricos", href: "/buscar?q=cepillos+electricos" },
      { name: "Cortadora De Mármol", href: "/buscar?q=cortadora+de+marmol" },
    ],
  },
  {
    id: "cat-inalambricas",
    name: "Herramientas Inalámbricas",
    slug: "herramientas-inalambricas",
    icon: "BatteryCharging",
    order: 2,
    subcategories: [
      { name: "Taladros Inalámbricos 18V / 20V", href: "/buscar?q=taladro+inalambrico" },
      { name: "Atornilladores de Impacto Inalámbricos", href: "/buscar?q=atornillador+de+impacto" },
      { name: "Rotomartillos a Batería", href: "/buscar?q=rotomartillo+a+bateria" },
      { name: "Amoladoras Inalámbricas Brushless", href: "/buscar?q=amoladora+inalambrica" },
      { name: "Sierras Circulares Inalámbricas", href: "/buscar?q=sierra+circular+inalambrica" },
      { name: "Sierras Caladoras Inalámbricas", href: "/buscar?q=sierra+caladora+inalambrica" },
      { name: "Sierras Sable Inalámbricas", href: "/buscar?q=sierra+sable+inalambrica" },
      { name: "Llaves de Impacto a Batería", href: "/buscar?q=llave+de+impacto+inalambrica" },
      { name: "Clavadoras y Engrapadoras Inalámbricas", href: "/buscar?q=clavadora+inalambrica" },
      { name: "Lijadoras a Batería", href: "/buscar?q=lijadora+a+bateria" },
      { name: "Aspiradoras Portátiles Inalámbricas", href: "/buscar?q=aspiradora+inalambrica" },
      { name: "Linternas y Focos LED de Trabajo", href: "/buscar?q=linterna+led+trabajo" },
      { name: "Baterías y Cargadores de Litio", href: "/categoria/baterias-cargadores" },
    ],
  },
  {
    id: "cat-manuales",
    name: "Herramientas Manuales",
    slug: "herramientas-manuales",
    icon: "Wrench",
    order: 3,
    subcategories: [
      { name: "Juegos de Llaves y Dados", href: "/buscar?q=juego+de+llaves" },
      { name: "Destornilladores y Puntas", href: "/buscar?q=destornilladores" },
      { name: "Alicates y Pinzas Industriales", href: "/buscar?q=alicates" },
      { name: "Martillos, Combos y Cinceles", href: "/buscar?q=martillos" },
      { name: "Arcos de Sierra y Cuchillas Cutter", href: "/buscar?q=arcos+de+sierra" },
      { name: "Prensas y Sargentos de Carpintero", href: "/buscar?q=prensas" },
      { name: "Llaves Francesas y Stilson", href: "/buscar?q=llave+francesa" },
      { name: "Cajas y Organizadores Manuales", href: "/categoria/almacenamiento" },
    ],
  },
  {
    id: "cat-especializados",
    name: "Equipos Especializados",
    slug: "equipos-especializados",
    icon: "Settings",
    order: 4,
    subcategories: [
      { name: "Generadores Eléctricos", href: "/buscar?q=generador+electrico" },
      { name: "Compresores de Aire Industriales", href: "/buscar?q=compresor+de+aire" },
      { name: "Soldadoras e Inversores Arco/TIG/MIG", href: "/buscar?q=soldadora+inversor" },
      { name: "Bombas de Agua y Motobombas", href: "/buscar?q=bomba+de+agua" },
      { name: "Maquinaria Ligera y Motores", href: "/buscar?q=maquinaria+ligera" },
      { name: "Niveles Láser y Distanciómetros", href: "/buscar?q=nivel+laser" },
    ],
  },
  {
    id: "cat-accesorios",
    name: "Accesorios",
    slug: "accesorios",
    icon: "Package",
    order: 5,
    subcategories: [
      { name: "Brocas para Concreto, Metal y Madera", href: "/buscar?q=brocas" },
      { name: "Discos de Corte Extra Fino y Desbaste", href: "/buscar?q=discos+de+corte" },
      { name: "Discos Diamantados para Porcelanato", href: "/buscar?q=disco+diamantado" },
      { name: "Hojas de Sierra Circular y Caladora", href: "/buscar?q=hojas+de+sierra" },
      { name: "Puntas de Impacto PH2, Torx y Pozidriv", href: "/buscar?q=puntas+de+impacto" },
      { name: "Lijas y Abrasivos Profesionales", href: "/buscar?q=lijas" },
    ],
  },
  {
    id: "cat-repuestos",
    name: "Repuestos",
    slug: "repuestos",
    icon: "Wrench",
    order: 6,
    subcategories: [
      { name: "Carbones y Escobillas Originales", href: "/buscar?q=carbones" },
      { name: "Inducidos y Campos de Motor", href: "/buscar?q=inducidos" },
      { name: "Interruptores y Gatillos Eléctricos", href: "/buscar?q=interruptores" },
      { name: "Mandriles y Chucks SDS / Automáticos", href: "/buscar?q=mandril" },
      { name: "Engranajes, Rodajes y Baleros", href: "/buscar?q=rodamientos" },
    ],
  },
  {
    id: "cat-seguridad",
    name: "Seguridad Industrial",
    slug: "seguridad-industrial",
    icon: "Shield",
    order: 7,
    subcategories: [
      { name: "Cascos de Seguridad y Barbiquejos", href: "/buscar?q=cascos+seguridad" },
      { name: "Lentes y Gafas de Protección UV", href: "/buscar?q=lentes+seguridad" },
      { name: "Guantes de Cuero y Anticorte Nivel 5", href: "/buscar?q=guantes+seguridad" },
      { name: "Protectores Auditivos Tipo Copa y Tapón", href: "/buscar?q=protectores+auditivos" },
      { name: "Respiradores y Filtros N95 / P100", href: "/buscar?q=respiradores" },
      { name: "Arneses y Líneas de Vida para Altura", href: "/buscar?q=arneses" },
    ],
  },
  {
    id: "cat-ferreteria",
    name: "Ferretería General",
    slug: "ferreteria-general",
    icon: "Layers",
    order: 8,
    subcategories: [
      { name: "Candados y Cerraduras de Alta Seguridad", href: "/buscar?q=candados" },
      { name: "Tornillería, Pernos y Anclajes", href: "/buscar?q=tornillos" },
      { name: "Siliconas, Selladores y Espumas PU", href: "/buscar?q=siliconas+selladores" },
      { name: "Cintas Aislantes y de Embalaje Industrial", href: "/buscar?q=cintas+aislantes" },
      { name: "Escaleras de Aluminio y Fibra de Vidrio", href: "/buscar?q=escaleras" },
    ],
  },
];

export const officialSubcategoriesBySlug: Record<string, SubcategoryItem[]> = Object.fromEntries(
  officialCategories.map((c) => [c.slug, c.subcategories])
);
