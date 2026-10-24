import type { Metadata } from "next";
import Link from "next/link";
import { LinklerimFooter, LinklerimHeader } from "../_linklerim/Header";
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
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f0f0f] px-5 py-10 text-white">
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-[-120px] h-80 w-80 rounded-full bg-orange-700/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-xl">
        <LinklerimHeader subtitle={`Kullandığım ve önerdiğim ürünler · ${categories.length} kategori · ${totalProducts} ürün`} />

        <nav className="mt-8 grid gap-3" aria-label="Ürün kategorileri">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 transition hover:border-orange-500 hover:bg-zinc-900"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-2xl" aria-hidden="true">
                {category.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{category.title}</div>
                <div className="mt-0.5 truncate text-sm text-zinc-500">{category.description}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs font-bold text-orange-400">{category.products.length} ürün</div>
                <div className="text-xl text-orange-400 transition group-hover:translate-x-1">→</div>
              </div>
            </Link>
          ))}
        </nav>

        <LinklerimFooter />
      </div>
    </main>
  );
}
