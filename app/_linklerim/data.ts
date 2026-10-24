/*
 * LİNKLERİM — ÜRÜN LİSTESİ
 * ------------------------------------------------------------------
 * Yeni ürün eklemek için ilgili kategorinin `products` listesine bir blok ekle.
 *
 * AMAZON ÜRÜNÜ — sadece id ve link yeterli:
 *   { id: "kettle", url: "https://www.amazon.com.tr/dp/B0DP3JZW88" },
 *   Ad, görsel, fiyat ve stok Amazon'dan otomatik gelir ve saatlik güncellenir.
 *   amzn.to kısa linkleri de olur. Linke etiket (tag) eklemene gerek yok; otomatik eklenir.
 *
 * TRENDYOL / HEPSİBURADA / DİĞER — ad ve fiyatı elle yaz:
 *   { id: "k1c", name: "Creality K1C", url: "https://ty.gl/...", price: 18999 },
 *
 * Alanlar:
 *   id        → benzersiz kısa ad. Link şu olur: gururguner.com/git/<id>
 *               Videolarda bu linki paylaşabilirsin; ürün linki değişse bile
 *               sadece `url`'i güncellemen yeterli, eski paylaşımlar bozulmaz.
 *   url       → satış ortaklığı (affiliate) linkin. Mağaza linkten otomatik anlaşılır.
 *   name      → ürün adı (Amazon'da opsiyonel; yazarsan Amazon'un uzun adı yerine bu görünür)
 *   price     → fiyat, sadece rakam: 1299 ya da 24999.90 (Amazon'da otomatik)
 *               Ürünler kategori içinde ucuzdan pahalıya otomatik sıralanır.
 *   note      → (opsiyonel) kısa açıklama: "3 yıldır kullanıyorum" gibi
 *   image     → (opsiyonel) /public/urunler/ içine koyduğun görsel, ör. "/urunler/k1c.jpg"
 *   code      → (opsiyonel) indirim kodu; sayfada kopyala butonuyla görünür
 *   reviewUrl → (opsiyonel) ürünün inceleme videosu
 *   store     → (opsiyonel) mağazayı elle belirtmek için: "trendyol" | "hepsiburada" | "amazon" | "resmi" | "diger"
 *
 * Yeni kategori eklemek için `categoryList` listesine bir blok ekle.
 * `slug` sayfanın adresi olur: gururguner.com/<slug>
 *
 * NOT: Trendyol/Hepsiburada ürünleri ve fiyatları ÖRNEKTİR; kendi linklerinle değiştir.
 * Amazon ürünleri Amazon vitrinindeki listenden alındı.
 */

export type Store = "trendyol" | "hepsiburada" | "amazon" | "resmi" | "diger";

export type Product = {
  id: string;
  url: string;
  name?: string;
  note?: string;
  store?: Store;
  price?: number;
  image?: string;
  code?: string;
  reviewUrl?: string;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  products: Product[];
};

const categoryList: Category[] = [
  {
    slug: "3d",
    title: "3D Baskı",
    description: "Yazıcılar, filamentler ve atölyemdeki yardımcılar",
    emoji: "🧱",
    products: [
      {
        id: "creality-yazici",
        name: "Creality 3D Yazıcı",
        note: "Örnek ürün — kendi linkinle değiştir",
        url: "https://www.trendyol.com/sr?q=creality%203d%20yazici",
        price: 18999,
      },
      {
        id: "snapmaker",
        name: "Snapmaker",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "resmi",
        url: "https://www.snapmaker.com",
        price: 54999,
      },
      {
        id: "porima-filament",
        name: "Porima3D Filament",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "resmi",
        url: "https://www.porima3d.com",
        price: 649,
      },
    ],
  },
  {
    slug: "ekipman",
    title: "Çekim Ekipmanım",
    description: "Videolarımı çektiğim kamera, mikrofon ve ışıklar",
    emoji: "🎥",
    products: [
      {
        id: "dji",
        name: "DJI Kamera / Gimbal",
        note: "Örnek ürün — kendi linkinle değiştir",
        url: "https://www.trendyol.com/sr?q=dji",
        price: 12999,
      },
      {
        id: "hollyland-mikrofon",
        name: "Hollyland Kablosuz Mikrofon",
        note: "Örnek ürün — kendi linkinle değiştir",
        url: "https://www.hepsiburada.com/ara?q=hollyland",
        price: 7499,
      },
    ],
  },
  {
    slug: "masa",
    title: "Masa Düzenim",
    description: "Çalıştığım ve kurguladığım masadaki her şey",
    emoji: "🖥️",
    products: [
      { id: "anker-45w", name: "Anker Nano 45W USB-C Şarj Cihazı", url: "https://www.amazon.com.tr/dp/B0GQLKGD1F" },
      { id: "wd-8tb", name: "WD Elements 8 TB Harici Disk", url: "https://www.amazon.com.tr/dp/B07FNK6QMT" },
      { id: "xenon-tornavida", name: "Xenon Smart Şarjlı Hassas Tornavida Seti", url: "https://www.amazon.com.tr/dp/B0F4RNYBBN" },
    ],
  },
  {
    slug: "akilliev",
    title: "Akıllı Ev",
    description: "Evimde kullandığım akıllı cihazlar",
    emoji: "🏠",
    products: [
      { id: "ezviz-diafon", name: "EZVIZ CS-DP2 Kablosuz Görüntülü Diafon", url: "https://www.amazon.com.tr/dp/B0F3X4JF3B" },
      { id: "xiaomi-kettle", name: "Xiaomi Smart Kettle 2 Pro", url: "https://www.amazon.com.tr/dp/B0DP3JZW88" },
      { id: "philips-hava-temizleyici", name: "Philips 3400 Hava Temizleyici ve Nemlendirici", url: "https://www.amazon.com.tr/dp/B0D9YNY3DN" },
    ],
  },
  {
    slug: "yapayzeka",
    title: "Yapay Zeka Araçları",
    description: "Videolarımda kullandığım yapay zeka uygulamaları",
    emoji: "✨",
    products: [
      {
        id: "hailuo",
        name: "Hailuo AI",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "resmi",
        url: "https://hailuoai.video",
      },
      {
        id: "emergent",
        name: "Emergent",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "resmi",
        url: "https://emergent.sh",
      },
    ],
  },
];

export const STORE_LABELS: Record<Store, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  amazon: "Amazon",
  resmi: "Resmi Site",
  diger: "Mağaza",
};

/** Linkten mağazayı tahmin eder; `store` yazılmışsa o kullanılır. */
export function storeOf(product: Product): Store {
  if (product.store) return product.store;
  let host = "";
  try {
    host = new URL(product.url).hostname.toLowerCase();
  } catch {
    return "diger";
  }
  if (/(^|\.)trendyol\.com$|(^|\.)ty\.gl$/.test(host)) return "trendyol";
  if (/(^|\.)hepsiburada\.com$|(^|\.)hb\.biz$/.test(host)) return "hepsiburada";
  if (/(^|\.)amazon\.com\.tr$|(^|\.)amzn\.(to|eu)$/.test(host)) return "amazon";
  return "diger";
}

/** Ürün adı yazılmamışsa (Amazon'dan gelmesi beklenen ürünler) geçici ad */
export function fallbackName(product: Product): string {
  return product.name ?? `${STORE_LABELS[storeOf(product)]} ürünü`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export const SITE_URL = "https://www.gururguner.com";

// Kök dizinde zaten kullanılan adresler; kategori slug'ı bunlardan biri olamaz.
const RESERVED_SLUGS = new Set(["linklerim", "nfc", "git", "api", "_next"]);

/** Statik liste (adresler, yönlendirmeler ve sayfa başlıkları için). Canlı fiyatlar için bkz. catalog.ts */
export const categories: Category[] = categoryList;

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(id: string): Product | undefined {
  for (const c of categories) {
    const p = c.products.find((product) => product.id === id);
    if (p) return p;
  }
  return undefined;
}

export const totalProducts = categories.reduce((sum, c) => sum + c.products.length, 0);

// Hatalı veriyi derleme sırasında yakala (build başarısız olur, canlı site bozulmaz).
(function validate() {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  for (const c of categories) {
    if (RESERVED_SLUGS.has(c.slug)) throw new Error(`Kategori adresi ayrılmış bir ad: "${c.slug}"`);
    if (slugs.has(c.slug)) throw new Error(`Aynı kategori adresi iki kez kullanılmış: "${c.slug}"`);
    slugs.add(c.slug);
    for (const p of c.products) {
      if (ids.has(p.id)) throw new Error(`Aynı ürün id'si iki kez kullanılmış: "${p.id}"`);
      ids.add(p.id);
      try {
        new URL(p.url);
      } catch {
        throw new Error(`"${p.id}" ürününün linki geçersiz: ${p.url}`);
      }
      if (!p.name && storeOf(p) !== "amazon") {
        throw new Error(`"${p.id}" ürününün adı (name) eksik. Ad sadece Amazon ürünlerinde otomatik gelir.`);
      }
    }
  }
})();
