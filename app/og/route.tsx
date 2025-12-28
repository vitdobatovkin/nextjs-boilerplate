import { ImageResponse } from "next/og";

export const runtime = "edge";

function safe(v: string | null, max: number) {
  const t = (v ?? "").toString().replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function handleToSlug(handle: string) {
  return handle.replace(/^@/, "").trim().toLowerCase();
}

export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);

    const handleRaw = safe(searchParams.get("handle"), 36) || "@someone";
    const bio = safe(searchParams.get("bio"), 120) || "How based are you in 2026?";

    // локальная картинка из репо: /public/avatars/<slug>.png
    const slug = handleToSlug(handleRaw);
    const imgUrl = `${origin}/avatars/${slug}.png`; // ВАЖНО: абсолютный URL

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            fontFamily: "system-ui",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(10,10,10,.55)",
              }}
            >
              CONGRATULATIONS
            </div>

            <img
              src={imgUrl}
              width={220}
              height={220}
              style={{
                borderRadius: 44,
                border: "1px solid rgba(10,10,10,.10)",
              }}
            />

            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#0A0B0D",
              }}
            >
              {handleRaw}
            </div>

            <div
              style={{
                fontSize: 28,
                color: "rgba(10,10,10,.55)",
              }}
            >
              {bio}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response("OG error", { status: 500 });
  }
}
