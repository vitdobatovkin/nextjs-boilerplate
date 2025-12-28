import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const handle = searchParams.get("handle") || "@someone";
    const bio =
      searchParams.get("bio") || "How based are you in 2026?";

    const rawImg = searchParams.get("img");

    const imgUrl =
      rawImg && rawImg.startsWith("https://")
        ? rawImg
        : "https://based-me.vercel.app/avatars/brian_armstrong.png";

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
          <img
            src={imgUrl}
            width={200}
            height={200}
            style={{ borderRadius: "24px", marginBottom: "24px" }}
          />

          <div style={{ fontSize: 48, fontWeight: 700 }}>
            {handle}
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 28,
              color: "#666",
            }}
          >
            {bio}
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
