import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VenturePulse AI",
  description: "AI-powered startup validation and stress-testing platform — find your idea's critical risks before the market does.",
  icons: {
    icon: "data:,",
    shortcut: "data:,",
    apple: "data:,",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body>{children}</body>
    </html>
  );
}
