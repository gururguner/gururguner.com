/*
 * Amazon Creators API (İçerik Üreticileri API'si) istemcisi.
 * Amazon linklerindeki ürünlerin adını, görselini, fiyatını ve stok durumunu resmi API'den çeker.
 *
 * Gerekli ortam değişkenleri (Vercel → Settings → Environment Variables):
 *   AMAZON_CREDENTIAL_ID, AMAZON_CREDENTIAL_SECRET, AMAZON_CREDENTIAL_VERSION, AMAZON_PARTNER_TAG
 */

const MARKETPLACE = "www.amazon.com.tr";
const API_URL = "https://creatorsapi.amazon/catalog/v1/getItems";

// Kimlik bilgisi sürümü hangi token adresinin kullanılacağını belirler. Türkiye 3.2 (EU) grubunda.
const TOKEN_ENDPOINTS: Record<string, string> = {
  "3.1": "https://api.amazon.com/auth/o2/token",
  "3.2": "https://api.amazon.co.uk/auth/o2/token",
  "3.3": "https://api.amazon.co.jp/auth/o2/token",
};

export type AmazonItem = {
  asin: string;
  title?: string;
  image?: string;
  price?: number;
  currency?: string;
  inStock: boolean;
  detailPageUrl?: string;
};

export type AmazonResult = {
  items: Map<string, AmazonItem>;
  fetchedAt?: Date;
  error?: string;
};

/** amazon.com.tr/.../dp/B0XXXXXXXX, /gp/product/B0XXXXXXXX veya ham ASIN → ASIN */
export function extractAsin(input: string): string | undefined {
  const trimmed = input.trim();
  if (/^[A-Z0-9]{10}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(/\/(?:dp|gp\/product|gp\/aw\/d|exec\/obidos\/asin)\/([A-Z0-9]{10})(?:[/?#]|$)/i);
  return m ? m[1].toUpperCase() : undefined;
}

export function isAmazonUrl(url: string): boolean {
  return /(^|\.)amazon\.com\.tr$|(^|\.)amzn\.(to|eu)$/i.test(safeHost(url));
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

/**
 * amzn.to / amzn.eu kısa linklerinin hangi ürüne gittiğini bulur.
 * Sadece yönlendirme başlığına bakar; Amazon sayfası indirilmez.
 */
export async function resolveShortLink(url: string): Promise<string | undefined> {
  if (!/^amzn\.(to|eu)$/i.test(safeHost(url))) return undefined;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "manual", next: { revalidate: 86400 } });
    const location = res.headers.get("location");
    return location ? extractAsin(location) : undefined;
  } catch {
    return undefined;
  }
}

function credentials() {
  const id = process.env.AMAZON_CREDENTIAL_ID?.trim();
  const secret = process.env.AMAZON_CREDENTIAL_SECRET?.trim();
  // Amazon sürümü "v3.2" ya da "3.2" olarak gösterebiliyor; ikisini de kabul et.
  const version = process.env.AMAZON_CREDENTIAL_VERSION?.trim().replace(/^v/i, "");
  const partnerTag = process.env.AMAZON_PARTNER_TAG?.trim();
  if (!id || !secret || !version || !partnerTag) return undefined;
  return { id, secret, version, partnerTag };
}

let cachedToken: { value: string; expiresAt: number } | undefined;

async function getToken(creds: NonNullable<ReturnType<typeof credentials>>): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const endpoint = TOKEN_ENDPOINTS[creds.version];
  if (!endpoint) throw new Error(`Desteklenmeyen kimlik bilgisi sürümü: ${creds.version}`);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: creds.id,
      client_secret: creds.secret,
      scope: "creatorsapi::default",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(`Amazon token alınamadı (${res.status}${json.error ? `: ${json.error}` : ""})`);
  }
  cachedToken = { value: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return json.access_token;
}

type ApiListing = {
  availability?: { type?: string };
  isBuyBoxWinner?: boolean;
  price?: { money?: { amount?: number; currency?: string } };
};

type ApiItem = {
  asin: string;
  detailPageURL?: string;
  images?: { primary?: Record<string, { url?: string } | null> | null } | null;
  itemInfo?: { title?: { displayValue?: string } | null } | null;
  offersV2?: { listings?: ApiListing[] | null } | null;
};

type ApiResponse = {
  itemsResult?: { items?: ApiItem[] };
  itemResults?: { items?: ApiItem[] };
  errors?: { code?: string; message?: string }[];
  message?: string;
  code?: string;
};

const IN_STOCK_TYPES = new Set(["IN_STOCK", "IN_STOCK_SCARCE", "LEADTIME", "PREORDER", "AVAILABLE_DATE"]);

function toItem(raw: ApiItem): AmazonItem {
  const listings = raw.offersV2?.listings ?? [];
  const listing = listings.find((l) => l.isBuyBoxWinner) ?? listings[0];
  const primary = raw.images?.primary ?? undefined;
  const image = primary?.large?.url ?? primary?.medium?.url ?? primary?.small?.url ?? undefined;
  const type = listing?.availability?.type;
  const price = listing?.price?.money?.amount;
  return {
    asin: raw.asin,
    title: raw.itemInfo?.title?.displayValue ?? undefined,
    image,
    price: typeof price === "number" && price > 0 ? price : undefined,
    currency: listing?.price?.money?.currency,
    // Teklif yoksa Amazon ürünü stokta yok sayar.
    inStock: Boolean(listing) && (type === undefined || IN_STOCK_TYPES.has(type)),
    detailPageUrl: raw.detailPageURL,
  };
}

/**
 * Verilen ASIN'lerin güncel bilgilerini getirir. Hata olursa sayfa bozulmaz:
 * boş sonuç ve hata mesajı döner, ürünler elle girilen bilgilerle gösterilir.
 */
export async function getAmazonItems(asins: string[]): Promise<AmazonResult> {
  const unique = [...new Set(asins)];
  const items = new Map<string, AmazonItem>();
  if (unique.length === 0) return { items };

  const creds = credentials();
  if (!creds) return { items, error: "Amazon kimlik bilgileri tanımlı değil" };

  try {
    const token = await getToken(creds);
    const errors: string[] = [];
    for (let i = 0; i < unique.length; i += 10) {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-marketplace": MARKETPLACE,
        },
        body: JSON.stringify({
          itemIds: unique.slice(i, i + 10),
          itemIdType: "ASIN",
          marketplace: MARKETPLACE,
          partnerTag: creds.partnerTag,
          resources: [
            "itemInfo.title",
            "images.primary.large",
            "offersV2.listings.price",
            "offersV2.listings.availability",
            "offersV2.listings.isBuyBoxWinner",
          ],
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      const json = (await res.json().catch(() => ({}))) as ApiResponse;
      if (!res.ok) {
        errors.push(`${res.status} ${json.code ?? ""} ${json.message ?? ""}`.trim());
        continue;
      }
      for (const raw of json.itemsResult?.items ?? json.itemResults?.items ?? []) {
        items.set(raw.asin, toItem(raw));
      }
      for (const e of json.errors ?? []) errors.push(`${e.code}: ${e.message}`);
    }
    return { items, fetchedAt: new Date(), error: errors.length ? errors.join(" | ") : undefined };
  } catch (e) {
    return { items, error: e instanceof Error ? e.message : String(e) };
  }
}
