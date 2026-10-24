import type { Metadata } from "next";
import { LinklerimView } from "../_linklerim/LinklerimView";
import { categories, SITE_URL, totalProducts } from "../_linklerim/data";

// Sayfa en fazla saatte bir yeniden oluşturulur; Amazon fiyat ve stokları böyle güncel kalır.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Linklerim · Gurur Güner",
  description: `Kullandığım ve önerdiğim ürünler · ${categories.length} kategori · ${totalProducts} ürün`,
  openGraph: {
    title: "Linklerim · Gurur Güner",
    description: `Kullandığım ve önerdiğim ürünler · ${categories.length} kategori · ${totalProducts} ürün`,
    url: "/linklerim",
    images: ["/gurur.png"],
    type: "website",
  },
};

export default function LinklerimPage() {
  return <LinklerimView />;
}
