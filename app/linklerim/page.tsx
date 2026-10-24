import type { Metadata } from "next";
import { LinklerimView } from "../_linklerim/LinklerimView";
import { categories, SITE_URL, totalProducts } from "../_linklerim/data";

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
