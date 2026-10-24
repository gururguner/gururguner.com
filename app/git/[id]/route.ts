import { getProduct } from "../../_linklerim/data";

// gururguner.com/git/<id> → ürünün mağaza linkine yönlendirir.
// Videolarda bu kısa linki paylaş; ürün linki değişirse sadece data.ts'deki `url`'i güncellemen yeterli.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return Response.redirect(new URL("/linklerim", request.url), 302);
  }

  // Vercel loglarında hangi ürüne kaç kez tıklandığını görmek için
  console.log(`[git] ${id}`);

  // 302: tarayıcılar bu yönlendirmeyi kalıcı olarak önbelleğe almaz, link değişirse hemen geçerli olur.
  return new Response(null, {
    status: 302,
    headers: {
      Location: product.url,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
