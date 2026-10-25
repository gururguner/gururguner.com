/*
 * Ortak tipler ve yardımcılar.
 * Ürünler artık Google Sheets'ten yönetiliyor (bkz. sheet.ts). Bu dosyayı düzenlemene gerek yok.
 */

export type Store = "amazon" | "trendyol" | "hepsiburada";

export const STORE_LABELS: Record<Store, string> = {
  amazon: "Amazon",
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
};

export const STORE_COLORS: Record<Store, string> = {
  amazon: "#ff9900",
  trendyol: "#f27a1a",
  hepsiburada: "#ff6000",
};

export const STORE_DOMAINS: Record<Store, string> = {
  amazon: "amazon.com.tr",
  trendyol: "trendyol.com",
  hepsiburada: "hepsiburada.com",
};

export const SITE_URL = "https://www.gururguner.com";

// Kök dizinde zaten kullanılan adresler; kategori kısa adresi bunlardan biri olamaz.
export const RESERVED_SLUGS = new Set(["linklerim", "nfc", "git", "api", "_next"]);

const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };

/** "Akıllı Ev Ürünlerim" → "akilli-ev-urunlerim" */
export function slugify(text: string): string {
  return text
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
