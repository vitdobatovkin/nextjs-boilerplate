type Props = {
  searchParams: {
    handle?: string;
    bio?: string;
    v?: string;
  };
};

const BASE_URL = "https://based-me.vercel.app";

export default function Page({ searchParams }: Props) {
  const handle = searchParams.handle || "@someone";
  const bio = searchParams.bio || "How based are you in 2026?";
  const v = searchParams.v ? `&v=${searchParams.v}` : "";

  const ogImage = `${BASE_URL}/og?handle=${encodeURIComponent(handle)}&bio=${encodeURIComponent(bio)}${v}`;
  const canonical = `${BASE_URL}/r?handle=${encodeURIComponent(handle)}&bio=${encodeURIComponent(bio)}${v}`;

  return (
    <html>
      <head>
        <title>I’m based as {handle}</title>

        <meta property="og:type" content="website" />
        <meta property="og:title" content={`I’m based as ${handle}`} />
        <meta property="og:description" content={bio} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
      </head>

      <body>
        <h1>Open this link on X to see the card preview</h1>
      </body>
    </html>
  );
}
