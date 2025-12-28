import type { Metadata } from "next";
import { redirect } from "next/navigation";

function clampStr(s: string, max = 140) {
  const clean = (s || "").toString().replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: { handle?: string; img?: string; bio?: string };
}): Promise<Metadata> {
  const handle = clampStr(searchParams.handle || "@…", 32);
  const bio = clampStr(searchParams.bio || "", 120);
  const img = searchParams.img || "";

  const title = "How based are you in 2026?";
  const description = bio ? `I’m based as ${handle} 😎 — ${bio}` : `I’m based as ${handle} 😎`;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const og = new URL("/og", base);
  og.searchParams.set("handle", handle);
  if (bio) og.searchParams.set("bio", bio);
  if (img) og.searchParams.set("img", img);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: og.toString(), width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og.toString()]
    }
  };
}

export default function ShareLanding() {
  redirect("/");
}

