/*
 * LİNKLERİM — ÜRÜN LİSTESİ
 * ------------------------------------------------------------------
 * Yeni ürün eklemek için ilgili kategorinin `products` listesine bir satır ekle.
 *
 *   id        → benzersiz kısa ad. Link şu olur: gururguner.com/git/<id>
 *               Videolarda bu linki paylaşabilirsin; ürün linki değişse bile
 *               sadece `url`'i güncellemen yeterli, eski paylaşımlar bozulmaz.
 *   name      → ürün adı
 *   note      → (opsiyonel) kısa açıklama: "3 yıldır kullanıyorum" gibi
 *   store     → hangi mağaza: "trendyol" | "hepsiburada" | "amazon" | "resmi" | "diger"
 *   url       → satış ortaklığı (affiliate) linkin
 *   price     → (opsiyonel) fiyat, sadece rakam: 1299 ya da 24999.90
 *               Ürünler kategorisi içinde ucuzdan pahalıya otomatik sıralanır;
 *               fiyatı girilmeyen ürünler en sona düşer. Sırayla yazman gerekmez.
 *   image     → (opsiyonel) /public/urunler/ içine koyduğun görsel, ör. "/urunler/k1c.jpg"
 *   code      → (opsiyonel) indirim kodu; sayfada kopyala butonuyla görünür
 *   reviewUrl → (opsiyonel) ürünün inceleme videosu
 *
 * Yeni kategori eklemek için `categories` listesine bir blok ekle.
 * `slug` sayfanın adresi olur: gururguner.com/<slug>
 *
 * NOT: Aşağıdaki ürünler ve fiyatlar ÖRNEKTİR. Linkler mağaza aramasına gidiyor;
 * yayına almadan önce kendi ürünlerin ve affiliate linklerinle değiştir.
 */

export type Store = "trendyol" | "hepsiburada" | "amazon" | "resmi" | "diger";

export type Product = {
  id: string;
  name: string;
  note?: string;
  store: Store;
  url: string;
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
        store: "trendyol",
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
        store: "trendyol",
        url: "https://www.trendyol.com/sr?q=dji",
        price: 12999,
      },
      {
        id: "hollyland-mikrofon",
        name: "Hollyland Kablosuz Mikrofon",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "hepsiburada",
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
      {
        id: "razer",
        name: "Razer Klavye / Mouse",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "trendyol",
        url: "https://www.trendyol.com/sr?q=razer",
        price: 3299,
      },
      {
        id: "havit",
        name: "Havit Kulaklık",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "trendyol",
        url: "https://www.trendyol.com/sr?q=havit",
        price: 899,
      },
    ],
  },
  {
    slug: "akilliev",
    title: "Akıllı Ev",
    description: "Evimde kullandığım akıllı cihazlar",
    emoji: "🏠",
    products: [
      {
        id: "keenetic-router",
        name: "Keenetic Router",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "trendyol",
        url: "https://www.trendyol.com/sr?q=keenetic",
        price: 4499,
      },
      {
        id: "ezviz-kamera",
        name: "EZVIZ Güvenlik Kamerası",
        note: "Örnek ürün — kendi linkinle değiştir",
        store: "trendyol",
        url: "https://www.trendyol.com/sr?q=ezviz",
        price: 1499,
      },
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

// Her kategorinin ürünleri ucuzdan pahalıya sıralanır; fiyatsız ürünler sonda kalır.
export const categories: Category[] = categoryList.map((c) => ({
  ...c,
  products: [...c.products].sort((a, b) => {
    if (a.price === undefined) return b.price === undefined ? 0 : 1;
    if (b.price === undefined) return -1;
    return a.price - b.price;
  }),
}));

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export const STORE_LABELS: Record<Store, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  amazon: "Amazon",
  resmi: "Resmi Site",
  diger: "Mağaza",
};

export const SITE_URL = "https://www.gururguner.com";

// Kök dizinde zaten kullanılan adresler; kategori slug'ı bunlardan biri olamaz.
const RESERVED_SLUGS = new Set(["linklerim", "nfc", "git", "api", "_next"]);

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

// Geliştirme sırasında hatalı veriyi erkenden yakala (build'i kırar, canlıya bozuk liste çıkmaz).
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
    }
  }
})();
