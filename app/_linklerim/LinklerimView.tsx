import { CategoryAccordion } from "./CategoryAccordion";
import { categories, totalProducts } from "./data";
import { LinklerimFooter, LinklerimHeader } from "./Header";

/** /linklerim ve kısa kategori adresleri (/3d, /ekipman...) aynı sayfayı gösterir. */
export function LinklerimView({ initialOpen }: { initialOpen?: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f0f0f] px-5 py-10 text-white">
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-[-120px] h-80 w-80 rounded-full bg-orange-700/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-xl">
        <LinklerimHeader
          subtitle={`Kullandığım ve önerdiğim ürünler · ${categories.length} kategori · ${totalProducts} ürün`}
        />
        <CategoryAccordion categories={categories} initialOpen={initialOpen} />
        <LinklerimFooter />
      </div>
    </main>
  );
}
