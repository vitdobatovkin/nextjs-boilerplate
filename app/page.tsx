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

  // --- reel animation refs ---
  const rafReelRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(0);
  const posRef = useRef<number>(0); // float index
  const liveIndexRef = useRef<number>(0);

  // spin tween
  const tweenRef = useRef<{
    active: boolean;
    startPos: number;
    endPos: number;
    t0: number;
    dur: number;
    winnerIndex: number;
  }>({
    active: false,
    startPos: 0,
    endPos: 0,
    t0: 0,
    dur: 0,
    winnerIndex: 0,
  });

  // force re-render during animation
  const [, forceFrame] = useState(0);

  useEffect(() => {
    preload("/avatars/default.png");
  }, []);

  useEffect(() => {
    if (!people.length) return;

    const start = (Math.random() * people.length) | 0;
    posRef.current = start + 0.0;
    liveIndexRef.current = mod(Math.round(posRef.current), people.length);

    // preload around start
    for (let d = -12; d <= 12; d++) {
      const p = people[mod(start + d, people.length)];
      if (p) preload(localAvatarSrc(p.handle));
    }

    // показываем картинку в центре (мета скрыта, пока не locked)
    setCurrent(people[liveIndexRef.current] ?? null);

    startReelLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people.length]);

  useEffect(() => {
    return () => {
      if (rafReelRef.current) cancelAnimationFrame(rafReelRef.current);
      rafReelRef.current = null;
    };
  }, []);

  function stopReelLoop() {
    if (rafReelRef.current) cancelAnimationFrame(rafReelRef.current);
    rafReelRef.current = null;
    lastTRef.current = 0;
  }

  function startReelLoop() {
    if (rafReelRef.current) return;

    const tick = (t: number) => {
      rafReelRef.current = requestAnimationFrame(tick);

      const len = people.length;
      if (!len) return;

      const last = lastTRef.current || t;
      const dt = clamp((t - last) / 1000, 0, 0.05);
      lastTRef.current = t;

      if (tweenRef.current.active) {
        const tw = tweenRef.current;
        const tt = clamp((t - tw.t0) / tw.dur, 0, 1);
        const e = easeOutCubic(tt);
        posRef.current = tw.startPos + (tw.endPos - tw.startPos) * e;

        if (tt >= 1) {
          posRef.current = tw.endPos;
          tweenRef.current.active = false;

          const winner = people[tw.winnerIndex];
          lastWinnerRef.current = winner ?? null;
          setCurrent(winner ?? null);

          setCelebrate(true);
          setSpinning(false);
          setMode("locked");
          launch();

          // стоп до следующего клика
          stopReelLoop();
          return;
        }
      } else {
        if (mode === "idle") {
          // медленно и плавно
          posRef.current += dt * 0.6;
        }
      }

      if (posRef.current > 1e9) posRef.current = mod(posRef.current, len);

      // обновляем center-аватар по ближайшему индексу
      const idx = mod(Math.round(posRef.current), len);
      if (idx !== liveIndexRef.current) {
        liveIndexRef.current = idx;
        const p = people[idx];
        if (p) {
          setCurrent(p);
          // preload neighbors
          for (let d = -12; d <= 12; d++) {
            const pp = people[mod(idx + d, len)];
            if (pp) preload(localAvatarSrc(pp.handle));
          }
        }
      }

      forceFrame((x) => (x + 1) % 1_000_000);
    };

    rafReelRef.current = requestAnimationFrame(tick);
  }

  async function spin() {
    if (!people.length) return;
    if (spinning) return;

    setSpinning(true);
    setCelebrate(false);
    setMode("spinning");
    lastWinnerRef.current = null;

    // запускаем луп если стояли
    startReelLoop();

    const len = people.length;
    const winnerIndex = (Math.random() * len) | 0;
    const winner = people[winnerIndex];
    if (winner) preload(localAvatarSrc(winner.handle));

    const startPos = posRef.current;
    const startIndex = mod(Math.round(startPos), len);
    const forward = mod(winnerIndex - startIndex, len);

    const loops = 2 + ((Math.random() * 3) | 0); // 2..4
    const distance = loops * len + forward;

    const endPos = Math.floor(startPos) + distance;

    tweenRef.current = {
      active: true,
      startPos,
      endPos,
      t0: performance.now(),
      dur: 1900 + loops * 420,
      winnerIndex,
    };
  }

  function onShare() {
    const w = lastWinnerRef.current;
    if (!w) return;
    window.open(buildXIntentUrl(w), "_blank", "noopener,noreferrer");
  }

  const url = current ? profileUrl(current.handle) : "#";

  // ---- render window around pos ----
  const len = people.length;
  const pos = posRef.current;
  const base = Math.floor(pos);
  const frac = pos - base;

  // size/spacing
  const WINDOW = 9; // боковых карточек (не слишком много)
  const HALF = Math.floor(WINDOW / 2);

  // базовый шаг (как далеко стоят карточки)
  const STEP = 98;

  // "дырка" вокруг центра, чтобы НИЧЕГО не залезало под большую карточку
  // (подобрано под центр 260 и боковые 78 + зазор)
  const CENTER_HOLE = 190;

  // center avatar src
  const centerPerson = current ?? null;

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
          <div className={`stage ${celebrate ? "celebrate" : ""}`} aria-live="polite">
            <div className="congratsText">Congratulations</div>

            {/* SLOT AREA */}
            <div className="slotWrap" aria-label="slot reel">
              {/* moving strip */}
              <div className="slotStrip">
                {Array.from({ length: WINDOW }).map((_, i) => {
                  const offset = i - HALF; // -4..4
                  const idx = len ? mod(base + offset, len) : 0;
                  const p = people[idx];

                  let x = (offset - frac) * STEP;

                  // ВАЖНО: убираем пересечение — отталкиваем элементы от центра
                  if (Math.abs(x) < CENTER_HOLE) {
                    x = (x < 0 ? -1 : 1) * CENTER_HOLE;
                  }

                  const dist = Math.abs(offset - frac);
                  const opacity = clamp(1 - dist * 0.18, 0.25, 1);

                  // кликабельность только когда результат зафиксирован и центр кликается
                  const allowClick = false;

                  return (
                    <a
                      key={`${idx}-${offset}`}
                      className="slotSmall"
                      href={allowClick ? url : undefined}
                      target={allowClick ? "_blank" : undefined}
                      rel={allowClick ? "noreferrer" : undefined}
                      onClick={(e) => e.preventDefault()}
                      style={{
                        transform: `translate3d(${x}px,0,0)`,
                        opacity,
                      }}
                      aria-label={p?.handle || "avatar"}
                    >
                      <img
                        alt={p?.handle || "avatar"}
                        src={localAvatarSrc(p?.handle)}
                        loading="eager"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/avatars/default.png";
                        }}
                      />
                    </a>
                  );
                })}
              </div>

              {/* big center card (always visible), no overlap because strip is pushed away */}
              <a
                className="slotCenter"
                href={mode === "locked" && centerPerson ? url : undefined}
                target={mode === "locked" && centerPerson ? "_blank" : undefined}
                rel={mode === "locked" && centerPerson ? "noreferrer" : undefined}
                onClick={(e) => {
                  if (!(mode === "locked" && centerPerson)) e.preventDefault();
                }}
                aria-label="center avatar"
              >
                <img
                  alt={centerPerson?.handle || "avatar"}
                  src={localAvatarSrc(centerPerson?.handle)}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/avatars/default.png";
                  }}
                />
              </a>

              {/* soft edge mask */}
              <div className="slotMask" aria-hidden="true"></div>
            </div>

            {/* META: только в конце */}
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

            {/* пока крутится/idle — ничего не показываем кроме ленты */}
            {mode !== "locked" && <div className="hint"> </div>}
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

      {/* creator badge bottom-right */}
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
          padding: 64px 72px 54px;
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

        /* ===== SLOT (previous vibe) ===== */
        .slotWrap{
          width: min(860px, 92vw);
          height: 300px;
          position: relative;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .slotStrip{
          position:absolute;
          inset:0;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }

        .slotSmall{
          position:absolute;
          top: 50%;
          left: 50%;
          width: 78px;
          height: 78px;
          margin-left: -39px;
          margin-top: -39px;
          border-radius: 18px;
          overflow:hidden;
          border: 1px solid rgba(10,10,10,.10);
          background: var(--card);
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
          display:block;
          will-change: transform, opacity;
        }
        .slotSmall img{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
        }

        .slotCenter{
          position: relative;
          width: 260px;
          height: 260px;
          border-radius: 40px;
          overflow:hidden;
          border: 1px solid rgba(10,10,10,.12);
          background: var(--card);
          box-shadow: 0 22px 58px rgba(0,0,0,.10);
          z-index: 5;
          display:block;
        }
        .slotCenter img{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
        }

        .slotMask{
          position:absolute;
          inset:0;
          pointer-events:none;
          border-radius: 28px;
          background:
            linear-gradient(90deg,
              rgba(255,255,255,.90),
              rgba(255,255,255,0) 18%,
              rgba(255,255,255,0) 82%,
              rgba(255,255,255,.90)
            );
          opacity: .62;
          z-index: 6;
        }

        .meta{
          margin-top: 10px;
        }
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
        .hint{ height: 1px; }

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

        /* creator badge (как у тебя) */
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

          .slotWrap{ height: 220px; }

          .slotSmall{
            width: 54px;
            height: 54px;
            margin-left: -27px;
            margin-top: -27px;
            border-radius: 14px;
          }

          .slotCenter{
            width: 150px;
            height: 150px;
            border-radius: 24px;
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
