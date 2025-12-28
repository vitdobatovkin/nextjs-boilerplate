import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const handle = searchParams.get("handle") || "@based";
    const bio = searchParams.get("bio") || "";
    const imgUrl = searchParams.get("img");

    let avatarSrc: string | null = null;

    if (imgUrl) {
      const res = await fetch(imgUrl);
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      avatarSrc = `data:image/jpeg;base64,${base64}`;
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {avatarSrc && (
            <img
              src={avatarSrc}
              width={220}
              height={220}
              style={{
                borderRadius: 32,
                marginBottom: 24,
              }}
            />
          )}

          <div style={{ fontSize: 64, fontWeight: 900 }}>{handle}</div>

          <div
            style={{
              fontSize: 28,
              marginTop: 16,
              opacity: 0.75,
              maxWidth: 900,
              textAlign: "center",
            }}
          >
            {bio}
          </div>

          <div
            style={{
              marginTop: 32,
              fontSize: 24,
              opacity: 0.6,
            }}
          >
            How based are you in 2026?
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
