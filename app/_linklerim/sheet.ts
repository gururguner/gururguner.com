/*
 * Ürün listesini Google Sheets'ten okur.
 *
 * Kurulum: Google Sheets'te Paylaş → "Bağlantıya sahip olan herkes" → Görüntüleyen,
 * sonra tablonun adresini Vercel'de GOOGLE_SHEET_URL ortam değişkenine yaz.
 * Sekme adları: Amazon, Trendyol, Hepsiburada, Kategoriler (başlık satırları değiştirilmemeli).
 * GOOGLE_SHEET_URL tanımlı değilse örnek veri (sample.ts) kullanılır.
 */

import type { Store } from "./data";
import { SAMPLE_SHEET } from "./sample";

export type SheetCategory = { name: string; slug?: string; emoji?: string; description?: string };

export type SheetOffer = {
  store: Store;
  url: string;
  category: string;
  name?: string;
  price?: number;
  outOfStock?: boolean;
  image?: string;
  code?: string;
  note?: string;
  video?: string;
};

export type SheetData = { categories: SheetCategory[]; offers: SheetOffer[]; source: "sheet" | "sample" };

/** Sayfaların ve verinin en fazla kaç saniyede bir yenileneceği */
export const SHEET_REVALIDATE = 300;

const STORE_TABS: { tab: string; store: Store }[] = [
  { tab: "Amazon", store: "amazon" },
  { tab: "Trendyol", store: "trendyol" },
  { tab: "Hepsiburada", store: "hepsiburada" },
];

/** "1.299,90", "1299.90", "18.999,00 TL", "₺18.999" → sayı */
export function parsePrice(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  let s = raw.replace(/[^\d.,]/g, "");
  if (!s) return undefined;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
  else if (lastDot > -1 && lastComma > -1) s = s.replace(/,/g, "");
  else if (lastDot > -1 && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** RFC 4180 CSV ayrıştırıcı (tırnaklı alanlar, satır içi virgül ve satır sonları) */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const norm = (s: string) => s.trim().toLocaleLowerCase("tr-TR");

/** Başlık satırına göre satırları {başlık: değer} nesnelerine çevirir; boş satırları atlar. */
function toRecords(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return [];
  const headers = rows[0].map(norm);
  return rows
    .slice(1)
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()])))
    .filter((rec) => Object.values(rec).some((v) => v !== ""));
}

function sheetId(url: string): string | undefined {
  return url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/)?.[1] ?? (/^[a-zA-Z0-9_-]{20,}$/.test(url) ? url : undefined);
}

async function fetchTab(id: string, tab: string): Promise<Record<string, string>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { next: { revalidate: SHEET_REVALIDATE }, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`"${tab}" sekmesi okunamadı (${res.status}). Tablo "bağlantıya sahip herkes" ile paylaşıldı mı?`);
  const text = await res.text();
  if (text.trimStart().startsWith("<")) throw new Error(`"${tab}" sekmesi okunamadı; tablo herkese açık paylaşılmamış olabilir.`);
  return toRecords(parseCsv(text));
}

export function recordsToData(
  categories: Record<string, string>[],
  tabs: { store: Store; records: Record<string, string>[] }[],
): Omit<SheetData, "source"> {
  const cats: SheetCategory[] = categories
    .filter((r) => r["kategori"])
    .map((r) => ({
      name: r["kategori"],
      slug: r["kısa adres"] || undefined,
      emoji: r["emoji"] || undefined,
      description: r["açıklama"] || undefined,
    }));
  const offers: SheetOffer[] = [];
  for (const { store, records } of tabs) {
    for (const r of records) {
      if (!r["link"] || !r["kategori"]) continue;
      offers.push({
        store,
        url: r["link"],
        category: r["kategori"],
        name: r["ürün adı"] || undefined,
        price: parsePrice(r["fiyat"]),
        outOfStock: norm(r["stok"] ?? "") === "yok",
        image: r["görsel linki"] || undefined,
        code: r["indirim kodu"] || undefined,
        note: r["not"] || undefined,
        video: r["video"] || undefined,
      });
    }
  }
  return { categories: cats, offers };
}

export async function getSheetData(): Promise<SheetData> {
  const raw = process.env.GOOGLE_SHEET_URL?.trim();
  const id = raw ? sheetId(raw) : undefined;
  if (!id) return { ...SAMPLE_SHEET, source: "sample" };
  // Hata olursa fırlatılır: Next.js bu durumda sayfanın son sağlam halini göstermeye devam eder.
  const [categories, ...storeTabs] = await Promise.all([
    fetchTab(id, "Kategoriler"),
    ...STORE_TABS.map((t) => fetchTab(id, t.tab)),
  ]);
  const data = recordsToData(
    categories,
    STORE_TABS.map((t, i) => ({ store: t.store, records: storeTabs[i] })),
  );
  return { ...data, source: "sheet" };
}
