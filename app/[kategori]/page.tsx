import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinklerimFooter, LinklerimHeader } from "../_linklerim/Header";
import { ProductList, ShareButton } from "../_linklerim/ProductList";
import { categories, getCategory, SITE_URL } from "../_linklerim/data";

// Kategoriler kısa adreslerden açılır: gururguner.com/3d, /ekipman ...
// Listede olmayan bir adres 404 verir.
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ kategori: c.slug }));
}

type Props = { params: Promise<{ kategori: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;
  const category = getCategory(kategori);
  if (!category) return {};
  const title = `${category.title} · Gurur Güner`;
  const description = `${category.description} · ${category.products.length} ürün`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${category.slug}`,
      images: ["/gurur.png"],
      type: "website",
    },
  };
}

export default async function KategoriPage({ params }: Props) {
  const { kategori } = await params;
  const category = getCategory(kategori);
  if (!category) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f0f0f] px-5 py-10 text-white">
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mx-auto max-w-xl">
          <LinklerimHeader subtitle="Kullandığım ve önerdiğim ürünler" />
        </div>

        <div className="mt-10">
          <Link href="/linklerim" className="text-sm font-medium text-zinc-400 transition hover:text-orange-400">
            ← Tüm kategoriler
          </Link>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                <span aria-hidden="true">{category.emoji} </span>
                {category.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {category.description} · {category.products.length} ürün
              </p>
            </div>
            <ShareButton title={`${category.title} · Gurur Güner`} path={`/${category.slug}`} />
          </div>

          <ProductList products={category.products} />
        </div>

        <LinklerimFooter />
      </div>
    </main>
  );
}
