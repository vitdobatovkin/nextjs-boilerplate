/** @jsxImportSource react */
import { ImageResponse } from "next/og";

export const runtime = "edge";

function safe(s: string, max = 80) {
  const t = (s || "").toString().replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const handle = safe(searchParams.get("handle") || "@…", 36);
  const bio = safe(searchParams.get("bio") || "", 120);
  const img =
    searchParams.get("img") ||
    "https://pbs.twimg.com/profile_images/1868572161415532544/n1z9sXm4_400x400.jpg";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          color: "#0A0B0D",
          position: "relative",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 520px at 62% 12%, rgba(10,71,255,.12), transparent 65%)"
          }}
        />

        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.22em",
            opacity: 0.55,
            fontWeight: 800,
            textTransform: "uppercase"
          }}
        >
          Congratulations
        </div>

        <div
          style={{
            marginTop: 28,
            width: 280,
            height: 280,
            borderRadius: 56,
            overflow: "hidden",
            border: "2px solid rgba(10,10,10,.10)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={img}
            width={280}
            height={280}
            alt="avatar"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.04em"
          }}
        >
          {handle}
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 30,
            opacity: 0.7,
            textAlign: "center",
            padding: "0 80px"
          }}
        >
          {bio || "How based are you in 2026?"}
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 22,
            opacity: 0.55
          }}
        >
          How based are you in 2026?
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
