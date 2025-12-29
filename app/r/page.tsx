// app/r/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    handle?: string;
    bio?: string;
    v?: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const handle = (searchParams.handle || "@someone").trim();
  const bio = (searchParams.bio || "How based are you in 2026?").trim();
  const v = (searchParams.v || "").trim();

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://based-me.vercel.app");

  // ⚠️ Это URL, который вы шарите в X (он будет в тексте поста)
  const shareUrl = new URL("/r", base);
  shareUrl.searchParams.set("handle", handle);
  shareUrl.searchParams.set("bio", bio);
  if (v) shareUrl.searchParams.set("v", v);

  // OG image endpoint
  const ogUrl = new URL("/og", base);
  ogUrl.searchParams.set("handle", handle);
  ogUrl.searchParams.set("bio", bio);
  if (v) ogUrl.searchParams.set("v", v);

  const title = `I’m based as ${handle}`;

  return {
    title,
    description: bio,
    openGraph: {
      type: "website",
      // Можно поставить главную, но X всё равно кликает по фактическому URL /r...
      url: new URL("/", base).toString(),
      title,
      description: bio,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: bio,
      images: [ogUrl.toString()],
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  // ✅ Для живого пользователя всегда ведём на главную
  redirect("/");
}
