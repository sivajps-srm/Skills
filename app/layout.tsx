import type { Metadata } from "next";
import "./globals.css";
import "./lab.css";
import "./facilitator.css";
import "./platform-fixes.css";
import "./platform-core.css";
import "./learning-experience.css";
import "./classroom-deck.css";
import "./reading-slides.css";
import "./brand.css";
import "./brand-deck.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.skills4sales.com"),
  title: "Skills4Sales Learning Companion",
  description: "A practice-led companion for consultative customer conversations—from first contact to customer commitment.",
  icons: { icon: "/s4s-favicon.png?v=3", shortcut: "/s4s-favicon.png?v=3", apple: "/s4s-favicon.png?v=3" },
  openGraph: { title: "Skills4Sales", description: "From first contact to customer commitment", type: "website", images: [{url: "/og.png", width: 1200, height: 630, alt: "Skills4Sales — From first contact to customer commitment"}] },
  twitter: { card: "summary_large_image", title: "Skills4Sales", description: "From first contact to customer commitment", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return <html lang="en"><head><link rel="icon" href="/favicon.ico?v=3" sizes="any"/><link rel="icon" type="image/png" href="/s4s-favicon.png?v=3" sizes="512x499"/><link rel="apple-touch-icon" href="/s4s-favicon.png?v=3"/></head><body>{children}</body></html>;
}
