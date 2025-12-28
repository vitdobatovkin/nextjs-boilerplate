import { ImageResponse } from "next/og";

export const runtime = "edge";

function safe(s: string, max = 120) {
  const t = (s || "").toString().replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const handle = safe(searchParams.get("handle") || "@…", 36);
  const bio = safe(searchParams.get("bio") || "", 120);
  const img = searchParams.get("img") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
          color: "#0A0B0D",
          position: "relative",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial',
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 42,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(10,10,10,.55)",
            fontWeight: 800,
          }}
        >
          CONGRATULATIONS
        </div>

        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 40,
            overflow: "hidden",
            border: "1px solid rgba(10,10,10,.12)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img || "https://pbs.twimg.com/profile_images/1868572161415532544/n1z9sXm4_400x400.jpg"}
            width={260}
            height={260}
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 64,
            fontWeight: 950,
            letterSpacing: -2,
          }}
        >
          {handle}
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            color: "rgba(10,10,10,.65)",
          }}
        >
          {bio}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 20,
            color: "rgba(10,10,10,.55)",
          }}
        >
          You are based as <span style={{ fontWeight: 900 }}>{handle}</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 22,
            color: "rgba(10,10,10,.55)",
          }}
        >
          based-me.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
