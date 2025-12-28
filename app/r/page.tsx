type Props = {
  searchParams: {
    handle?: string;
    bio?: string;
    v?: string; // для cache-bust (по желанию)
  };
};

function enc(s: string) {
  return encodeURIComponent(s);
}

export default function Page({ searchParams }: Props) {
  const handle = searchParams.handle?.trim() || "@someone";
  const bio = searchParams.bio?.trim() || "How based are you in 2026?";
  const v = searchParams.v?.trim();

  // URL для OG картинки
  const ogImage = `/og?handle=${enc(handle)}&bio=${enc(bio)}${v ? `&v=${enc(v)}` : ""}`;

  // canonical url этой страницы (то что шарится)
  const canonical = `/r?handle=${enc(handle)}&bio=${enc(bio)}${v ? `&v=${enc(v)}` : ""}`;

  const title = `I’m based as ${handle}`;
  const description = bio;

  return (
    <html lang="en">
      <head>
        <title>{title}</title>

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* чтобы X быстрее обновлял */}
        <meta name="robots" content="index,follow" />
      </head>

      <body style={{ fontFamily: "system-ui", padding: 32 }}>
        <h1>Open this link on X to see the card preview</h1>
        <p>Если ты видишь эту страницу — значит мета-теги отдаются.</p>
      </body>
    </html>
  );
}
