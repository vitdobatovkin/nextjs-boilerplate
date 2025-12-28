import type { Metadata } from "next";

type Props = {
  searchParams: {
    handle?: string;
    bio?: string;
    v?: string;
  };
};

function enc(s: string) {
  return encodeURIComponent(s);
}

function baseUrl() {
  // для Vercel: VERCEL_URL = "based-me.vercel.app"
  const host =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return host.replace(/\/$/, "");
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const handle = searchParams.handle?.trim() || "@someone";
  const bio = searchParams.bio?.trim() || "How based are you in 2026?";
  const v = searchParams.v?.trim();

  const site = baseUrl();

  const ogImage = `${site}/og?handle=${enc(handle)}&bio=${enc(bio)}${v ? `&v=${enc(v)}` : ""}`;
  const canonical = `${site}/r?handle=${enc(handle)}&bio=${enc(bio)}${v ? `&v=${enc(v)}` : ""}`;

  const title = `I’m based as ${handle}`;
  const description = bio;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default function Page({ searchParams }: Props) {
  const handle = searchParams.handle?.trim() || "@someone";
  const bio = searchParams.bio?.trim() || "How based are you in 2026?";

  return (
    <main style={{ fontFamily: "system-ui", padding: 32 }}>
      <h1>Open this link on X to see the card preview</h1>
      <p>Handle: <b>{handle}</b></p>
      <p>Bio: <b>{bio}</b></p>
    </main>
  );
}
