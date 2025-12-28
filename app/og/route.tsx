import { ImageResponse } from "next/og";

export const runtime = "edge";

function normalizeHandle(h: string) {
  return h.replace("@", "").toLowerCase();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const handle = searchParams.get("handle") || "@someone";
  const bio = searchParams.get("bio") || "How based are you in 2026?";

  const slug = normalizeHandle(handle);
  const imgUrl = `https://based-me.vercel.app/avatars/${slug}.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <img
          src={imgUrl}
          width={200}
          height={200}
          style={{ borderRadius: 24 }}
        />
        <div style={{ marginTop: 24, fontSize: 48 }}>{handle}</div>
        <div style={{ marginTop: 8, fontSize: 28, color: "#666" }}>{bio}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
