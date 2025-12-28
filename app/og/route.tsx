import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const handle = searchParams.get("handle") || "@someone";
    const bio = searchParams.get("bio") || "How based are you in 2026?";
    const img = searchParams.get("img") || "/avatars/brian_armstrong.png";

    const imgUrl = img.startsWith("http")
      ? img
      : `https://based-me.vercel.app${img}`;

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
              display: "flex",
              gap: 40,
              alignItems: "center",
            }}
          >
            <img
              src={imgUrl}
              width={260}
              height={260}
              style={{ borderRadius: 24 }}
            />
            <div>
              <div style={{ fontSize: 56, fontWeight: 900 }}>
                {handle}
              </div>
              <div style={{ fontSize: 28, color: "#555" }}>
                {bio}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response("OG error", { status: 500 });
  }
}
