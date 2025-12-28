import { ImageResponse } from "next/og";

export const runtime = "edge";

function safe(s: string, max = 120) {
  const t = (s || "").toString().replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function avatarPathFromHandle(handle: string) {
  const key = (handle || "@someone").replace(/^@/, "").toLowerCase();
  return `/avatars/${key}.png`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const handle = safe(searchParams.get("handle") || "@someone", 36);
    const bio = safe(searchParams.get("bio") || "How based are you in 2026?", 120);

    // если img НЕ передали — берём из handle
    const imgParam = searchParams.get("img");
    const img = imgParam?.trim() ? imgParam.trim() : avatarPathFromHandle(handle);

    // важно: для next/og можно давать относительный путь к public
    // но если начнутся капризы — заменим на абсолютный через req.url (скажу ниже)
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            fontFamily: "system-ui",
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 36,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              width={180}
              height={180}
              style={{ objectFit: "cover" }}
            />
          </div>

          <div style={{ marginTop: 26, fontSize: 64, fontWeight: 900, color: "#0A0B0D" }}>
            {handle}
          </div>

          <div style={{ marginTop: 10, fontSize: 28, color: "rgba(10,10,10,.55)" }}>
            {bio}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response("OG error", { status: 500 });
  }
}
