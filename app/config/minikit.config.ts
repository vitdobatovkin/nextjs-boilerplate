const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || "https://based-me.vercel.app";

export const minikitConfig = {
  accountAssociation: {
    // This will be filled in after you verify your domain at base.dev/preview
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Based Me",
    subtitle: "How based are you in 2026?",
    description: "Tap Base me — quick spin and we'll rate how based you are",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#ffffff",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["social", "fun", "based", "2026"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "How based are you in 2026?",
    ogTitle: "How based are you in 2026?",
    ogDescription: "Tap Base me — quick spin and we'll rate how based you are",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;
