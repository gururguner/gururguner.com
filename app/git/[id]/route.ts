import { findOffer } from "../../_linklerim/catalog";

// gururguner.com/git/<id> → ürünün mağaza linkine yönlendirir (ör. /git/xiaomi-smart-kettle-2-pro-amazon).
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let target: string | undefined;
  try {
    target = await findOffer(id);
  } catch (e) {
    console.error(`[git] ${id}: ${e instanceof Error ? e.message : e}`);
  }

  if (!target) {
    return Response.redirect(new URL("/linklerim", request.url), 302);
  }

  // Vercel loglarında hangi ürüne kaç kez tıklandığını görmek için
  console.log(`[git] ${id}`);

  // 302: tarayıcılar bu yönlendirmeyi kalıcı olarak önbelleğe almaz, link değişirse hemen geçerli olur.
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
