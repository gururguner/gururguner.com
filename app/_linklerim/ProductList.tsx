"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { LiveProduct as Product } from "./catalog";
import { formatPrice, STORE_LABELS, type Store } from "./data";
import { encodeQr, qrToSvgPath } from "./qr";

const STORE_STYLES: Record<Store, string> = {
  trendyol: "bg-[#f27a1a]/15 text-[#ff9a4d] border-[#f27a1a]/30",
  hepsiburada: "bg-[#ff6000]/15 text-[#ff8a40] border-[#ff6000]/30",
  amazon: "bg-[#ff9900]/15 text-[#ffb547] border-[#ff9900]/30",
  resmi: "bg-zinc-800 text-zinc-300 border-zinc-700",
  diger: "bg-zinc-800 text-zinc-300 border-zinc-700",
};

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("İndirim kodu:", code);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-dashed border-orange-500/60 px-4 py-2 text-sm font-bold text-orange-300 transition hover:bg-orange-500/10"
    >
      {copied ? "Kopyalandı ✓" : <>Kod: <span className="font-mono">{code}</span></>}
    </button>
  );
}

function QrModal({ product, onClose }: { product: Product; onClose: () => void }) {
  // QR doğrudan mağaza linkini taşır; telefonda taranınca ürün mağazanın uygulamasında açılır.
  const qr = useMemo(() => qrToSvgPath(encodeQr(product.directUrl)), [product.directUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} QR kodu`}
    >
      <div
        className="w-full max-w-xs rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold">{product.name}</div>
        <div className="mx-auto mt-4 w-56 rounded-2xl bg-white p-2">
          <svg viewBox={`0 0 ${qr.size} ${qr.size}`} className="h-auto w-full" shapeRendering="crispEdges">
            <path d={qr.path} fill="#000" />
          </svg>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          Telefonunun kamerasıyla ya da <strong className="text-zinc-200">Circle to Search</strong> ile tara —
          ürün mağazanın uygulamasında açılır.
        </p>
        <div className="mt-5 grid gap-2">
          <a
            {...productLinkProps(product)}
            className="rounded-full bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400"
          >
            Ürüne Git ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-5 py-3 font-bold text-zinc-300 transition hover:border-zinc-500"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductThumb({ product }: { product: Product }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.name}
        width={64}
        height={64}
        // Amazon görselleri zaten küçük ve optimize; Vercel görsel kotasını harcamayalım.
        unoptimized={product.image.startsWith("http")}
        className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain p-1"
      />
    );
  }
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-800/30 text-2xl font-bold text-orange-200">
      {product.name.charAt(0)}
    </div>
  );
}

// Ürün linkleri her zaman yeni sekmede açılır.
const productLinkProps = (product: Product) => ({
  href: `/git/${product.id}`,
  target: "_blank",
  rel: "noopener noreferrer nofollow sponsored",
});

export function ProductList({ products }: { products: Product[] }) {
  const [qrProduct, setQrProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return <p className="py-4 text-center text-sm text-zinc-500">Bu kategoriye yakında ürün eklenecek.</p>;
  }

  return (
    <>
      <ul className="grid gap-3">
        {products.map((product) => (
          <li
            key={product.id}
            className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-3 transition hover:border-orange-500/60 ${
              product.inStock === false ? "opacity-60" : ""
            }`}
          >
            <a {...productLinkProps(product)} className="flex items-center gap-3">
              <ProductThumb product={product} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${STORE_STYLES[product.store]}`}>
                    {STORE_LABELS[product.store]}
                  </span>
                  {product.inStock === false && (
                    <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] font-bold text-zinc-400">
                      Stokta yok
                    </span>
                  )}
                </div>
                <h3 className="mt-1 line-clamp-2 font-bold leading-snug">{product.name}</h3>
                {product.price !== undefined && product.inStock !== false && (
                  <p
                    className="mt-0.5 text-sm font-bold text-orange-400"
                    title={product.livePrice ? "Mağazadan alınan son fiyat" : "Yaklaşık fiyat; güncel fiyat mağazada"}
                  >
                    {product.livePrice ? "" : "~"}
                    {formatPrice(product.price)}
                  </p>
                )}
                {product.note && <p className="mt-0.5 text-sm leading-5 text-zinc-400">{product.note}</p>}
              </div>
            </a>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                {...productLinkProps(product)}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-black transition hover:bg-orange-400"
              >
                Ürüne Git ↗
              </a>
              {product.code && <CopyCodeButton code={product.code} />}
              {product.reviewUrl && (
                <a
                  href={product.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-orange-400 hover:text-orange-400"
                >
                  ▶ İncelemeyi İzle
                </a>
              )}
              <button
                type="button"
                onClick={() => setQrProduct(product)}
                className="hidden rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-orange-400 hover:text-orange-400 md:inline-flex"
                title="Telefonda aç"
              >
                QR ile telefonda aç
              </button>
            </div>
          </li>
        ))}
      </ul>

      {qrProduct && <QrModal product={qrProduct} onClose={() => setQrProduct(null)} />}
    </>
  );
}

export function ShareButton({ title, path, label = "Paylaş" }: { title: string; path: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // kullanıcı paylaşımı iptal etti; kopyalamaya düşme
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Link:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-zinc-400 transition hover:text-orange-400"
    >
      {copied ? "Link kopyalandı ✓" : `↗ ${label}`}
    </button>
  );
}
