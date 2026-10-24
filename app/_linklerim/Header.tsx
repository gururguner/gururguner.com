import Image from "next/image";
import Link from "next/link";
import { SocialIcon, socials } from "./icons";

export function LinklerimHeader({ subtitle }: { subtitle: string }) {
  return (
    <header className="text-center">
      <Link href="/linklerim" className="mx-auto block h-24 w-24 overflow-hidden rounded-full border-2 border-orange-500 bg-zinc-900">
        <Image
          src="/gurur.png"
          alt="Gurur Güner"
          width={96}
          height={96}
          className="h-full w-full object-cover"
          priority
        />
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Gurur Güner</h1>
      <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>

      <div className="mt-5 flex items-center justify-center gap-3">
        {socials.map((s) => (
          <a
            key={s.type}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className="transition hover:scale-110"
          >
            <SocialIcon type={s.type} />
          </a>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-sm rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-xs leading-5 text-orange-200">
        <strong className="font-bold text-orange-300">Reklam</strong> · Bu sayfadaki bazı linkler satış
        ortaklığı linkidir. Bu linklerden alışveriş yapmanın size ek bir maliyeti yoktur.
      </p>
    </header>
  );
}

export function LinklerimFooter() {
  return (
    <footer className="mt-12 text-center text-sm text-zinc-500">
      <Link href="/" className="font-medium transition hover:text-orange-400">
        gururguner.com
      </Link>
      <span className="mx-2">·</span>© {new Date().getFullYear()} Gurur Güner
    </footer>
  );
}
