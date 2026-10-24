import { getCatalog } from "./catalog";
import { CategoryAccordion } from "./CategoryAccordion";
import { LinklerimFooter, LinklerimHeader } from "./Header";

function formatStamp(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(iso));
}

/** /linklerim ve kısa kategori adresleri (/3d, /ekipman...) aynı sayfayı gösterir. */
export async function LinklerimView({ initialOpen }: { initialOpen?: string }) {
  const catalog = await getCatalog();
  // Boş kategoriler listede görünmez (kısa adresiyle açılan kategori hariç).
  const visible = catalog.categories.filter((c) => c.products.length > 0 || c.slug === initialOpen);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f0f0f] px-5 py-10 text-white">
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-[-120px] h-80 w-80 rounded-full bg-orange-700/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-xl">
        <LinklerimHeader
          subtitle={`Kullandığım ve önerdiğim ürünler · ${visible.length} kategori · ${catalog.totalProducts} ürün`}
        />
        <CategoryAccordion categories={visible} initialOpen={initialOpen} />
        {catalog.amazonUpdatedAt && (
          <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
            Amazon fiyatları ve stok durumu {formatStamp(catalog.amazonUpdatedAt)} itibarıyla alındı; güncel fiyat
            ürün sayfasındadır.
          </p>
        )}
        <LinklerimFooter />
      </div>
    </main>
  );
}
