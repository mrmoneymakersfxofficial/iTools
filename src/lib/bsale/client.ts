/**
 * Bsale API Client for iTools Store
 * 
 * Handles all communication with the Bsale ERP API.
 * Docs: https://docs.bsale.dev/
 * 
 * Authentication: Custom header `access_token` on every request.
 * Rate limit: 3,000 requests per 300 seconds (600/min).
 */

const BSALE_BASE_URL = "https://api.bsale.io";
const BSALE_API_VERSION = "v1";

// ─── Core HTTP Client ───────────────────────────────────────────

interface BsaleResponse<T = unknown> {
  href: string;
  count?: number;
  limit?: number;
  offset?: number;
  items?: T[];
  next?: string;
}

interface BsaleError {
  error: { code: string; message: string };
}

function getToken(): string {
  const token = process.env.BSALE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("BSALE_ACCESS_TOKEN environment variable is not set");
  }
  return token;
}

async function bsaleRequest<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${BSALE_BASE_URL}/${BSALE_API_VERSION}${path}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    access_token: getToken(),
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 0 }, // No cache for real-time data
  });

  if (!response.ok) {
    const error: BsaleError = await response.json().catch(() => ({
      error: { code: String(response.status), message: response.statusText },
    }));
    throw new Error(
      `Bsale API error ${response.status}: ${error.error?.message || "Unknown error"}`
    );
  }

  // 204 No Content for DELETE
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ─── Products ───────────────────────────────────────────────────

export interface BsaleProduct {
  id: number;
  name: string;
  description: string | null;
  classification: number; // 0=product, 1=service, 3=pack
  ledgerAccount: string;
  costCenter: string;
  allowDecimal: number;
  stockControl: number; // 0=no, 1=yes
  printDetailPack: number;
  state: number; // 0=active, 1=inactive
  product_type: { href: string; id: string };
  product_taxes: { href: string };
}

export interface BsaleVariant {
  id: number;
  description: string;
  unlimitedStock: number;
  allowNegativeStock: number;
  state: number;
  barCode: string;
  code: string; // SKU
  serialNumber: number;
  product: { href: string; id: string };
  attribute_values: { href: string };
  costs: { href: string };
}

export async function listProducts(
  limit = 50,
  offset = 0,
  expand?: string[]
): Promise<BsaleResponse<BsaleProduct>> {
  const params: Record<string, string> = {
    limit: String(limit),
    offset: String(offset),
    state: "0", // Only active products
  };
  if (expand) params.expand = `[${expand.join(",")}]`;

  return bsaleRequest<BsaleResponse<BsaleProduct>>(
    "GET", "/products.json", undefined, params
  );
}

export async function getProduct(
  productId: number,
  expand?: string[]
): Promise<BsaleProduct> {
  const params: Record<string, string> = {};
  if (expand) params.expand = `[${expand.join(",")}]`;

  return bsaleRequest<BsaleProduct>(
    "GET", `/products/${productId}.json`, undefined, params
  );
}

export async function getProductVariants(
  productId: number
): Promise<BsaleResponse<BsaleVariant>> {
  return bsaleRequest<BsaleResponse<BsaleVariant>>(
    "GET", `/products/${productId}/variants.json`
  );
}

export async function countProducts(): Promise<number> {
  const result = await bsaleRequest<{ count: number }>(
    "GET", "/products/count.json"
  );
  return result.count;
}

// ─── Stock ──────────────────────────────────────────────────────

export interface BsaleStock {
  quantity: number;
  quantityReserved: number;
  quantityAvailable: number;
  variant: { href: string; id: string };
  office: { href: string; id: string };
}

export async function listStock(
  variantId?: number,
  officeId?: number
): Promise<BsaleResponse<BsaleStock>> {
  const params: Record<string, string> = {};
  if (variantId) params.variantid = `[${variantId}]`;
  if (officeId) params.officeid = String(officeId);

  return bsaleRequest<BsaleResponse<BsaleStock>>(
    "GET", "/stocks.json", undefined, params
  );
}

export async function getStockByVariant(
  variantId: number,
  officeId?: number
): Promise<BsaleStock[]> {
  const result = await listStock(variantId, officeId);
  return result.items || [];
}

// ─── Branches/Offices ──────────────────────────────────────────

export interface BsaleOffice {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  isVirtual: number; // 0=physical, 1=online
  country: string;
  municipality: string;
  city: string;
  zipCode: string;
  costCenter: string;
  state: number;
  defaultPriceList: number;
}

export async function listOffices(): Promise<BsaleResponse<BsaleOffice>> {
  return bsaleRequest<BsaleResponse<BsaleOffice>>(
    "GET", "/offices.json", undefined, { state: "0" }
  );
}

// ─── Documents (Invoices/Receipts/Orders) ──────────────────────

export interface BsaleDocumentDetail {
  variantId?: number;
  code?: string; // SKU
  barCode?: string;
  netUnitValue: number; // Price before tax (in cents)
  quantity: number;
  taxId?: string; // e.g. "[1,2]"
  comment?: string;
  discount?: number; // Percentage
}

export interface BsaleDocumentPayment {
  paymentTypeId: number;
  amount: number;
  recordDate: number; // Unix timestamp
}

export interface BsaleDocumentClient {
  code: string; // RUC or DNI
  company?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  municipality?: string;
  activity?: string;
  companyOrPerson: number; // 0=person, 1=company
}

export interface BsaleDocument {
  id: number;
  emissionDate: number;
  expirationDate: number;
  number: number;
  totalAmount: number;
  netAmount: number;
  taxAmount: number;
  urlPdf: string;
  urlPublicView: string;
  token: string;
  state: number;
  informedSii: number;
  document_type: { href: string; id: string };
  client: { href: string; id: string };
  office: { href: string; id: string };
}

export interface CreateDocumentRequest {
  documentTypeId: number;
  officeId: number;
  emissionDate: number;
  expirationDate: number;
  declareSii?: number;
  priceListId?: number;
  dispatch?: number; // 1=deduct stock
  sendEmail?: number;
  salesId?: string; // External ID (prevents duplicates)
  client: BsaleDocumentClient | { clientId: number };
  details: BsaleDocumentDetail[];
  payments?: BsaleDocumentPayment[];
  references?: Array<{
    number: number;
    referenceDate: number;
    reason: string;
    codeSii: number;
  }>;
}

export async function createDocument(
  data: CreateDocumentRequest
): Promise<BsaleDocument> {
  return bsaleRequest<BsaleDocument>("POST", "/documents.json", data);
}

export async function getDocument(docId: number): Promise<BsaleDocument> {
  return bsaleRequest<BsaleDocument>("GET", `/documents/${docId}.json`);
}

// ─── Payments ──────────────────────────────────────────────────

export interface BsalePayment {
  id: number;
  documentId: number;
  amount: number;
  state: number; // 0=unpaid, 1=paid, 2=partial
  paymentTypeId: number;
  checkDate: string | null;
}

export async function getPayment(paymentId: number): Promise<BsalePayment> {
  return bsaleRequest<BsalePayment>("GET", `/payments/${paymentId}.json`);
}

// ─── Document Types ─────────────────────────────────────────────

export interface BsaleDocumentType {
  id: number;
  name: string;
  codeSii: number;
  state: number;
}

export async function listDocumentTypes(): Promise<BsaleResponse<BsaleDocumentType>> {
  return bsaleRequest<BsaleResponse<BsaleDocumentType>>(
    "GET", "/document_types.json"
  );
}

// ─── Price Lists ────────────────────────────────────────────────

export interface BsalePriceDetail {
  variantId: number;
  basePrice: number;
  priceWithTax: number;
}

export async function getPriceListDetails(
  priceListId: number,
  variantId?: number
): Promise<BsaleResponse<BsalePriceDetail>> {
  const params: Record<string, string> = {};
  if (variantId) params.variant = String(variantId);

  return bsaleRequest<BsaleResponse<BsalePriceDetail>>(
    "GET", `/price_lists/${priceListId}/details.json`, undefined, params
  );
}

// ─── Stock Receptions (Add Stock) ──────────────────────────────

export interface StockReceptionDetail {
  quantity: number;
  code?: number; // Variant code/SKU
  variantId?: number;
  barCode?: string;
  cost: number;
}

export interface StockReception {
  document: string; // "GUÍA", "FACTURA", "OTRO"
  officeId: number;
  documentNumber: string;
  note: string;
  details: StockReceptionDetail[];
}

export async function createStockReception(
  data: StockReception
): Promise<unknown> {
  return bsaleRequest("POST", "/stocks/receptions.json", data);
}

// ─── Stock Consumptions (Remove Stock) ─────────────────────────

export interface StockConsumptionDetail {
  quantity: number;
  variantId?: number;
  code?: number;
  barCode?: string;
}

export interface StockConsumption {
  note: string;
  officeId: number;
  details: StockConsumptionDetail[];
}

export async function createStockConsumption(
  data: StockConsumption
): Promise<unknown> {
  return bsaleRequest("POST", "/stocks/consumptions.json", data);
}

// ─── Test Connectivity ──────────────────────────────────────────

export async function testConnection(): Promise<{
  connected: boolean;
  officeCount: number;
  productCount: number;
  offices: BsaleOffice[];
}> {
  try {
    const [offices, products] = await Promise.all([
      listOffices(),
      countProducts(),
    ]);

    return {
      connected: true,
      officeCount: offices.count || 0,
      productCount: products,
      offices: offices.items || [],
    };
  } catch (error) {
    return {
      connected: false,
      officeCount: 0,
      productCount: 0,
      offices: [],
    };
  }
}
