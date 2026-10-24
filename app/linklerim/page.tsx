import type { Metadata } from "next";
import { LinklerimView } from "../_linklerim/LinklerimView";
import { SITE_URL } from "../_linklerim/data";

// Sayfa en fazla 5 dakikada bir yeniden oluşturulur: Google Sheets'teki değişiklikler böyle yansır.
export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Linklerim · Gurur Güner",
  description: "Kullandığım ve önerdiğim ürünler",
  openGraph: {
    title: "Linklerim · Gurur Güner",
    description: "Kullandığım ve önerdiğim ürünler",
    url: "/linklerim",
    images: ["/gurur.png"],
    type: "website",
  },
};

export default function LinklerimPage() {
  return <LinklerimView />;
}
