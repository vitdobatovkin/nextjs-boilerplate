import type { Metadata } from "next";

function absUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://based-me.vercel.app";
  return path.startsWith("http") ? path : `${base}${path}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { handle?: string; bio?: string; img?: string };
}): Promise<Metadata> {
  const handle = searchParams.handle || "@…";
  const bio = searchParams.bio || "How based are you in 2026?";
  const img = searchParams.img || "/avatars/brian_armstrong.png";

  const qs = new URLSearchParams({
    handle,
    bio,
    img,
  }).toString();

  const ogImage = absUrl(`/og?${qs}`);
  const pageUrl = absUrl(`/r?${qs}`);

  return {
    title: `I'm based as ${handle}`,
    description: bio,
    openGraph: {
      title: `I'm based as ${handle}`,
      description: bio,
      url: pageUrl,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `I'm based as ${handle}`,
      description: bio,
      images: [ogImage],
    },
  };
}

export default function Page() {
  // можно редиректнуть на главную, либо показать твою UI
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Open this link on X to see the card preview</h1>
      <p>Если ты видишь эту страницу — значит мета-теги отдаются.</p>
    </main>
  );
}
