import { extractAsin, getAmazonItems, resolveShortLink } from "./amazon";
import { RESERVED_SLUGS, slugify, type Store } from "./data";
import { getSheetData, type SheetOffer } from "./sheet";

/** Bir ürünün tek bir mağazadaki linki */
export type LiveOffer = {
  /** gururguner.com/git/<goId> */
  goId: string;
  store: Store;
  price?: number;
  /** undefined: bilinmiyor */
  inStock?: boolean;
  /** Fiyat mağazadan canlı mı geldi (Amazon) */
  livePrice: boolean;
  /** Bu ürün için en ucuz mağaza mı (en az iki fiyatlı mağaza varsa) */
  cheapest: boolean;
  code?: string;
  /** QR kodunda kullanılan, doğrudan mağazaya giden link */
  directUrl: string;
};

export type LiveProduct = {
  id: string;
  name: string;
  image?: string;
  note?: string;
  video?: string;
  offers: LiveOffer[];
  minPrice?: number;
  allOutOfStock: boolean;
};

export type LiveCategory = {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  products: LiveProduct[];
};

export type Catalog = {
  categories: LiveCategory[];
  totalProducts: number;
  /** Amazon fiyatlarının alındığı an (Amazon kuralı gereği sayfada gösterilir) */
  amazonUpdatedAt?: string;
  /** Veri Google Sheets'ten mi yoksa örnek veriden mi geldi */
  source: "sheet" | "sample";
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

// Stoktakiler ucuzdan pahalıya, fiyatı bilinmeyenler sonra, stokta olmayanlar en sonda.
function rank(price: number | undefined, outOfStock: boolean): number {
  return outOfStock ? 2 : price === undefined ? 1 : 0;
}

function compare(aPrice: number | undefined, aOut: boolean, bPrice: number | undefined, bOut: boolean): number {
  const r = rank(aPrice, aOut) - rank(bPrice, bOut);
  if (r !== 0) return r;
  if (aPrice !== undefined && bPrice !== undefined) return aPrice - bPrice;
  return 0;
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base || "urun";
  for (let i = 2; used.has(id); i++) id = `${base}-${i}`;
  used.add(id);
  return id;
}

export async function getCatalog(): Promise<Catalog> {
  const sheet = await getSheetData();

  // Amazon linklerinden ASIN bul (kısa linkler dahil)
  const asinOf = new Map<SheetOffer, string>();
  await Promise.all(
    sheet.offers
      .filter((o) => o.store === "amazon")
      .map(async (o) => {
        const asin = extractAsin(o.url) ?? (await resolveShortLink(o.url));
        if (asin) asinOf.set(o, asin);
      }),
  );
  const amazon = await getAmazonItems([...asinOf.values()]);
  if (amazon.error) console.warn(`[linklerim] Amazon: ${amazon.error}`);

  const productIds = new Set<string>();
  const goIds = new Set<string>();
  const categorySlugs = new Set<string>();

  const categories: LiveCategory[] = sheet.categories.map((cat) => {
    let slug = slugify(cat.slug || cat.name);
    if (RESERVED_SLUGS.has(slug)) slug = `${slug}-urunler`;
    slug = uniqueId(slug, categorySlugs);

    // Aynı "Ürün adı"na sahip satırlar tek ürün altında birleşir.
    const groups = new Map<string, SheetOffer[]>();
    for (const o of sheet.offers) {
      if (o.category.trim() !== cat.name.trim()) continue;
      const asin = asinOf.get(o);
      const key = o.name ? `ad:${o.name.trim().toLocaleLowerCase("tr-TR")}` : asin ? `asin:${asin}` : `url:${o.url}`;
      groups.set(key, [...(groups.get(key) ?? []), o]);
    }

    const products: LiveProduct[] = [...groups.values()].map((rows) => {
      const named = rows.find((r) => r.name);
      const amazonItems = rows.map((r) => asinOf.get(r)).map((a) => (a ? amazon.items.get(a) : undefined));
      const firstAsin = rows.map((r) => asinOf.get(r)).find(Boolean);
      const name = named?.name ?? amazonItems.find((a) => a?.title)?.title ?? "Ürün";
      const id = uniqueId(named?.name ? slugify(named.name) : firstAsin ? firstAsin.toLowerCase() : slugify(name), productIds);

      const offers = rows
        .map((r, i): LiveOffer & { _out: boolean } => {
          const a = amazonItems[i];
          const inStock = a ? a.inStock : r.outOfStock ? false : undefined;
          return {
            goId: uniqueId(`${id}-${r.store}`, goIds),
            store: r.store,
            price: a?.price ?? r.price,
            inStock,
            livePrice: a?.price !== undefined,
            cheapest: false,
            code: r.code,
            directUrl: r.store === "amazon" ? withAmazonTag(r.url) : r.url,
            _out: inStock === false,
          };
        })
        .sort((x, y) => compare(x.price, x._out, y.price, y._out));

      const priced = offers.filter((o) => !o._out && o.price !== undefined);
      if (priced.length >= 2) priced[0].cheapest = true;

      return {
        id,
        name,
        image: rows.find((r) => r.image)?.image ?? amazonItems.find((a) => a?.image)?.image,
        note: rows.find((r) => r.note)?.note,
        video: rows.find((r) => r.video)?.video,
        offers: offers.map(({ _out, ...o }) => o),
        minPrice: priced[0]?.price,
        allOutOfStock: offers.length > 0 && offers.every((o) => o._out),
      };
    });

    products.sort((a, b) => compare(a.minPrice, a.allOutOfStock, b.minPrice, b.allOutOfStock));

    return {
      slug,
      title: cat.name,
      emoji: cat.emoji || "🛍️",
      description: cat.description || "",
      products,
    };
  });

  return {
    categories,
    totalProducts: categories.reduce((n, c) => n + c.products.length, 0),
    amazonUpdatedAt: amazon.items.size > 0 ? amazon.fetchedAt?.toISOString() : undefined,
    source: sheet.source,
  };
}

/** /git/<goId> için: mağaza linkini bulur */
export async function findOffer(goId: string): Promise<string | undefined> {
  const catalog = await getCatalog();
  for (const c of catalog.categories) {
    for (const p of c.products) {
      const o = p.offers.find((offer) => offer.goId === goId);
      if (o) return o.directUrl;
    }
  }
  return undefined;
}
