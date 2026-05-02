"use client";
import Image from "next/image";

type IconType = "instagram" | "youtube" | "tiktok" | "mail" | null;

const stats = [
  {
    label: "Instagram",
    value: "54K+",
    detail: "@gururguner1",
    icon: "instagram" as IconType,
    link: "https://www.instagram.com/gururguner1",
  },
  {
    label: "YouTube",
    value: "6K+",
    detail: "@gururguner",
    icon: "youtube" as IconType,
    link: "https://www.youtube.com/@GururGuner",
  },
  {
    label: "TikTok",
    value: "14K+",
    detail: "@gururguner1",
    icon: "tiktok" as IconType,
    link: "https://www.tiktok.com/@gururguner1",
  },
  {
    label: "Toplam Erişim",
    value: "10.2M+",
    detail: "Tüm platformlar",
    icon: null as IconType,
    link: "",
  },
];

const platforms = [
  {
    name: "Instagram",
    handle: "@gururguner1",
    description: "Reels, teknoloji, yapay zeka, ürün deneyimi ve kısa format içerikler.",
    link: "https://www.instagram.com/reel/DXysUwuu2ie/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    icon: "instagram" as IconType,
    
    thumbnail: "/videos/instagram-thumb.jpg",
  },
  {
    name: "YouTube",
    handle: "@gururguner",
    description: "Uzun inceleme videoları, rehber içerikler, deneyim anlatımları ve teknoloji projeleri.",
    link: "https://youtu.be/JLrkDQkylgA?si=3-wIk8BQj46FvckC",
    icon: "youtube" as IconType,
   
    thumbnail: "/videos/youtube-thumb.jpg",
  },
  {
    name: "TikTok",
    handle: "@gururguner1",
    description: "Hızlı tüketilen teknoloji, yapay zeka ve dijital yaşam içerikleri.",
    link: "https://www.tiktok.com/@gururguner1/video/7610772271615053072?is_from_webapp=1&sender_device=pc&web_id=7585730246474434060",
    icon: "tiktok" as IconType,
    
    thumbnail: "/videos/tiktok-thumb.jpg",
  },
];

const brands = [
    { name: "Wraith", domain: "wraithesports.com" },
  { name: "TECNO", domain: "tecno-mobile.com" },
  { name: "Snapmaker", domain: "snapmaker.com" },
  { name: "Keenetic", domain: "keenetic.com" },
  { name: "Hailuo AI", domain: "hailuoai.video" },
  { name: "DJI", domain: "dji.com" },
  { name: "Genix", domain: "genix.com.tr" },
  { name: "Razer", domain: "razer.com" },
  { name: "Huawei", domain: "huawei.com" },
  { name: "Porima3D", domain: "porima3d.com" },
  { name: "EZVIZ", domain: "ezviz.com" },
  { name: "İncehesap", domain: "incehesap.com" },
  { name: "Hollyland", domain: "hollyland.com" },
  { name: "Havit", domain: "havit.hk" },
  { name: "Creality", domain: "creality.com" },
  { name: "Open English", domain: "openenglish.com" },
  { name: "Emergent AI", domain: "emergent.sh" },
];

function SocialIcon({ type }: { type: IconType }) {
  if (!type) return null;

  if (type === "instagram") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
        </svg>
      </div>
    );
  }

  if (type === "youtube") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
          <path d="M21.58 7.2a2.94 2.94 0 0 0-2.07-2.08C17.73 4.6 12 4.6 12 4.6s-5.73 0-7.51.52A2.94 2.94 0 0 0 2.42 7.2 30.3 30.3 0 0 0 1.9 12a30.3 30.3 0 0 0 .52 4.8 2.94 2.94 0 0 0 2.07 2.08C6.27 19.4 12 19.4 12 19.4s5.73 0 7.51-.52a2.94 2.94 0 0 0 2.07-2.08A30.3 30.3 0 0 0 22.1 12a30.3 30.3 0 0 0-.52-4.8ZM10.2 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      </div>
    );
  }

  if (type === "tiktok") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
          <path d="M14.6 3h2.2c.2 1.7 1.2 3 2.7 3.9v2.3a6 6 0 0 1-2.9-.9v6.6a5.6 5.6 0 1 1-5.6-5.6c.4 0 .8 0 1.1.1v2.3a3.3 3.3 0 1 0 2.5 3.2V3Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.2.5L12 11.2 17.8 7H6.2Zm11.8 1.4-5.4 3.9a1 1 0 0 1-1.2 0L6 8.4v9.1c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V8.4Z" />
      </svg>
    </div>
  );
}

export default function Home() {
  const marqueeBrands = [...brands, ...brands];
    const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <section className="relative overflow-hidden px-6 py-4 md:px-12 md:py-10 lg:px-20">
        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-20 left-[-120px] h-80 w-80 rounded-full bg-orange-700/20 blur-3xl" />

       <header className="relative z-10 mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center">
  <nav className="hidden items-center justify-end gap-8 text-sm font-bold uppercase text-zinc-100 md:flex">
    <button onClick={() => scrollToSection("ben-kimim")} className="hover:text-orange-400">
  Ben Kimim?
</button>
    <button onClick={() => scrollToSection("platformlar")} className="hover:text-orange-400">
  Platformlar
</button>
  </nav>

  <a href="/" className="mx-12 hidden shrink-0 md:block">
    <Image
      src="/logo1.png"
      alt="Gurur Güner Logo"
      width={260}
      height={104}
      className="h-auto w-[190px] md:w-[240px]"
      priority
    />
  </a>

  <nav className="hidden items-center justify-start gap-8 text-sm font-bold uppercase text-zinc-100 md:flex">
    <button onClick={() => scrollToSection("markalar")} className="hover:text-orange-400">
  Markalar
</button>
    <button onClick={() => scrollToSection("iletisim")} className="hover:text-orange-400">
  İletişim
</button>
  </nav>
</header>

        <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-8 py-4 md:gap-12 md:py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="pt-0 md:pt-6">
<div className="mb-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:hidden">
  <nav className="flex flex-col items-end gap-2 text-[12px] font-bold uppercase leading-none text-zinc-100">
    <button
  onClick={() => scrollToSection("platformlar")}
  className="rounded-full border border-zinc-700 px-6 py-3 text-center font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
>
  Ben Kimim?
</button>
   <button
  onClick={() => scrollToSection("platformlar")}
  className="rounded-full border border-zinc-700 px-6 py-3 text-center font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
>
  Platformlar
</button>
  </nav>

  <div className="relative h-[105px] w-[120px] overflow-hidden">
    <Image
      src="/logo1.png"
      alt="Gurur Güner Logo"
      fill
      className="object-contain object-center scale-[1.25]"
      priority
    />
  </div>

  <nav className="flex flex-col items-start gap-2 text-[12px] font-bold uppercase leading-none text-zinc-100">
    <button
  onClick={() => scrollToSection("platformlar")}
  className="rounded-full border border-zinc-700 px-6 py-3 text-center font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
>
  Markalar
</button>
    <button
  onClick={() => scrollToSection("iletisim")}
  className="rounded-full bg-orange-500 px-6 py-3 text-center font-bold text-black transition hover:bg-orange-400"
>
  İletişim
</button>
  </nav>
</div>

  <div className="mb-5 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs text-orange-300 md:text-sm">
    Teknoloji • Yapay Zeka • 3D Baskı • Dijital Yaşam
  </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-7xl">
              Teknolojiyi herkesin anlayacağı dile çeviriyorum.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Teknoloji, yapay zeka, 3D baskı, elektrikli araçlar ve dijital yaşam üzerine içerikler üretiyorum.
              Karmaşık teknolojileri anlaşılır, uygulanabilir ve izlenmesi keyifli içeriklere dönüştürüyorum.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#iletisim"
                className="rounded-full bg-orange-500 px-6 py-3 text-center font-bold text-black transition hover:bg-orange-400"
              >
                İletişime Geç
              </a>
              <a
                href="#platformlar"
                className="rounded-full border border-zinc-700 px-6 py-3 text-center font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
              >
                Platformları Gör
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-2xl">
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-800 p-1">
              <div className="rounded-2xl bg-[#111] p-6">
                <div className="mb-5 flex justify-center">
                  <Image
                    src="/gurur.png"
                    alt="Gurur Güner"
                    width={220}
                    height={275}
                    className="h-auto w-[180px] rounded-3xl border border-zinc-800 object-cover shadow-xl md:w-[220px]"
                    priority
                  />
                </div>

                <p className="text-center text-sm text-zinc-400">Dijital İçerik Üretici</p>
                <h2 className="mt-2 text-center text-3xl font-bold">Gurur Güner</h2>
                <p className="mt-4 text-center text-zinc-300">
                  Markalar için teknoloji odaklı, güvenilir ve izleyiciyle bağ kuran içerik üretimi.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                 {stats.map((stat) => {
  const CardContent = (
    <>
      <div className="text-2xl font-bold text-orange-400">{stat.value}</div>

      <div className="mt-2 flex items-center gap-2">
        {stat.icon && <SocialIcon type={stat.icon} />}
        <div className="text-sm font-bold">{stat.label}</div>
      </div>

      <div className="mt-1 text-xs text-zinc-500">{stat.detail}</div>
    </>
  );

  if (stat.link) {
    return (
      <a
        key={stat.label}
        href={stat.link}
        target="_blank"
        rel="noreferrer"
        className="rounded-2xl bg-zinc-900 p-4 transition hover:bg-zinc-800"
      >
        {CardContent}
      </a>
    );
  }

  return (
    <div key={stat.label} className="rounded-2xl bg-zinc-900 p-4">
      {CardContent}
    </div>
  );
})}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ben-kimim" className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-800">
            <Image
              src="/gurur.png"
              alt="Gurur Güner"
              width={500}
              height={620}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="mb-4 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
              Ben Kimim?
            </div>

            <h2 className="text-3xl font-bold md:text-5xl">
              Teknolojiyi sadece anlatmıyor, deneyimleyip anlaşılır hale getiriyorum.
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Ben Gurur Güner. Teknoloji, yapay zeka, 3D baskı, elektrikli araçlar ve dijital yaşam üzerine içerikler üretiyorum.
              İçeriklerimde amacım sadece ürünü göstermek değil; izleyicinin gerçekten anlayacağı, kullanabileceği ve fikir alabileceği bir deneyim sunmak.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-900 p-4">
                <div className="text-sm text-zinc-500">Odak</div>
                <div className="mt-1 font-bold">Teknoloji</div>
              </div>
              <div className="rounded-2xl bg-zinc-900 p-4">
                <div className="text-sm text-zinc-500">Dil</div>
                <div className="mt-1 font-bold">Net ve samimi</div>
              </div>
              <div className="rounded-2xl bg-zinc-900 p-4">
                <div className="text-sm text-zinc-500">Format</div>
                <div className="mt-1 font-bold">Video içerik</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platformlar" className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold md:text-4xl">Platformlar</h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            İçerikler her platformun izleme alışkanlığına göre ayrı ayrı kurgulanır.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.link}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition hover:border-orange-500/70 hover:bg-zinc-900"
              >
               <div className="relative flex aspect-[9/13] items-center justify-center overflow-hidden bg-zinc-900 p-5">
  <Image
    src={platform.thumbnail}
    alt={`${platform.name} örnek içerik`}
    fill
    className="object-cover transition duration-500 group-hover:scale-105"
  />

  <div className="absolute inset-0 bg-black/10" />

  <div className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-black">
  ▶
</div>
</div>

                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <SocialIcon type={platform.icon} />
                    <div>
                      <div className="text-2xl font-bold">{platform.name}</div>
                      <div className="mt-1 text-orange-400">{platform.handle}</div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-400">{platform.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

     <section id="markalar" className="px-6 py-16 md:px-12 lg:px-20">
  <div className="mx-auto max-w-6xl">
    <h2 className="text-3xl font-bold md:text-4xl">Çalıştığım Markalar</h2>
    <p className="mt-3 max-w-2xl text-zinc-400">
      Teknoloji, yapay zeka, ürün deneyimi ve dijital yaşam odağında farklı markalarla içerik çalışmaları.
    </p>

    <div className="relative mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 py-6">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-zinc-950 to-transparent" />

      <div className="brand-marquee-track flex w-max gap-4 px-4">
        {[...brands, ...brands].map((brand, index) => (
          <div
  key={`${brand.name}-${index}`}
  className="flex h-20 min-w-56 shrink-0 items-center justify-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-5"
>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-2">
  <img
    src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=256`}
    alt={`${brand.name} logo`}
    className="h-full w-full object-contain"
  />
</div>

            <div className="whitespace-nowrap text-center text-lg font-bold tracking-wide text-zinc-100">
  {brand.name}
</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <section id="iletisim" className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-orange-500 p-8 text-black md:p-10">
          <h2 className="text-3xl font-bold md:text-4xl">İletişim</h2>
          <p className="mt-4 max-w-2xl text-lg">
            İş birlikleri, ürün incelemeleri ve kampanya çalışmaları için benimle iletişime geçebilirsiniz.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-lg font-bold sm:flex-row sm:items-center">
  <a
    href="mailto:gururguner@gmail.com"
    className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-6 py-3 text-center text-white"
  >
    <SocialIcon type="mail" />
    gururguner@gmail.com
  </a>
</div>
        </div>
              <footer className="px-6 pb-10 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 border-t border-zinc-800 pt-8">
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/gururguner1"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition hover:scale-110"
            >
              <SocialIcon type="instagram" />
            </a>

            <a
              href="https://www.youtube.com/@GururGuner"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="transition hover:scale-110"
            >
              <SocialIcon type="youtube" />
            </a>

            <a
              href="https://www.tiktok.com/@gururguner1"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="transition hover:scale-110"
            >
              <SocialIcon type="tiktok" />
            </a>
          </div>

          <p className="text-center text-sm text-zinc-500">
            © 2026 Gurur Güner
          </p>
        </div>
      </footer>
      </section>
    </main>
  );
}