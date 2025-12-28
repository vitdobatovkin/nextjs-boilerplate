"use client";

import React from "react";

export default function Page() {
  return (
    <>
      <div className="texture" aria-hidden="true" />
      <canvas id="confetti" aria-hidden="true" />

      <div className="wrap">
        <div className="hero">
          <div className="tag">2026 EDITION</div>
          <h1>How based are you in 2026?</h1>
          <p className="sub">
            Tap <b>Based me</b> — quick spin, and we’ll rate how based you are.
          </p>
        </div>

        <section className="panel" aria-label="Based generator">
          <div className="stage" id="stage" aria-live="polite">
            <div className="congratsText" id="congratsText">
              Congratulations
            </div>

            <a className="avatarLink" id="avatarLink" href="#" target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="img" alt="avatar" />
            </a>

            <div className="meta">
              <a className="handleLink" id="handleLink" href="#" target="_blank" rel="noreferrer">
                @…
              </a>
              <div className="bio" id="bio">
                Tap the button below.
              </div>
              <div className="basedLine" id="basedLine">
                You are based as{" "}
                <a id="basedAs" href="#" target="_blank" rel="noreferrer">
                  @…
                </a>
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="btns">
              <button className="primary" id="btn">
                Based me
              </button>
              <button className="share" id="shareBtn" style={{ display: "none" }}>
                Share on X
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Minimal socials bottom-right */}
      <div className="miniLinks" aria-label="Social links">
        <div className="title">Socials</div>

        <div className="miniRow">
          <span className="miniIcon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              id="creatorImg"
              src="https://pbs.twimg.com/profile_images/2003823220412026880/6UDZykCm_400x400.jpg"
              alt="creator avatar"
            />
          </span>
          <a className="miniMono" id="creatorLink" href="https://x.com/0x_mura" target="_blank" rel="noreferrer">
            CREATED BY
          </a>
        </div>

        <div className="miniRow">
          <span className="miniIcon" aria-hidden="true" id="baseIcon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Base"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect x='2' y='2' width='16' height='16' rx='5' fill='%230000FF'/%3E%3C/svg%3E"
            />
          </span>
          <a className="miniMono" id="baseLink" href="https://base.app/invite/muraa/HCR6DPRH" target="_blank" rel="noreferrer">
            BASE APP
          </a>
        </div>
      </div>

      <ScriptBlock />

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
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
            monospace;
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

function ScriptBlock() {
  React.useEffect(() => {
    const DEFAULT_AVATAR = "https://pbs.twimg.com/profile_images/1868572161415532544/n1z9sXm4_400x400.jpg";

    // ============================
    // PUT YOUR RAW_PARTICIPANTS HERE
    // ============================
    const RAW_PARTICIPANTS = [
    { handle:"@brian_armstrong", image:"https://pbs.twimg.com/profile_images/1516832438818770944/n77EwnKU_400x400.png", bio:"Co-founder & CEO at Coinbase" },
   
  ];

    function sanitize(raw: Array<{ handle: string; image?: string; bio?: string }>) {
      const out: Array<{ handle: string; image: string; bio: string }> = [];
      const seen = new Set<string>();
      for (const p of raw) {
        if (!p || typeof p !== "object") continue;

        const handle = String(p.handle || "").trim();
        const image = String(p.image || "").trim();
        const bio = String(p.bio || "").trim();

        if (!handle.startsWith("@")) continue;

        const key = handle.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        out.push({ handle, image: image || DEFAULT_AVATAR, bio });
      }
      return out;
    }

    const people = sanitize(RAW_PARTICIPANTS);

    const stageEl = document.getElementById("stage") as HTMLDivElement | null;
    const imgEl = document.getElementById("img") as HTMLImageElement | null;
    const handleLinkEl = document.getElementById("handleLink") as HTMLAnchorElement | null;
    const avatarLinkEl = document.getElementById("avatarLink") as HTMLAnchorElement | null;
    const bioEl = document.getElementById("bio") as HTMLDivElement | null;
    const btn = document.getElementById("btn") as HTMLButtonElement | null;
    const basedAsEl = document.getElementById("basedAs") as HTMLAnchorElement | null;

    const shareBtn = document.getElementById("shareBtn") as HTMLButtonElement | null;
    let lastWinner: { handle: string; image: string; bio: string } | null = null;

    function profileUrl(handle: string) {
      const u = String(handle || "").replace(/^@/, "");
      return `https://x.com/${u}`;
    }

    function show(p: { handle: string; image: string; bio: string }) {
      if (!imgEl || !handleLinkEl || !avatarLinkEl || !bioEl || !basedAsEl) return;

      imgEl.src = p.image || DEFAULT_AVATAR;

      const url = profileUrl(p.handle);
      handleLinkEl.textContent = p.handle;
      handleLinkEl.href = url;
      avatarLinkEl.href = url;

      bioEl.textContent = p.bio || "";
      basedAsEl.textContent = p.handle;
      basedAsEl.href = url;
    }

    function sleep(ms: number) {
      return new Promise((r) => setTimeout(r, ms));
    }

    function buildXShareUrl(winner: { handle: string; image: string; bio: string }) {
        const text = `I’m based as ${winner.handle} 😎\nHow based are you in 2026?`;

        const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");
        const shareLink =
            `${base}/r?handle=${encodeURIComponent(winner.handle)}` +
            `&bio=${encodeURIComponent(winner.bio || "")}` +
            `&img=${encodeURIComponent(winner.image || "")}`;

        const intent = new URL("https://x.com/intent/tweet");
        intent.searchParams.set("text", text);
        intent.searchParams.set("url", shareLink);
        return intent.toString();
    }


    shareBtn?.addEventListener("click", () => {
      if (!lastWinner) return;
      const shareUrl = buildXShareUrl(lastWinner);
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    });

    // ========= FULLSCREEN CONFETTI =========
    const confettiCanvas = document.getElementById("confetti") as HTMLCanvasElement | null;
    const ctx = confettiCanvas?.getContext("2d") || null;

    function resizeConfetti() {
      if (!confettiCanvas || !ctx) return;
      confettiCanvas.width = Math.floor(window.innerWidth * devicePixelRatio);
      confettiCanvas.height = Math.floor(window.innerHeight * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    window.addEventListener("resize", resizeConfetti);
    resizeConfetti();

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    const CONFETTI_COLORS = ["#0000FF", "#00D54B", "#FFD12F", "#FF3B30", "#A7FF5A"];

    let confettiParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      g: number;
      w: number;
      h: number;
      rot: number;
      vr: number;
      alpha: number;
      fade: number;
      color: string;
    }> = [];
    let confettiRaf: number | null = null;
    let confettiUntil = 0;

    function spawnConfetti(count: number) {
      for (let i = 0; i < count; i++) {
        confettiParticles.push({
          x: rand(0, window.innerWidth),
          y: rand(-window.innerHeight * 0.6, -10),
          vx: rand(-0.8, 0.8),
          vy: rand(2.2, 5.4),
          g: rand(0.015, 0.035),
          w: rand(5, 10),
          h: rand(6, 16),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.18, 0.18),
          alpha: 1,
          fade: rand(0.004, 0.01),
          color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0]
        });
      }
    }

    function tickConfetti(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (t < confettiUntil) {
        spawnConfetti(6);
      }

      for (const p of confettiParticles) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.alpha = Math.max(0, p.alpha - p.fade);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      confettiParticles = confettiParticles.filter(
        (p) => p.alpha > 0 && p.y < window.innerHeight + 60 && p.x > -60 && p.x < window.innerWidth + 60
      );

      if (t < confettiUntil || confettiParticles.length > 0) {
        confettiRaf = requestAnimationFrame(tickConfetti);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        confettiRaf = null;
        confettiParticles = [];
      }
    }

    function launchConfettiFull() {
      resizeConfetti();
      const now = performance.now();
      confettiUntil = now + 2200;
      spawnConfetti(220);
      if (!confettiRaf) confettiRaf = requestAnimationFrame(tickConfetti);
    }

    function init() {
      if (!imgEl || !handleLinkEl || !avatarLinkEl || !bioEl) return;

      imgEl.src = DEFAULT_AVATAR;
      handleLinkEl.textContent = "@…";
      handleLinkEl.href = "#";
      avatarLinkEl.href = "#";
      bioEl.textContent = "Tap the button below.";

      stageEl?.classList.remove("celebrate");

      lastWinner = null;
      if (shareBtn) shareBtn.style.display = "none";
    }

    async function spin() {
      if (people.length === 0) return;

      stageEl?.classList.remove("celebrate");
      if (btn) btn.disabled = true;
      if (shareBtn) shareBtn.style.display = "none";
      lastWinner = null;

      const winner = people[Math.floor(Math.random() * people.length)];

      for (let i = 0; i < 22; i++) {
        show(people[Math.floor(Math.random() * people.length)]);
        await sleep(45);
      }
      for (let i = 0; i < 12; i++) {
        show(people[Math.floor(Math.random() * people.length)]);
        await sleep(85 + i * 18);
      }

      show(winner);

      lastWinner = winner;
      if (shareBtn) shareBtn.style.display = "inline-block";

      stageEl?.classList.add("celebrate");
      launchConfettiFull();

      if (btn) btn.disabled = false;
    }

    btn?.addEventListener("click", spin);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !btn?.disabled) spin();
    });

    init();

    // preload
    for (const p of people) {
      const im = new Image();
      im.src = p.image;
    }

    return () => {
      window.removeEventListener("resize", resizeConfetti);
    };
  }, []);

  return null;
}
