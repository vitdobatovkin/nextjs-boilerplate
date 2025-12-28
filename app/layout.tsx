import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How based are you in 2026?",
  description: "Tap Based me — quick spin, and we’ll rate how based you are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
