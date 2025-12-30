"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { RAW_PARTICIPANTS, type Person } from "./participants";

const DEFAULT_BIO = "How based are you in 2026?";

// ---------- helpers ----------
function sanitize(list: Person[]): Person[] {
  const out: Person[] = [];
  const seen = new Set<string>();

  for (const p of list || []) {
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

function handleToSlug(handle: string) {
  const raw = (handle || "").trim().replace(/^@/, "").toLowerCase();
  const safe = raw.replace(/[^a-z0-9_]/g, "");
  return safe || "default";
}

function localAvatarSrc(handle?: string) {
  if (!handle) return "/avatars/default.png";
  return `/avatars/${handleToSlug(handle)}.png`;
}

function profileUrl(handle: string) {
  return `https://x.com/${handle.replace(/^@/, "")}`;
}

function buildSharePageUrl(winner: { handle: string; bio?: string }) {
  const base = window.location.origin;
  const u = new URL("/r", base);

  u.searchParams.set("handle", winner.handle);
  u.searchParams.set("bio", winner.bio || DEFAULT_BIO);
  u.searchParams.set("v", String(Date.now()));

  return u.toString();
}

function preload(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

function buildXIntentUrl(winner: { handle: string; bio?: string }) {
  const sharePageUrl = buildSharePageUrl(winner);
  const text = `I’m based as ${winner.handle} 😎\nHow based are you in 2026?`;

  const intent = new URL("https://x.com/intent/post");
  intent.searchParams.set("text", text);
  intent.searchParams.set("url", sharePageUrl);
  return intent.toString();
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ===== CONFETTI (fullscreen) =====
type ConfettiParticle = {
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
};

function useFullscreenConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const untilRef = useRef<number>(0);
  const partsRef = useRef<ConfettiParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      partsRef.current = [];
    };
  }, []);

  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  const COLORS = ["#0000FF", "#00D54B", "#FFD12F", "#FF3B30", "#A7FF5A"];

  const spawn = (count: number) => {
    for (let i = 0; i < count; i++) {
      partsRef.current.push({
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
        color: COLORS[(Math.random() * COLORS.length) | 0],
      });
    }
  };

  const tick = (t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (t < untilRef.current) spawn(6);

    const next: ConfettiParticle[] = [];
    for (const p of partsRef.current) {
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

      if (
        p.alpha > 0 &&
        p.y < window.innerHeight + 60 &&
        p.x > -60 &&
        p.x < window.innerWidth + 60
      ) {
        next.push(p);
      }
    }
    partsRef.current = next;

    if (t < untilRef.current || partsRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      rafRef.current = null;
      partsRef.current = [];
    }
  };

  const launch = () => {
    untilRef.current = performance.now() + 2200;
    spawn(220);
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  };

  return { canvasRef, launch };
}

type Mode = "idle" | "spinning" | "locked";

export default function HomePage() {
  const people = useMemo(() => sanitize(RAW_PARTICIPANTS), []);
  const { canvasRef, launch } = useFullscreenConfetti();

  const [current, setCurrent] = useState<Person | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const lastWinnerRef = useRef<Person | null>(null);

  // ===== Reel parameters (reduced ~30%) =====
  const TILE = 240; // was 340
  const GAP = 28;
  const STEP = TILE + GAP;

  const WINDOW = 9; // can show more now
  const HALF = Math.floor(WINDOW / 2);

  // ===== Continuous phase-based reel =====
  const phasePxRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(0);

  const tweenRef = useRef<{
    active: boolean;
    startPhase: number;
    endPhase: number;
    t0: number;
    dur: number;
    winnerIndex: number;
  }>({
    active: false,
    startPhase: 0,
    endPhase: 0,
    t0: 0,
    dur: 0,
    winnerIndex: 0,
  });

  const [, forceFrame] = useState(0);

  useEffect(() => {
    preload("/avatars/default.png");
  }, []);

  useEffect(() => {
    if (!people.length) return;

    const startIndex = (Math.random() * people.length) | 0;
    const startFrac = Math.random();
    phasePxRef.current = (startIndex + startFrac) * STEP;

    for (let d = -18; d <= 18; d++) {
      const p = people[mod(startIndex + d, people.length)];
      if (p) preload(localAvatarSrc(p.handle));
    }

    setCurrent(people[startIndex] ?? null);

    startLoop();
    return () => stopLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people.length]);

  function stopLoop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTRef.current = 0;
  }

  function startLoop() {
    if (rafRef.current) return;

    const tick = (t: number) => {
      rafRef.current = requestAnimationFrame(tick);

      const len = people.length;
      if (!len) return;

      const last = lastTRef.current || t;
      const dt = clamp((t - last) / 1000, 0, 0.05);
      lastTRef.current = t;

      if (tweenRef.current.active) {
        const tw = tweenRef.current;
        const tt = clamp((t - tw.t0) / tw.dur, 0, 1);
        const e = easeOutCubic(tt);
        phasePxRef.current = tw.startPhase + (tw.endPhase - tw.startPhase) * e;

        if (tt >= 1) {
          phasePxRef.current = tw.endPhase;
          tweenRef.current.active = false;

          const winner = people[tw.winnerIndex];
          lastWinnerRef.current = winner ?? null;
          setCurrent(winner ?? null);

          setCelebrate(true);
          setSpinning(false);
          setMode("locked");
          launch();

          stopLoop();
          return;
        }
      } else {
        if (mode === "idle") {
          const speedPx = STEP * 0.55;
          phasePxRef.current += speedPx * dt;
        }
      }

      if (phasePxRef.current > 1e12)
        phasePxRef.current = phasePxRef.current % (len * STEP);

      const baseIndex = Math.floor(phasePxRef.current / STEP);
      const centerIndex = mod(baseIndex + HALF, len);

      if (mode !== "locked") {
        const p = people[centerIndex];
        if (p && p.handle !== current?.handle) {
          setCurrent(p);
          for (let d = -18; d <= 18; d++) {
            const pp = people[mod(centerIndex + d, len)];
            if (pp) preload(localAvatarSrc(pp.handle));
          }
        }
      }

      // NOTE: we still re-render every frame for positioning
      forceFrame((x) => (x + 1) % 1_000_000);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  async function spin() {
    if (!people.length) return;
    if (spinning) return;

    setSpinning(true);
    setCelebrate(false);
    setMode("spinning");
    lastWinnerRef.current = null;

    startLoop();

    const len = people.length;
    const winnerIndex = (Math.random() * len) | 0;
    const winner = people[winnerIndex];
    if (winner) preload(localAvatarSrc(winner.handle));

    const startPhase = phasePxRef.current;
    const startBase = Math.floor(startPhase / STEP);

    const currentCenterIndex = mod(startBase + HALF, len);
    const forward = mod(winnerIndex - currentCenterIndex, len);

    const loops = 2 + ((Math.random() * 3) | 0);

    // ===== SNAP TO CENTER (endPhase strictly multiple of STEP) =====
    let endBase = startBase + forward;

    const snappedCandidatePhase = endBase * STEP;
    if (snappedCandidatePhase <= startPhase) endBase += 1;

    endBase += loops * len;

    const endPhase = endBase * STEP;

    tweenRef.current = {
      active: true,
      startPhase,
      endPhase,
      t0: performance.now(),
      dur: 2000 + loops * 520,
      winnerIndex,
    };
  }

  function onShare() {
    const w = lastWinnerRef.current;
    if (!w) return;
    window.open(buildXIntentUrl(w), "_blank", "noopener,noreferrer");
  }

  const url = current ? profileUrl(current.handle) : "#";

  const len = people.length;
  const phase = phasePxRef.current;

  const baseIndex = Math.floor(phase / STEP);
  const fracPx = phase - baseIndex * STEP;
  const offset = -fracPx;

  return (
    <>
      <div className="texture" aria-hidden="true"></div>
      <canvas ref={canvasRef} id="confetti" aria-hidden="true"></canvas>

      <div className="wrap">
        <div className="hero">
          <div className="tag">2026 EDITION</div>
          <h1>How based are you in 2026?</h1>
          <p className="sub">
            Tap <b>Based me</b> — quick spin, and we’ll rate how based you are.
          </p>
        </div>

        <section className="panel" aria-label="Based generator">
          <div
            className={`stage ${celebrate ? "celebrate" : ""} ${
              mode !== "locked" ? "animating" : ""
            }`}
            aria-live="polite"
          >
            <div className="congratsText">Congratulations</div>

            <div className="bigReel" aria-label="reel">
              <div className="bigReelTrack" role="presentation">
                {Array.from({ length: WINDOW }).map((_, i) => {
                  const virtualIndex = baseIndex + (i - HALF);
                  const idx = len ? mod(virtualIndex, len) : 0;
                  const p = people[idx];

                  const x = (i - HALF) * STEP + offset;
                  const dist = Math.abs(x) / STEP;

                  const isCenter = i === HALF;
                  const allowClick = mode === "locked" && isCenter && !!current;

                  // Winner emphasis when locked
                  const popScale = allowClick ? 1.12 : 1;
                  const popY = allowClick ? -18 : 0;

                  const opacity =
                    mode === "locked"
                      ? isCenter
                        ? 1
                        : 0.35
                      : clamp(1 - dist * 0.14, 0.18, 1);

                  return (
                    <a
                      key={i}
                      className={`bigTile ${allowClick ? "winner" : ""}`}
                      href={allowClick ? url : undefined}
                      target={allowClick ? "_blank" : undefined}
                      rel={allowClick ? "noreferrer" : undefined}
                      onClick={(e) => {
                        if (!allowClick) e.preventDefault();
                      }}
                      style={{
                        transform: `translate3d(${x}px, ${popY}px, 0) scale(${popScale})`,
                        opacity,
                        zIndex: isCenter ? 10 : 1,
                      }}
                      aria-label={p?.handle || "avatar"}
                    >
                      <img
                        alt={p?.handle || "avatar"}
                        src={localAvatarSrc(p?.handle)}
                        loading="eager"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/avatars/default.png";
                        }}
                      />
                      {allowClick && <div className="winnerBadge">WINNER</div>}
                    </a>
                  );
                })}
              </div>

              <div className="bigReelMask" aria-hidden="true"></div>
            </div>

            {mode === "locked" && current && (
              <div className="meta">
                <a className="handleLink" href={url} target="_blank" rel="noreferrer">
                  {current.handle}
                </a>
                <div className="bio">{current.bio || ""}</div>
                {celebrate && (
                  <div className="basedLine">
                    You are based as{" "}
                    <a href={url} target="_blank" rel="noreferrer">
                      {current.handle}
                    </a>
                  </div>
                )}
              </div>
            )}

            {mode !== "locked" && <div className="spacer" />}
          </div>

          <div className="actions">
            <div className="btns">
              <button className="primary" onClick={spin} disabled={!people.length}>
                {spinning ? "Spinning…" : "Based me"}
              </button>

              <button
                className="share"
                onClick={onShare}
                style={{ display: mode === "locked" ? "inline-block" : "none" }}
              >
                Share on X
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="creatorBadge">
        <a href="https://x.com/0x_mura" target="_blank" rel="noreferrer" className="creatorRow">
          <img
            src="https://pbs.twimg.com/profile_images/2003823220412026880/6UDZykCm_400x400.jpg"
            alt="0x_mura"
            className="creatorAvatar"
          />
          <span>
            Created by <b>@0x_mura</b>
          </span>
        </a>

        <a href="https://base.app/invite/muraa/HCR6DPRH" target="_blank" rel="noreferrer" className="baseJoin">
          Join Base App
        </a>
      </div>

      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --text: #0a0b0d;
          --muted: #5b616e;
          --line: #eef0f3;
          --blue: #0000ff;
          --card: #ffffff;
        }
        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }
        .texture{
          position:fixed; inset:0;
          pointer-events:none;
          background:
            radial-gradient(900px 520px at 62% 12%, rgba(10,71,255,.08), transparent 65%),
            repeating-linear-gradient(90deg, rgba(0,0,0,.035) 0 1px, transparent 1px 6px);
          opacity:.55;
          mix-blend-mode:multiply;
        }
        #confetti{
          position:fixed;
          inset:0;
          width:100vw;
          height:100vh;
          pointer-events:none;
          z-index: 25;
        }
        .wrap{
          min-height:100%;
          display:grid;
          place-items:center;
          padding: 28px 18px 44px;
        }
        .hero{
          width:min(980px, 100%);
          margin-bottom: 18px;
        }
        .tag{
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(10,10,10,.55);
          margin-bottom: 10px;
          text-align:center;
        }
        h1{
          margin:0;
          font-size: clamp(40px, 4.6vw, 72px);
          line-height: .94;
          letter-spacing: -.03em;
          font-weight: 900;
          text-align:center;
        }
        .sub{
          margin: 12px auto 0;
          max-width: 75ch;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.45;
          text-align:center;
        }
        .panel{
          width: min(1240px, 96vw);
          margin: 44px auto 0;
          border:1px solid var(--line);
          border-radius:32px;
          background:#fff;
          overflow:hidden;
          box-shadow: 0 26px 80px rgba(0,0,0,.10);
          position:relative;
        }
        .stage{
          display:flex;
          flex-direction: column;
          align-items:center;
          justify-content:center;
          gap: 18px;
          padding: 54px 72px 46px;
          text-align:center;
          position:relative;
        }
        .congratsText{
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(10,10,10,.55);
          height: 18px;
          opacity: 0;
          transition: opacity .18s ease;
        }
        .stage.celebrate .congratsText{ opacity: 1; }

        /* ===== REEL ===== */
        .bigReel{
          width: min(1180px, 96vw);
          height: 310px;
          position: relative;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .bigReelTrack{
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .bigTile{
          position: absolute;
          top: 50%;
          left: 50%;
          width: 240px;
          height: 240px;
          margin-left: -120px;
          margin-top: -120px;

          border-radius: 44px;
          overflow:hidden;
          border: 1px solid rgba(10,10,10,.10);
          background: var(--card);
          box-shadow: 0 18px 52px rgba(0,0,0,.08);

          display:block;
          will-change: transform, opacity;

          /* IMPORTANT: transitions are disabled during animation via .stage.animating */
          transition:
            transform .35s cubic-bezier(.2,.8,.2,1),
            opacity .25s ease,
            box-shadow .35s ease,
            border-color .35s ease;
        }
        .stage.animating .bigTile{
          transition: none !important;
        }

        .bigTile img{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
        }

        /* Winner highlight */
        .bigTile.winner{
          border-color: rgba(10,10,10,.22);
          box-shadow:
            0 50px 140px rgba(0,0,0,.28),
            0 0 0 3px rgba(0,0,255,.18);
        }

        .winnerBadge{
          position:absolute;
          left: 14px;
          top: 14px;
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(0,0,255,.95);
          color: #fff;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
          box-shadow: 0 12px 26px rgba(0,0,0,.16);
        }

        .bigReelMask{
          position:absolute;
          inset:0;
          pointer-events:none;
          border-radius: 28px;
          background:
            linear-gradient(90deg,
              rgba(255,255,255,.94),
              rgba(255,255,255,0) 22%,
              rgba(255,255,255,0) 78%,
              rgba(255,255,255,.94)
            );
          opacity: .68;
        }

        .meta{ margin-top: 10px; }
        .handleLink{
          display:inline-block;
          text-decoration:none;
          color: var(--text);
          font-size: 44px;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1.02;
        }
        .bio{
          margin-top:14px;
          font-size:18px;
          color: var(--muted);
          line-height:1.65;
        }
        .basedLine{
          margin-top: 10px;
          font-size: 14px;
          color: rgba(10,10,10,.55);
        }
        .basedLine a{
          color: rgba(10,10,10,.85);
          text-decoration:none;
          font-weight: 950;
          border-bottom:1px solid rgba(10,10,10,.18);
        }
        .spacer{ height: 1px; }

        .actions{
          display:flex;
          padding:24px 72px 28px;
          border-top:1px solid var(--line);
          background: rgba(246,247,248,.55);
          justify-content:center;
          align-items:center;
        }
        .btns{
          display:flex;
          justify-content:center;
          align-items:center;
          width:100%;
          gap:12px;
          flex-wrap:wrap;
        }
        button{
          border:1px solid transparent;
          border-radius:16px;
          padding:14px 22px;
          font-weight:950;
          cursor:pointer;
          font-size:16px;
          letter-spacing: -0.01em;
        }
        .primary{
          background: var(--blue);
          color:#fff;
          box-shadow: 0 14px 34px rgba(10,71,255,.22);
        }
        .primary:disabled{ opacity:.6; cursor:not-allowed; box-shadow:none; }
        .share{
          background:#fff;
          color: var(--text);
          border:1px solid rgba(10,10,10,.14);
          box-shadow: 0 10px 26px rgba(0,0,0,.06);
        }

        /* creator badge */
        .creatorBadge{
          position: fixed;
          right: 20px;
          bottom: 18px;
          z-index: 40;

          display: flex;
          align-items: center;
          gap: 10px;

          font-size: 13px;
          line-height: 1;
        }
        .creatorRow{
          display: flex;
          align-items: center;
          gap: 8px;

          text-decoration: none;
          color: rgba(10,10,10,.55);
        }
        .creatorRow:hover{
          color: rgba(10,10,10,.85);
        }
        .creatorAvatar{
          width: 22px;
          height: 22px;
          border-radius: 999px;
          object-fit: cover;
        }
        .creatorRow b{
          font-weight: 800;
          color: rgba(10,10,10,.75);
        }
        .baseJoin{
          position: relative;
          padding-left: 14px;

          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          color: rgba(10,10,10,.45);
        }
        .baseJoin::before{
          content: "·";
          position: absolute;
          left: 4px;
          color: rgba(10,10,10,.35);
        }
        .baseJoin:hover{
          color: rgba(10,10,10,.8);
        }

        @media (max-width: 560px){
          .stage{ padding:24px 18px 22px; gap:12px; }
          .actions{ padding:16px 18px; }

          .bigReel{ height: 220px; }

          .bigTile{
            width: 160px;
            height: 160px;
            margin-left: -80px;
            margin-top: -80px;
            border-radius: 34px;
          }

          .handleLink{ font-size:26px; }
          .bio{ font-size:14px; }

          .creatorBadge{
            right: 14px;
            bottom: 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}
