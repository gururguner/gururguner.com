import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "../_linklerim/catalog";
import { SITE_URL } from "../_linklerim/data";
import { LinklerimView } from "../_linklerim/LinklerimView";

// Kısa kategori adresleri (gururguner.com/3d, /akilliev ...) Linklerim sayfasını o kategori açık şekilde gösterir.
// Kategoriler Google Sheets'ten geldiği için sonradan eklenen kategoriler de ilk ziyarette oluşturulur.
export const revalidate = 300;

export async function generateStaticParams() {
  const { categories } = await getCatalog();
  return categories.map((c) => ({ kategori: c.slug }));
}

type Props = { params: Promise<{ kategori: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;
  const category = (await getCatalog()).categories.find((c) => c.slug === kategori);
  if (!category) return {};
  const title = `${category.title} · Gurur Güner`;
  const description = [category.description, `${category.products.length} ürün`].filter(Boolean).join(" · ");
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: { title, description, url: `/${category.slug}`, images: ["/gurur.png"], type: "website" },
  };
}

export default async function KategoriPage({ params }: Props) {
  const { kategori } = await params;
  const { categories } = await getCatalog();
  if (!categories.some((c) => c.slug === kategori)) notFound();
  return <LinklerimView initialOpen={kategori} />;
}
