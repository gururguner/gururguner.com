export type SocialType = "instagram" | "youtube" | "tiktok";

export const socials: { type: SocialType; label: string; href: string }[] = [
  { type: "youtube", label: "YouTube", href: "https://www.youtube.com/@GururGuner" },
  { type: "instagram", label: "Instagram", href: "https://www.instagram.com/gururguner1" },
  { type: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@gururguner1" },
];

export function SocialIcon({ type, size = "h-10 w-10" }: { type: SocialType; size?: string }) {
  if (type === "instagram") {
    return (
      <div className={`flex ${size} items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400`}>
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 fill-white" aria-hidden="true">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
        </svg>
      </div>
    );
  }

  if (type === "youtube") {
    return (
      <div className={`flex ${size} items-center justify-center rounded-full bg-red-600`}>
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 fill-white" aria-hidden="true">
          <path d="M21.58 7.2a2.94 2.94 0 0 0-2.07-2.08C17.73 4.6 12 4.6 12 4.6s-5.73 0-7.51.52A2.94 2.94 0 0 0 2.42 7.2 30.3 30.3 0 0 0 1.9 12a30.3 30.3 0 0 0 .52 4.8 2.94 2.94 0 0 0 2.07 2.08C6.27 19.4 12 19.4 12 19.4s5.73 0 7.51-.52a2.94 2.94 0 0 0 2.07-2.08A30.3 30.3 0 0 0 22.1 12a30.3 30.3 0 0 0-.52-4.8ZM10.2 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex ${size} items-center justify-center rounded-full bg-black ring-1 ring-zinc-700`}>
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 fill-white" aria-hidden="true">
        <path d="M14.6 3h2.2c.2 1.7 1.2 3 2.7 3.9v2.3a6 6 0 0 1-2.9-.9v6.6a5.6 5.6 0 1 1-5.6-5.6c.4 0 .8 0 1.1.1v2.3a3.3 3.3 0 1 0 2.5 3.2V3Z" />
      </svg>
    </div>
  );
}
