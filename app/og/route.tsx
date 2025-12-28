import { ImageResponse } from "next/og";

export const runtime = "edge";

function safe(s: string, max = 80) {
  const t = (s || "").toString().replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function handleToSlug(handle: string) {
  return handle.replace(/^@/, "").trim();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const handleRaw = searchParams.get("handle") || "@someone";
    const bioRaw = searchParams.get("bio") || "How based are you in 2026?";

    const handle = safe(handleRaw, 36);
    const bio = safe(bioRaw, 120);

    const slug = handleToSlug(handleRaw) || "default";

    // Берём локальную картинку:
    // /public/avatars/{slug}.png
    // если нет — /public/avatars/default.png
    const imgUrl = new URL(`/avatars/${slug}.png`, req.url);
    let finalImgUrl = imgUrl.toString();

    // Проверим что файл реально отдается, иначе fallback
    const head = await fetch(finalImgUrl, { method: "HEAD" });
    if (!head.ok) {
      finalImgUrl = new URL("/avatars/default.png", req.url).toString();
    }

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
              padding: "80px",
              gap: "22px",
            }}
          >
            <div style={{ fontSize: 18, letterSpacing: 3, color: "rgba(10,10,10,.55)", fontWeight: 800 }}>
              CONGRATULATIONS
            </div>

            <img
              src={finalImgUrl}
              width={180}
              height={180}
              style={{ borderRadius: 36, border: "1px solid rgba(10,10,10,.10)" }}
            />

            <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1, color: "#0A0B0D" }}>
              {handle}
            </div>

            <div style={{ fontSize: 28, color: "rgba(10,10,10,.55)", fontWeight: 500, textAlign: "center" }}>
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
