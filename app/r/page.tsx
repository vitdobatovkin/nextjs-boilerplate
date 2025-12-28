export const runtime = "edge";

function safe(s: string | undefined, max = 120) {
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
  const img = safe(searchParams.img || "", 600);

  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://based-me.vercel.app").replace(/\/$/, "");
  const og = `${base}/og?handle=${encodeURIComponent(handle)}&bio=${encodeURIComponent(
    bio
  )}&img=${encodeURIComponent(img)}`;

  const canonical = `${base}/r?handle=${encodeURIComponent(handle)}&bio=${encodeURIComponent(
    bio
  )}&img=${encodeURIComponent(img)}`;

  const landing = `${base}/?handle=${encodeURIComponent(handle)}&bio=${encodeURIComponent(
    bio
  )}&img=${encodeURIComponent(img)}`;

  const title = `I'm based as ${handle}`;
  const desc = `How based are you in 2026?`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonical} />

        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={og} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={og} />

        {/* IMPORTANT: do NOT server-redirect; do client refresh */}
        <meta httpEquiv="refresh" content={`0;url=${landing}`} />
      </head>
      <body>
        Redirecting…
      </body>
    </html>
  );
}
