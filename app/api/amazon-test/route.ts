import { getAmazonItems } from "../../_linklerim/amazon";

// GEÇİCİ TEST: Amazon Creators API bağlantısını dener. Gizli bilgileri göstermez.
export async function GET() {
  const env = {
    AMAZON_CREDENTIAL_ID: Boolean(process.env.AMAZON_CREDENTIAL_ID),
    AMAZON_CREDENTIAL_SECRET: Boolean(process.env.AMAZON_CREDENTIAL_SECRET),
    AMAZON_CREDENTIAL_VERSION: process.env.AMAZON_CREDENTIAL_VERSION ?? null,
    AMAZON_PARTNER_TAG: process.env.AMAZON_PARTNER_TAG ?? null,
  };
  const result = await getAmazonItems(["B07HH6Z1V1", "B0D9YNY3DN", "B0DP3JZW88"]);
  return Response.json(
    {
      env,
      error: result.error ?? null,
      items: [...result.items.values()].map((i) => ({ ...i, title: i.title?.slice(0, 60) })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
