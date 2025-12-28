"use client";

import React, { useMemo, useRef, useState } from "react";

type Person = { handle: string; image?: string; bio?: string };

const DEFAULT_HANDLE = "@someone";
const DEFAULT_BIO = "How based are you in 2026?";

// ВАЖНО: image тут можно оставить как у тебя (remote), НО для OG мы использовать не будем.
// OG всегда будет брать локальный файл из /public/avatars/{handleWithout@}.png
const RAW_PARTICIPANTS: Person[] = [
  { handle: "@brian_armstrong", image: "https://pbs.twimg.com/profile_images/1516832438818770944/n77EwnKU_400x400.png", bio: "Co-founder & CEO at Coinbase" },
  { handle: "@emiliemc", image: "https://pbs.twimg.com/profile_images/1623399970287284224/A5DmX2nx_400x400.jpg", bio: "President and COO at Coinbase, Angel Investor" },
  { handle: "@catferdon", image: "https://pbs.twimg.com/profile_images/570956786867396608/Ksld22NC_400x400.jpeg", bio: "cmo coinbase" },
  { handle: "@maxbranzburg", image: "https://pbs.twimg.com/profile_images/1640358235931541506/UbOccG9U_400x400.jpg", bio: "consumer & business products coinbase" },
  { handle: "@ShanAggarwal", image: "https://pbs.twimg.com/profile_images/1897730647378014208/nA2ih7KS_400x400.jpg", bio: "chief business officer coinbase" },
  // ... добавь остальных
];

function sanitize(list: Person[]): Person[] {
  const out: Person[] = [];
  const seen = new Set<string>();
  for (const p of list) {
    const handle = (p?.handle || "").trim();
    if (!handle.startsWith("@")) continue;
    const key = handle.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      handle,
      image: (p.image || "").trim(),
      bio: (p.bio || "").trim(),
    });
  }
  return out;
}

function profileUrl(handle: string) {
  return `https://x.com/${handle.replace(/^@/, "")}`;
}

function buildSharePageUrl(winner: { handle: string; bio?: string }) {
  const base = window.location.origin; // https://based-me.vercel.app
  const u = new URL("/r", base);

  // НЕ encode руками — URLSearchParams сделает это один раз
  u.searchParams.set("handle", winner.handle);
  u.searchParams.set("bio", winner.bio || DEFAULT_BIO);

  // cache-bust чтобы X обновлял превью (меняй каждый раз)
  u.searchParams.set("v", String(Date.now()));

  return u.toString();
}

function buildXIntentUrl(winner: { handle: string; bio?: string }) {
  const sharePageUrl = buildSharePageUrl(winner);
  const text = `I’m based as ${winner.handle} 😎\nHow based are you in 2026?`;

  const intent = new URL("https://x.com/intent/tweet");
  intent.searchParams.set("text", text);
  intent.searchParams.set("url", sharePageUrl);

  return intent.toString();
}

export default function HomePage() {
  const people = useMemo(() => sanitize(RAW_PARTICIPANTS), []);
  const [current, setCurrent] = useState<Person>({
    handle: DEFAULT_HANDLE,
    image: "",
    bio: "Tap the button below.",
  });
  const [celebrate, setCelebrate] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const lastWinnerRef = useRef<Person | null>(null);

  async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function spin() {
    if (!people.length || spinning) return;
    setSpinning(true);
    setCelebrate(false);

    const winner = people[Math.floor(Math.random() * people.length)];

    for (let i = 0; i < 22; i++) {
      setCurrent(people[Math.floor(Math.random() * people.length)]);
      await sleep(45);
    }
    for (let i = 0; i < 12; i++) {
      setCurrent(people[Math.floor(Math.random() * people.length)]);
      await sleep(85 + i * 18);
    }

    setCurrent(winner);
    lastWinnerRef.current = winner;
    setCelebrate(true);
    setSpinning(false);
  }

  function onShare() {
    const w = lastWinnerRef.current;
    if (!w) return;
    window.open(buildXIntentUrl(w), "_blank", "noopener,noreferrer");
  }

  const url = profileUrl(current.handle);

  return (
    <>
      <div className="texture" aria-hidden="true"></div>
      <canvas id="confetti" aria-hidden="true"></canvas>

      <div className="wrap">
        <div className="hero">
          <div className="tag">2026 EDITION</div>
          <h1>How based are you in 2026?</h1>
          <p className="sub">
            Tap <b>Based me</b> — quick spin, and we’ll rate how based you are.
          </p>
        </div>

        <section className="panel" aria-label="Based generator">
          <div className={`stage ${celebrate ? "celebrate" : ""}`} aria-live="polite">
            <div className="congratsText">Congratulations</div>

            <a className="avatarLink" href={url} target="_blank" rel="noreferrer">
              {/* на самой странице можно хоть remote img */}
              <img
                alt="avatar"
                src={current.image || "/avatars/default.png"}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/avatars/default.png";
                }}
              />
            </a>

            <div className="meta">
              <a className="handleLink" href={url} target="_blank" rel="noreferrer">
                {current.handle}
              </a>

              <div className="bio">{current.bio || ""}</div>

              <div className="basedLine">
                You are based as{" "}
                <a href={url} target="_blank" rel="noreferrer">
                  {current.handle}
                </a>
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="btns">
              <button className="primary" onClick={spin} disabled={spinning}>
                Based me
              </button>

              <button
                className="share"
                onClick={onShare}
                style={{ display: celebrate ? "inline-block" : "none" }}
              >
                Share on X
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="miniLinks" aria-label="Social links">
        <div className="title">Socials</div>

        <div className="miniRow">
          <span className="miniIcon">
            <img
              src="https://pbs.twimg.com/profile_images/2003823220412026880/6UDZykCm_400x400.jpg"
              alt="creator avatar"
            />
          </span>
          <a className="miniMono" href="https://x.com/0x_mura" target="_blank" rel="noreferrer">
            CREATED BY
          </a>
        </div>

        <div className="miniRow">
          <span className="miniIcon" aria-hidden="true">
            <img
              alt="Base"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect x='2' y='2' width='16' height='16' rx='5' fill='%230000FF'/%3E%3C/svg%3E"
            />
          </span>
          <a
            className="miniMono"
            href="https://base.app/invite/muraa/HCR6DPRH"
            target="_blank"
            rel="noreferrer"
          >
            BASE APP
          </a>
        </div>
      </div>

      {/* Стили — как у тебя (перенёс без Tailwind) */}
      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --text: #0a0b0d;
          --muted: #5b616e;
          --line: #eef0f3;
          --blue: #0000ff;
          --card: #ffffff;
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        .texture {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(900px 520px at 62% 12%, rgba(10, 71, 255, 0.08), transparent 65%),
            repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.035) 0 1px, transparent 1px 6px);
          opacity: 0.55;
          mix-blend-mode: multiply;
        }

        .wrap {
          min-height: 100%;
          display: grid;
          place-items: center;
          padding: 28px 18px 44px;
        }

        .hero {
          width: min(980px, 100%);
          margin-bottom: 18px;
        }
        .tag {
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.55);
          margin-bottom: 10px;
          text-align: center;
        }
        h1 {
          margin: 0;
          font-size: clamp(40px, 4.6vw, 72px);
          line-height: 0.94;
          letter-spacing: -0.03em;
          font-weight: 900;
          text-align: center;
        }
        .sub {
          margin: 12px auto 0;
          max-width: 75ch;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.45;
          text-align: center;
        }

        .panel {
          width: min(1240px, 96vw);
          margin: 44px auto 0;
          border: 1px solid var(--line);
          border-radius: 32px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 64px 72px 54px;
          text-align: center;
          position: relative;
        }

        .congratsText {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.55);
          height: 18px;
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .stage.celebrate .congratsText {
          opacity: 1;
        }

        .avatarLink {
          display: block;
          border-radius: 40px;
          overflow: hidden;
          border: 1px solid rgba(10, 10, 10, 0.1);
          width: 260px;
          height: 260px;
          background: var(--card);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .avatarLink:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.1);
        }
        .avatarLink:active {
          transform: translateY(0px) scale(0.995);
        }
        .avatarLink img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .meta {
          max-width: 72ch;
        }

        .handleLink {
          display: inline-block;
          text-decoration: none;
          color: var(--text);
          font-size: 44px;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1.02;
        }
        .handleLink:hover {
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 6px;
        }

        .bio {
          margin-top: 14px;
          font-size: 18px;
          color: var(--muted);
          line-height: 1.65;
        }

        .basedLine {
          margin-top: 10px;
          font-size: 14px;
          color: rgba(10, 10, 10, 0.55);
          display: none;
        }
        .basedLine a {
          color: rgba(10, 10, 10, 0.85);
          text-decoration: none;
          font-weight: 950;
          border-bottom: 1px solid rgba(10, 10, 10, 0.18);
        }
        .basedLine a:hover {
          border-bottom-color: rgba(10, 10, 10, 0.65);
        }
        .stage.celebrate .basedLine {
          display: block;
        }

        .actions {
          display: flex;
          padding: 24px 72px 28px;
          border-top: 1px solid var(--line);
          background: rgba(246, 247, 248, 0.55);
          justify-content: center;
          align-items: center;
        }
        .btns {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          gap: 12px;
          flex-wrap: wrap;
        }
        button {
          border: 1px solid transparent;
          border-radius: 16px;
          padding: 14px 22px;
          font-weight: 950;
          cursor: pointer;
          font-size: 16px;
          letter-spacing: -0.01em;
          transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
        }
        .primary {
          background: var(--blue);
          color: #fff;
          box-shadow: 0 14px 34px rgba(10, 71, 255, 0.22);
        }
        .primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .share {
          background: #fff;
          color: var(--text);
          border: 1px solid rgba(10, 10, 10, 0.14);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.06);
        }
        .share:hover {
          transform: translateY(-1px);
        }
        .share:active {
          transform: translateY(0px) scale(0.995);
        }

        .miniLinks {
          position: fixed;
          right: 26px;
          bottom: 22px;
          z-index: 30;
          text-align: left;
          user-select: none;
        }
        .miniLinks .title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: rgba(10, 10, 10, 0.55);
          margin: 0 0 10px;
          text-transform: uppercase;
        }
        .miniRow {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
        }
        .miniIcon {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(10, 10, 10, 0.1);
          flex: 0 0 auto;
          background: #fff;
        }
        .miniIcon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .miniMono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
            "Courier New", monospace;
          font-size: 14px;
          letter-spacing: 0.02em;
          color: rgba(10, 10, 10, 0.55);
          text-decoration: none;
          line-height: 1.2;
        }
        .miniMono:hover {
          color: rgba(10, 10, 10, 0.85);
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        #confetti {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 25;
        }

        @media (max-width: 560px) {
          .stage {
            padding: 24px 18px 22px;
            gap: 12px;
          }
          .avatarLink {
            width: 140px;
            height: 140px;
            border-radius: 24px;
          }
          .handleLink {
            font-size: 26px;
          }
          .bio {
            font-size: 14px;
          }
          .actions {
            padding: 16px 18px;
          }
          .miniLinks {
            right: 14px;
            bottom: 12px;
          }
          .miniMono {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}
