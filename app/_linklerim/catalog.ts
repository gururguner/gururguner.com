import { extractAsin, getAmazonItems, resolveShortLink } from "./amazon";
import { categories, fallbackName, storeOf, type Category, type Product, type Store } from "./data";

/** Sayfada gösterilen, canlı verilerle birleştirilmiş ürün */
export type LiveProduct = {
  id: string;
  name: string;
  note?: string;
  store: Store;
  price?: number;
  image?: string;
  code?: string;
  reviewUrl?: string;
  /** undefined: bilinmiyor (elle girilen ürün) */
  inStock?: boolean;
  /** Fiyat Amazon'dan canlı mı geldi */
  livePrice: boolean;
  /** QR kodunda kullanılacak, doğrudan mağazaya giden link */
  directUrl: string;
};

export type LiveCategory = Omit<Category, "products"> & { products: LiveProduct[] };

export type Catalog = {
  categories: LiveCategory[];
  totalProducts: number;
  /** Amazon fiyatlarının alındığı an (Amazon kuralı gereği sayfada gösterilir) */
  amazonUpdatedAt?: string;
};

/** Amazon linkine satış ortaklığı etiketini ekler (yoksa). */
export function withAmazonTag(url: string): string {
  const tag = process.env.AMAZON_PARTNER_TAG?.trim();
  if (!tag) return url;
  try {
    const u = new URL(url);
    if (!/(^|\.)amazon\.com\.tr$/i.test(u.hostname) || u.searchParams.has("tag")) return url;
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

async function asinOf(product: Product): Promise<string | undefined> {
  if (storeOf(product) !== "amazon") return undefined;
  return extractAsin(product.url) ?? (await resolveShortLink(product.url));
}

// Stoktakiler ucuzdan pahalıya, fiyatı bilinmeyenler sonra, stokta olmayanlar en sonda.
function compareProducts(a: LiveProduct, b: LiveProduct): number {
  const rank = (p: LiveProduct) => (p.inStock === false ? 2 : p.price === undefined ? 1 : 0);
  const r = rank(a) - rank(b);
  if (r !== 0) return r;
  if (a.price !== undefined && b.price !== undefined) return a.price - b.price;
  return 0;
}

export async function getCatalog(): Promise<Catalog> {
  const all = categories.flatMap((c) => c.products);
  const asinById = new Map<string, string>();
  await Promise.all(
    all.map(async (p) => {
      const asin = await asinOf(p);
      if (asin) asinById.set(p.id, asin);
    }),
  );

  const amazon = await getAmazonItems([...asinById.values()]);
  if (amazon.error) console.warn(`[linklerim] Amazon: ${amazon.error}`);

  const live = (p: Product): LiveProduct => {
    const asin = asinById.get(p.id);
    const a = asin ? amazon.items.get(asin) : undefined;
    const store = storeOf(p);
    return {
      id: p.id,
      name: p.name ?? a?.title ?? fallbackName(p),
      note: p.note,
      store,
      price: a?.price ?? p.price,
      image: p.image ?? a?.image,
      code: p.code,
      reviewUrl: p.reviewUrl,
      inStock: a ? a.inStock : undefined,
      livePrice: a?.price !== undefined,
      directUrl: store === "amazon" ? withAmazonTag(p.url) : p.url,
    };
  };

  const liveCategories = categories.map((c) => ({
    ...c,
    products: c.products.map(live).sort(compareProducts),
  }));

  return {
    categories: liveCategories,
    totalProducts: all.length,
    amazonUpdatedAt: amazon.items.size > 0 ? amazon.fetchedAt?.toISOString() : undefined,
  };
}
