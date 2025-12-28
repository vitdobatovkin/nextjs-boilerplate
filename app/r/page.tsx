import type { Metadata } from "next";

type Props = {
  searchParams: {
    handle?: string;
    bio?: string;
    v?: string; // cache-bust
  };
};

function enc(s: string) {
  return encodeURIComponent(s);
}

// Чтобы X не схватил один раз и не кэшировал навсегда
export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: Props): Metadata {
  const handle = (searchParams.handle || "@someone").trim();
  const bio = (searchParams.bio || "How based are you in 2026?").trim();
  const v = searchParams.v?.trim();

  // ВАЖНО: абсолютные URL
  const base = "https://based-me.vercel.app";
  const ogImage = `${base}/og?handle=${enc(handle)}&bio=${enc(bio)}${v ? `&v=${enc(v)}` : ""}`;
  const canonical = `${base}/r?handle=${enc(handle)}&bio=${enc(bio)}${v ? `&v=${enc(v)}` : ""}`;

  const title = `I’m based as ${handle}`;

  return {
    title,
    description: bio,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description: bio,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: bio,
      images: [ogImage],
    },
  };
}

export default function Page() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 32 }}>
      <h1>Open this link on X to see the card preview</h1>
      <p>Если ты видишь эту страницу — мета-теги отдаются.</p>
    </main>
  );
}
