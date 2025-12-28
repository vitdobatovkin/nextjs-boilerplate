import { redirect } from "next/navigation";

export const runtime = "edge";

function safe(s: string | null, max = 120) {
  const t = (s || "").toString().replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export default function RPage({
  searchParams,
}: {
  searchParams: { handle?: string; bio?: string; img?: string };
}) {
  const handle = safe(searchParams.handle || "@…", 36);
  const bio = safe(searchParams.bio || "", 120);
  const img = safe(searchParams.img || "", 400);

  // редирект юзера на главную (X успеет взять мета при скрейпе)
  // важно: X сам НЕ исполняет JS, ему нужен SSR HTML
  redirect(
    `/?handle=${encodeURIComponent(handle)}&bio=${encodeURIComponent(bio)}&img=${encodeURIComponent(img)}`
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { handle?: string; bio?: string; img?: string };
}) {
  const handle = safe(searchParams.handle || "@…", 36);
  const bio = safe(searchParams.bio || "", 120);
  const img = safe(searchParams.img || "", 400);

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://based-me.vercel.app";
  const og = `${base}/og?handle=${encodeURIComponent(handle)}&bio=${encodeURIComponent(bio)}&img=${encodeURIComponent(
    img
  )}`;

  const title = `I'm based as ${handle}`;
  const desc = `How based are you in 2026?`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [og],
    },
  };
}
