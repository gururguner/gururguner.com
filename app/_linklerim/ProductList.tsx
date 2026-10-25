"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { LiveOffer, LiveProduct } from "./catalog";
import { formatPrice, STORE_COLORS, STORE_DOMAINS, STORE_LABELS } from "./data";
import { encodeQr, qrToSvgPath } from "./qr";

// Mağaza linkleri her zaman yeni sekmede açılır.
const offerLinkProps = (offer: LiveOffer) => ({
  href: `/git/${offer.goId}`,
  target: "_blank",
  rel: "noopener noreferrer nofollow sponsored",
});

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
      className="rounded-full border border-dashed border-orange-500/60 px-3 py-1 text-xs font-bold text-orange-300 transition hover:bg-orange-500/10"
    >
      {copied ? "Kopyalandı ✓" : <>Kod: <span className="font-mono">{code}</span></>}
    </button>
  );
}

function QrModal({ product, offer, onClose }: { product: LiveProduct; offer: LiveOffer; onClose: () => void }) {
  // QR doğrudan mağaza linkini taşır; telefonda taranınca ürün mağazanın uygulamasında açılır.
  const qr = useMemo(() => qrToSvgPath(encodeQr(offer.directUrl)), [offer.directUrl]);

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
      aria-label={`${product.name} — ${STORE_LABELS[offer.store]} QR kodu`}
    >
      <div
        className="w-full max-w-xs rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs font-bold" style={{ color: STORE_COLORS[offer.store] }}>
          {STORE_LABELS[offer.store]}
        </div>
        <div className="mt-1 line-clamp-2 font-bold">{product.name}</div>
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
            {...offerLinkProps(offer)}
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

function ProductThumb({ product }: { product: LiveProduct }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt=""
        width={56}
        height={56}
        // Mağaza görselleri zaten küçük; Vercel görsel kotasını harcamayalım.
        unoptimized={product.image.startsWith("http")}
        className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain p-1"
      />
    );
  }
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-800/30 text-xl font-bold text-orange-200">
      {product.name.charAt(0)}
    </div>
  );
}

function OfferRow({ product, offer, onQr }: { product: LiveProduct; offer: LiveOffer; onQr: () => void }) {
  const color = STORE_COLORS[offer.store];
  const out = offer.inStock === false;
  return (
    <div
      className={`rounded-xl border border-l-4 border-zinc-800 bg-zinc-900/70 ${out ? "opacity-55" : ""}`}
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center gap-3 p-2.5">
        <a {...offerLinkProps(offer)} className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-black"
            style={{ background: color }}
            aria-hidden="true"
          >
            {STORE_LABELS[offer.store].charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-1.5 font-bold">
              {STORE_LABELS[offer.store]}
              {offer.cheapest && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  en ucuz
                </span>
              )}
              {out && (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">stokta yok</span>
              )}
            </span>
            <span className="block truncate text-xs text-zinc-500">🔒 {STORE_DOMAINS[offer.store]}</span>
          </span>
        </a>

        {offer.price !== undefined && !out && (
          <span
            className="shrink-0 text-sm font-bold text-zinc-100"
            title={offer.livePrice ? "Mağazadan alınan son fiyat" : "Yaklaşık fiyat; güncel fiyat mağazada"}
          >
            {offer.livePrice ? "" : "~"}
            {formatPrice(offer.price)}
          </span>
        )}

        <button
          type="button"
          onClick={onQr}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-black transition hover:opacity-80 md:flex"
          style={{ background: color }}
          aria-label={`${STORE_LABELS[offer.store]} QR kodu`}
          title="Telefonda aç"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M1 1h7v7H1V1zm2 2v3h3V3H3zM12 1h7v7h-7V1zm2 2v3h3V3h-3zM1 12h7v7H1v-7zm2 2v3h3v-3H3zm8-3h3v2h-3v-2zm5 0h3v2h-3v-2zm-5 3h2v5h-2v-5zm3 0h2v2h-2v-2zm3 0h3v2h-3v-2zm-1 3h4v2h-4v-2z" />
          </svg>
        </button>

        <a
          {...offerLinkProps(offer)}
          className="shrink-0 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-orange-400"
          aria-label={`${product.name} — ${STORE_LABELS[offer.store]} sayfasını aç`}
        >
          Git ↗
        </a>
      </div>
      {offer.code && (
        <div className="px-2.5 pb-2.5">
          <CopyCodeButton code={offer.code} />
        </div>
      )}
    </div>
  );
}

function ProductItem({ product, onQr }: { product: LiveProduct; onQr: (offer: LiveOffer) => void }) {
  const [open, setOpen] = useState(false);
  const panelId = `urun-${product.id}`;
  const storeCount = product.offers.length;

  return (
    <li className={`rounded-2xl border bg-zinc-950 transition ${open ? "border-orange-500/50" : "border-zinc-800"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full items-center gap-3 p-3 text-left ${product.allOutOfStock ? "opacity-60" : ""}`}
      >
        <ProductThumb product={product} />
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 font-bold leading-snug">{product.name}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
            <span>{storeCount} mağaza</span>
            <span className="flex gap-1" aria-hidden="true">
              {product.offers.map((o) => (
                <i key={o.goId} className="h-2 w-2 rounded-full" style={{ background: STORE_COLORS[o.store] }} />
              ))}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          {product.allOutOfStock ? (
            <span className="text-xs font-bold text-zinc-500">stokta yok</span>
          ) : product.minPrice !== undefined ? (
            <span className="text-sm font-bold text-orange-400">
              {formatPrice(product.minPrice)}
              {storeCount > 1 && <span className="block text-[10px] font-normal text-zinc-500">en düşük</span>}
            </span>
          ) : null}
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 fill-none stroke-zinc-400 stroke-[2.5] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="grid gap-2 px-3 pb-3">
            {product.note && <p className="text-sm leading-5 text-zinc-400">{product.note}</p>}
            {storeCount > 1 && (
              <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">Ucuzdan pahalıya</p>
            )}
            {product.offers.map((offer) => (
              <OfferRow key={offer.goId} product={product} offer={offer} onQr={() => onQr(offer)} />
            ))}
            {product.video && (
              <a
                href={product.video}
                target="_blank"
                rel="noopener noreferrer"
                className="justify-self-start rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-bold text-zinc-200 transition hover:border-orange-400 hover:text-orange-400"
              >
                ▶ İncelemeyi İzle
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export function ProductList({ products }: { products: LiveProduct[] }) {
  const [qr, setQr] = useState<{ product: LiveProduct; offer: LiveOffer } | null>(null);

  if (products.length === 0) {
    return <p className="py-4 text-center text-sm text-zinc-500">Bu kategoriye yakında ürün eklenecek.</p>;
  }

  return (
    <>
      <ul className="grid gap-2">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} onQr={(offer) => setQr({ product, offer })} />
        ))}
      </ul>
      {qr && <QrModal product={qr.product} offer={qr.offer} onClose={() => setQr(null)} />}
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
      } catch {
        // kullanıcı paylaşımı iptal etti
      }
      return;
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
