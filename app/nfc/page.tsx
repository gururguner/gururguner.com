import Image from "next/image";

type LinkIconType = "instagram" | "youtube" | "tiktok" | "email";

const links = [
  {
    title: "Instagram",
    subtitle: "@gururguner1",
    href: "https://www.instagram.com/gururguner1",
    icon: "instagram" as LinkIconType,
  },
  {
    title: "YouTube",
    subtitle: "@gururguner",
    href: "https://www.youtube.com/@GururGuner",
    icon: "youtube" as LinkIconType,
  },
  {
    title: "TikTok",
    subtitle: "@gururguner1",
    href: "https://www.tiktok.com/@gururguner1",
    icon: "tiktok" as LinkIconType,
  },
  {
    title: "Mail",
    subtitle: "gururguner@gmail.com",
    href: "mailto:gururguner@gmail.com",
    icon: "email" as LinkIconType,
  },
];

function LinkIcon({ type }: { type: LinkIconType }) {
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

export default function NfcPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] px-5 py-8 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
          <div className="absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] h-48 w-48 rounded-full bg-orange-700/25 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full border-2 border-orange-500 bg-zinc-900">
              <Image
                src="/gurur.png"
                alt="Gurur Güner"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold">Gurur Güner</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Teknoloji, yapay zeka, 3D baskı ve dijital yaşam içerikleri.
              </p>
            </div>

            <div className="mt-7 grid gap-3">
              {links.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 transition hover:border-orange-500 hover:bg-zinc-900"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <LinkIcon type={link.icon} />
                      <div>
                        <div className="font-bold">{link.title}</div>
                        <div className="mt-1 text-sm text-zinc-500">{link.subtitle}</div>
                      </div>
                    </div>

                    <div className="text-xl text-orange-400 transition group-hover:translate-x-1">
                      →
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <a
              href="/"
              className="mt-5 block text-center text-sm font-medium text-zinc-500 transition hover:text-orange-400"
            >
              gururguner.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}