import type { SheetCategory, SheetOffer } from "./sheet";

/**
 * GOOGLE_SHEET_URL tanımlanana kadar kullanılan örnek veri (Google Sheets şablonuyla aynı içerik).
 * Ürünleri buradan değil, Google Sheets'ten yönet.
 */
export const SAMPLE_SHEET: { categories: SheetCategory[]; offers: SheetOffer[] } = {
  categories: [
    { name: "3D", slug: "3d", emoji: "🧱", description: "3D yazıcılar, filamentler ve atölyemdeki yardımcılar" },
    { name: "Yapay Zeka", slug: "yapayzeka", emoji: "✨", description: "Videolarımda kullandığım yapay zeka araçları" },
    { name: "Evde Kullandığım Ürünler", slug: "evde", emoji: "🏠", description: "Günlük hayatta kullandıklarım" },
    { name: "Akıllı Ev Ürünlerim", slug: "akilliev", emoji: "💡", description: "Evimdeki akıllı cihazlar" },
    { name: "Önerdiğim Ürünler", slug: "oneriler", emoji: "⭐", description: "Gönül rahatlığıyla önerdiklerim" },
  ],
  offers: [
    { store: "amazon", url: "https://www.amazon.com.tr/dp/B0DP3JZW88", category: "Akıllı Ev Ürünlerim", name: "Xiaomi Smart Kettle 2 Pro" },
    { store: "amazon", url: "https://www.amazon.com.tr/dp/B0F3X4JF3B", category: "Akıllı Ev Ürünlerim", name: "EZVIZ CS-DP2 Kablosuz Görüntülü Diafon" },
    { store: "amazon", url: "https://www.amazon.com.tr/dp/B0D9YNY3DN", category: "Evde Kullandığım Ürünler", name: "Philips 3400 Hava Temizleyici ve Nemlendirici" },
    { store: "amazon", url: "https://www.amazon.com.tr/dp/B0F4RNYBBN", category: "Evde Kullandığım Ürünler", name: "Xenon Smart Şarjlı Hassas Tornavida Seti" },
    { store: "amazon", url: "https://www.amazon.com.tr/dp/B0GQLKGD1F", category: "Önerdiğim Ürünler", name: "Anker Nano 45W USB-C Şarj Cihazı" },
    { store: "amazon", url: "https://www.amazon.com.tr/dp/B07FNK6QMT", category: "Önerdiğim Ürünler", name: "WD Elements 8 TB Harici Disk" },
  ],
};
