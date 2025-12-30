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
  return handle.replace(/^@/, "").toLowerCase().replace(/[^a-z0-9_]/g, "");
}

function localAvatarSrc(handle?: string) {
  return handle ? `/avatars/${handleToSlug(handle)}.png` : "/avatars/default.png";
}

function avatarSrc(p?: Person | null) {
  if (!p) return "/avatars/default.png";
  return p.image || localAvatarSrc(p.handle);
}

function profileUrl(handle: string) {
  return `https://x.com/${handle.replace(/^@/, "")}`;
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

function preload(src: string) {
  const img = new Image();
  img.src = src;
}

// ===== CONFETTI =====
function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    let raf = 0;
    const parts = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * c.width,
      y: -20,
      vx: Math.random() - 0.5,
      vy: Math.random() * 4 + 2,
      a: 1,
    }));

    function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.a -= 0.008;
        ctx.globalAlpha = Math.max(p.a, 0);
        ctx.fillRect(p.x, p.y, 4, 6);
      });
      if (parts.some(p => p.a > 0)) raf = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return canvasRef;
}

type Mode = "idle" | "spinning" | "locked";

export default function HomePage() {
  const people = useMemo(() => sanitize(RAW_PARTICIPANTS), []);
  const canvasRef = useConfetti();

  const [mode, setMode] = useState<Mode>("idle");
  const [winner, setWinner] = useState<Person | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  // ===== Reel math =====
  const TILE = 200;
  const GAP = 24;
  const STEP = TILE + GAP;
  const WINDOW = 9;
  const HALF = Math.floor(WINDOW / 2);

  const phaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    people.forEach(p => preload(avatarSrc(p)));
    startLoop();
    return stopLoop;
    // eslint-disable-next-line
  }, []);

  function startLoop() {
    if (rafRef.current) return;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (mode === "idle") phaseRef.current += STEP * 0.01;
      force(x => x + 1);
    };
    tick();
  }

  function stopLoop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  function spin() {
    if (!people.length) return;

    setMode("spinning");
    setHasSpun(true);

    const idx = Math.floor(Math.random() * people.length);
    const target = Math.floor(phaseRef.current / STEP) + mod(idx, people.length);

    const start = phaseRef.current;
    const end = target * STEP;
    const t0 = performance.now();
    const dur = 2200;

    function animate(t: number) {
      const k = clamp((t - t0) / dur, 0, 1);
      phaseRef.current = start + (end - start) * easeOutCubic(k);
      force(x => x + 1);
      if (k < 1) requestAnimationFrame(animate);
      else {
        setWinner(people[idx]);
        setMode("locked");
      }
    }
    requestAnimationFrame(animate);
  }

  const baseIndex = Math.floor(phaseRef.current / STEP);
  const offset = -(phaseRef.current % STEP);
  const centerPerson = people[mod(baseIndex, people.length)];
  const shown = mode === "locked" ? winner : centerPerson;

  return (
    <>
      <canvas ref={canvasRef} className="confetti" />
      <div className="wrap">
        <h1>How based are you in 2026?</h1>

        <div className="panel">
          {!hasSpun && (
            <div className="carouselHintTop">
              Spinning through the most based builders on X
            </div>
          )}

          <div className="reel">
            {Array.from({ length: WINDOW }).map((_, i) => {
              const p = people[mod(baseIndex + i - HALF, people.length)];
              const x = (i - HALF) * STEP + offset;
              return (
                <div
                  key={i}
                  className={`tile ${i === HALF && mode === "locked" ? "winner" : ""}`}
                  style={{ transform: `translateX(${x}px)` }}
                >
                  <img src={avatarSrc(p)} />
                </div>
              );
            })}
          </div>

          {!hasSpun && (
            <div className="carouselHintBottom">
              Spin to find which one you’re most based as
            </div>
          )}

          {mode === "locked" && shown && (
            <div className="result">
              <div className="handle">{shown.handle}</div>
              <div className="bio">{shown.bio}</div>
            </div>
          )}

          <button onClick={spin} className="primary">
            Based me
          </button>
        </div>

        <div className="creator">
          Created by <b>0x_mura</b>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
          background: #fff;
        }
        .wrap {
          padding: 40px 20px;
          text-align: center;
        }
        h1 {
          font-size: 64px;
          margin-bottom: 40px;
        }
        .panel {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 32px;
          background: #fff;
          box-shadow: 0 30px 80px rgba(0,0,0,.1);
        }
        .carouselHintTop {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(0,0,0,.45);
          margin-bottom: 10px;
        }
        .carouselHintBottom {
          font-size: 14px;
          color: rgba(0,0,0,.6);
          margin-top: 10px;
        }
        .reel {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .tile {
          position: absolute;
          top: 50%;
          width: 200px;
          height: 200px;
          margin-top: -100px;
          border-radius: 40px;
          overflow: hidden;
          background: #eee;
        }
        .tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tile.winner {
          box-shadow: 0 40px 120px rgba(0,0,255,.3);
        }
        .primary {
          margin-top: 30px;
          padding: 14px 24px;
          border-radius: 16px;
          background: blue;
          color: #fff;
          font-weight: 800;
          border: none;
          cursor: pointer;
        }
        .creator {
          margin-top: 40px;
          font-size: 13px;
          color: rgba(0,0,0,.5);
        }
        .confetti {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
