"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveCategory as Category } from "./catalog";
import { ProductList, ShareButton } from "./ProductList";

/**
 * Kategoriler aynı sayfada açılıp kapanır.
 * `initialOpen` verilirse (ör. gururguner.com/3d) o kategori açık gelir ve ekran ona kayar.
 */
export function CategoryAccordion({
  categories,
  initialOpen,
}: {
  categories: Category[];
  initialOpen?: string;
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(initialOpen ? [initialOpen] : []));
  const initialRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    initialRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggle = (slug: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <ul className="mt-8 grid gap-3" aria-label="Ürün kategorileri">
      {categories.map((category) => {
        const isOpen = open.has(category.slug);
        const panelId = `kategori-${category.slug}`;
        return (
          <li
            key={category.slug}
            ref={category.slug === initialOpen ? initialRef : undefined}
            className={`scroll-mt-6 rounded-2xl border bg-zinc-900/80 transition ${
              isOpen ? "border-orange-500/70" : "border-zinc-800 hover:border-orange-500"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(category.slug)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-2xl" aria-hidden="true">
                {category.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{category.title}</div>
                <div className="mt-0.5 truncate text-sm text-zinc-500">{category.description}</div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs font-bold text-orange-400">{category.products.length} ürün</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 fill-none stroke-orange-400 stroke-[2.5] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="px-3 pb-3">
                  <ProductList products={category.products} />
                  <div className="mt-3 flex justify-end">
                    <ShareButton title={`${category.title} · Gurur Güner`} path={`/${category.slug}`} label="Bu kategoriyi paylaş" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
