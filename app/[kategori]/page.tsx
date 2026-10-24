import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinklerimView } from "../_linklerim/LinklerimView";
import { categories, getCategory, SITE_URL } from "../_linklerim/data";

// Kısa kategori adresleri (gururguner.com/3d, /ekipman ...) Linklerim sayfasını o kategori açık şekilde gösterir.
// Listede olmayan bir adres 404 verir.
// Sayfa en fazla saatte bir yeniden oluşturulur; Amazon fiyat ve stokları böyle güncel kalır.
export const revalidate = 3600;

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
  if (!getCategory(kategori)) notFound();
  return <LinklerimView initialOpen={kategori} />;
}
