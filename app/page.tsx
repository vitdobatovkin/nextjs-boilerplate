"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Person = { handle: string; image?: string; bio?: string };

const DEFAULT_BIO = "How based are you in 2026?";

// ============================
// PUT YOUR RAW_PARTICIPANTS HERE
// ============================
const RAW_PARTICIPANTS: Person[] = [
  { handle:"@brian_armstrong", image:"https://pbs.twimg.com/profile_images/1516832438818770944/n77EwnKU_400x400.png", bio:"Co-founder & CEO at Coinbase" },
    { handle:"@emiliemc", image:"https://pbs.twimg.com/profile_images/1623399970287284224/A5DmX2nx_400x400.jpg", bio:"President and COO at Coinbase, Angel Investor" },
    { handle:"@catferdon", image:"https://pbs.twimg.com/profile_images/570956786867396608/Ksld22NC_400x400.jpeg", bio:"cmo coinbase" },
    { handle:"@maxbranzburg", image:"https://pbs.twimg.com/profile_images/1640358235931541506/UbOccG9U_400x400.jpg", bio:"consumer & business products coinbase" },
    { handle:"@ShanAggarwal", image:"https://pbs.twimg.com/profile_images/1897730647378014208/nA2ih7KS_400x400.jpg", bio:"chief business officer coinbase" },
    { handle:"@faryarshirzad", image:"https://pbs.twimg.com/profile_images/1930336640544722944/PLA2b1k1_400x400.jpg", bio:"Chief Policy Officer coinbase" },
    { handle:"@antoniogm", image:"https://pbs.twimg.com/profile_images/1789393888278683648/0vAi6k80_400x400.jpg", bio:"Director base Ads" },
    { handle:"@drewcoffman", image:"https://pbs.twimg.com/profile_images/1877964530904715264/sbitBnjc_400x400.jpg", bio:"thinking deeply about social and storytelling at Base" },
    { handle:"@jessepollak", image:"https://pbs.twimg.com/profile_images/1879556312822120448/QngrqCSC_400x400.jpg", bio:"base builder #001" },
    { handle:"@oyealmond", image:"https://pbs.twimg.com/profile_images/1502086651761283108/3Z6kvFZI_400x400.jpg", bio:"Country Lead de Base" },
    { handle:"@benlambert08", image:"https://pbs.twimg.com/profile_images/1998959125544480768/k5Mwzo71_400x400.jpg", bio:"Head of Legal Base" },
    { handle:"@deriq_eth", image:"https://pbs.twimg.com/profile_images/1999821202768982016/P-8_mcR8_400x400.jpg", bio:"Building cool things base" },
    { handle:"@chintanturakhia", image:"https://pbs.twimg.com/profile_images/1883614781556568064/p2OenYCH_400x400.jpg", bio:"Head of Eng baseapp" },
    { handle:"@saxenasaheb", image:"https://pbs.twimg.com/profile_images/1909923453936738304/2nG5Ycc5_400x400.jpg", bio:"bangalore boy" },
    { handle:"@wyneseoo", image:"https://pbs.twimg.com/profile_images/1823914518629740544/JWkLhu67_400x400.jpg", bio:"Growth Analyst base" },
    { handle:"@berkay_secil", image:"https://pbs.twimg.com/profile_images/1951314637598699521/szNWahA__400x400.jpg", bio:"Base Regional Lead" },
    { handle:"@Saldasoro", image:"https://pbs.twimg.com/profile_images/1981399877998223360/AqEJZKzE_400x400.jpg", bio:"Base Country Lead, Argentina" },
    { handle:"@carlosjmelgar", image:"https://pbs.twimg.com/profile_images/1945107780529967104/lg3QMIfr_400x400.jpg", bio:"Base Regional Lead" },
    { handle:"@WilsonCusack", image:"https://pbs.twimg.com/profile_images/1736440090795163648/5B8OVg6X_400x400.png", bio:"Workin, on Base" },
    { handle:"@jconnorholliman", image:"https://pbs.twimg.com/profile_images/1934612979934519296/sbNYdqP9_400x400.jpg", bio:"Onchain Recruiter for base international & ecosystems" },
    { handle:"@oaktoebark", image:"https://pbs.twimg.com/profile_images/1925301743602249728/_Ino8C0B_400x400.jpg", bio:"invert everything | PM base" },
    { handle:"@sohey_eth", image:"https://pbs.twimg.com/profile_images/1943681841187225600/TBF1gJBF_400x400.jpg", bio:"Base DevRel - Proudly" },
    { handle:"@XenBH", image:"https://pbs.twimg.com/profile_images/1875161123793547265/d-LXT2LS_400x400.jpg", bio:"Head of global growth base" },
    { handle:"@sarahzorah", image:"https://pbs.twimg.com/profile_images/1878872838612152320/RVl3OYLa_400x400.jpg", bio:"Head of Marketing base at coinbase" },
    { handle:"@sumedha2199", image:"https://pbs.twimg.com/profile_images/1958357226437144576/y1MKf4rZ_400x400.jpg", bio:"growth basedindia base" },
    { handle:"@kabir_base", image:"https://pbs.twimg.com/profile_images/1951272636152958977/zHtBFwaj_400x400.jpg", bio:"this and that base" },
    { handle:"@roberrtsun", image:"https://pbs.twimg.com/profile_images/1817123331679846400/0c_hQMlc_400x400.jpg", bio:"UXR Ops base" },
    { handle:"@sha2nk_", image:"https://pbs.twimg.com/profile_images/1906360915488079872/MB9dXpi-_400x400.jpg", bio:"head of security base" },
    { handle:"@AhaanRaizada", image:"https://pbs.twimg.com/profile_images/1873606202137190401/zh-avKda_400x400.jpg", bio:"Growth Base BasedIndia" },
    { handle:"@asal_alizade", image:"https://pbs.twimg.com/profile_images/1955651067544502273/wCKlyuU0_400x400.jpg", bio:"Base MENA Lead - (UAE 🇦🇪 and more)" },
    { handle:"@sfrankel9", image:"https://pbs.twimg.com/profile_images/1970126209250906112/S0FoU63Q_400x400.jpg", bio:"head of ecosystem base" },
    { handle:"@0xAneri", image:"https://pbs.twimg.com/profile_images/1878869973608636416/Nqge4V8N_400x400.jpg", bio:"product lead apps, social, and creators base" },
    { handle:"@Nick_Prince12", image:"https://pbs.twimg.com/profile_images/1717376222450307072/_LnYHqG4_400x400.jpg", bio:"product base" },
    { handle:"@reva_jariwala", image:"https://pbs.twimg.com/profile_images/1885072512482197504/X7TRdXhW_400x400.jpg", bio:"building base" },
    { handle:"@AxelMtbr", image:"https://pbs.twimg.com/profile_images/1947253084943532032/XKV2TZBm_400x400.jpg", bio:"base country lead for Germany and Switzerland" },
    { handle:"@0xyoussea", image:"https://pbs.twimg.com/profile_images/1913963405590888448/khGfmzdz_400x400.jpg", bio:"devrel base" },
    { handle:"@0xEricBrown", image:"https://pbs.twimg.com/profile_images/1828848273479659521/ie7rXx3t_400x400.jpg", bio:"leading DevRel base" },
    { handle:"@Sir_Damilare", image:"https://pbs.twimg.com/profile_images/2003862958015643650/QIWuT6k0_400x400.jpg", bio:"West-Africa Lead base" },
    { handle:"@gui_bettanin", image:"https://pbs.twimg.com/profile_images/1928509647570325504/tOn8jum7_400x400.jpg", bio:"Base Country Lead, Brazil" },
    { handle:"@_clemens__", image:"https://pbs.twimg.com/profile_images/1964638021405290497/qoJ7OtVq_400x400.jpg", bio:"Building an Onchain Economy base" },
    { handle:"@CryptoStatuette", image:"https://pbs.twimg.com/profile_images/1878268946048028672/n-Yfbalt_400x400.jpg", bio:"base mom" },
    { handle:"@minseokk1m", image:"https://pbs.twimg.com/profile_images/1990456341010526208/a3wQz0pc_400x400.jpg", bio:"Andrew 金敃昔 | East Asia base" },
    { handle:"@davidtsocy", image:"https://pbs.twimg.com/profile_images/1882608013779021825/Qbpw8ozc_400x400.jpg", bio:"Ecosystem base" },
    { handle:"@ZacPrater", image:"https://pbs.twimg.com/profile_images/1557565780224610305/1AyLjh57_400x400.jpg", bio:"Virtual Events at base" },
    { handle:"@Oxxbid", image:"https://pbs.twimg.com/profile_images/1878050445601456128/_iuRoL8U_400x400.jpg", bio:"PM for trading base" },
    { handle:"@Nibel_eth", image:"https://pbs.twimg.com/profile_images/1868572161415532544/n1z9sXm4_400x400.jpg", bio:"Building a global economy | Country Lead base | APAC Lead base" },
    { handle:"@EvSlatts", image:"https://pbs.twimg.com/profile_images/1878908584085319680/0RvTQPHz_400x400.jpg", bio:"European Growth base" },
    { handle:"@davidandpassion", image:"https://pbs.twimg.com/profile_images/1944636041379639296/Wedp5fqq_400x400.jpg", bio:"base East Asia Lead" },
    { handle:"@angelinevivian_", image:"https://pbs.twimg.com/profile_images/1920834406303858688/szg-AKi7_400x400.jpg", bio:"Country Lead base" },
    { handle:"@hughescoin", image:"https://pbs.twimg.com/profile_images/1828476540406894592/tSO3mQxy_400x400.jpg", bio:"devrel base" },
    { handle:"@svmvn", image:"https://pbs.twimg.com/profile_images/1969947498912604160/hLkUd_WR_400x400.jpg", bio:"global growth base" },
    { handle:"@0xmoonlight_", image:"https://pbs.twimg.com/profile_images/1888422668145479680/YqSVrMO__400x400.jpg", bio:"PH Country Lead base" },
    { handle:"@BasedKago", image:"https://pbs.twimg.com/profile_images/1952101226788671488/tM2g5-TZ_400x400.jpg", bio:"Base Lead, East Africa" },
   
];

// ---------- helpers ----------
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

/**
 * ВАЖНО: шарим /r, НЕ /
 * Не encode руками — URLSearchParams кодирует 1 раз правильно
 */
function buildSharePageUrl(winner: { handle: string; bio?: string }) {
  const base = window.location.origin; // https://based-me.vercel.app
  const u = new URL("/r", base); // ✅ /r

  u.searchParams.set("handle", winner.handle);
  u.searchParams.set("bio", winner.bio || DEFAULT_BIO);

  // cache-bust для X
  u.searchParams.set("v", String(Date.now()));

  return u.toString();
}

function buildXIntentUrl(winner: { handle: string; bio?: string }) {
  const sharePageUrl = buildSharePageUrl(winner);
  const text = `I’m based as ${winner.handle} 😎\nHow based are you in 2026?`;

  const intent = new URL("https://x.com/intent/post"); // ✅ актуальный интент
  intent.searchParams.set("text", text);
  intent.searchParams.set("url", sharePageUrl);
  return intent.toString();
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

      if (p.alpha > 0 && p.y < window.innerHeight + 60 && p.x > -60 && p.x < window.innerWidth + 60) {
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

export default function HomePage() {
  const people = useMemo(() => sanitize(RAW_PARTICIPANTS), []);
  const { canvasRef, launch } = useFullscreenConfetti();

  const [current, setCurrent] = useState<Person>({
    handle: "@…",
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
    lastWinnerRef.current = null;

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

    launch(); // ✅ конфетти
    setSpinning(false);
  }

  function onShare() {
    const w = lastWinnerRef.current;
    if (!w) return;
    window.open(buildXIntentUrl(w), "_blank", "noopener,noreferrer");
  }

  const url = current.handle.startsWith("@") ? profileUrl(current.handle) : "#";

  return (
    <>
      <div className="texture" aria-hidden="true"></div>

      {/* ✅ Confetti canvas */}
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

            <a className="avatarLink" href={url} target="_blank" rel="noreferrer">
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

              <button className="share" onClick={onShare} style={{ display: celebrate ? "inline-block" : "none" }}>
                Share on X
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* styles */}
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
        .avatarLink{
          display:block;
          border-radius: 40px;
          overflow:hidden;
          border:1px solid rgba(10,10,10,.10);
          width: 260px;
          height: 260px;
          background: var(--card);
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .avatarLink:hover{
          transform: translateY(-1px);
          box-shadow: 0 18px 44px rgba(0,0,0,.10);
        }
        .avatarLink img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
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
          display:none;
        }
        .basedLine a{
          color: rgba(10,10,10,.85);
          text-decoration:none;
          font-weight: 950;
          border-bottom:1px solid rgba(10,10,10,.18);
        }
        .stage.celebrate .basedLine{ display:block; }
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
        @media (max-width: 560px){
          .stage{ padding:24px 18px 22px; gap:12px; }
          .avatarLink{ width:140px; height:140px; border-radius:24px; }
          .handleLink{ font-size:26px; }
          .bio{ font-size:14px; }
          .actions{ padding:16px 18px; }
        }
      `}</style>
    </>
  );
}
