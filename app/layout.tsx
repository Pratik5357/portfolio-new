import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Big_Shoulders, Martian_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Clock } from "@/components/clock";
import { Cursor } from "@/components/cursor";
import { Header } from "@/components/header";
import { Menu } from "@/components/menu";
import { ScrollSpy } from "@/components/scroll-spy";
import { SiteProvider } from "@/components/site";
import { CITY } from "@/lib/contact";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], weight: ["900"], variable: "--font-display", fallback: ["Oswald", "Arial Narrow", "sans-serif"], adjustFontFallback: false });
const text = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-text" });
const data = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-data" });

export const metadata: Metadata = {
  title: "Pratik Kumbhar",
  description:
    "Backend developer on a credit-report order-to-delivery platform: .NET APIs, SQL Server, integrations and background jobs.",
};

export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${data.variable}`}>
      <body>
        <MotionConfig reducedMotion="user">
          <SiteProvider
            chrome={
              <>
                <Header />
                <Menu />
                <Cursor />
                <ScrollSpy />
              </>
            }
          >
            {children}
            <footer className="ftr">
              <div className="wrap">
                <span>© 2026 Pratik Keraba Kumbhar</span>
                <span className="data">
                  {CITY}, India · <Clock /> IST
                </span>
              </div>
            </footer>
          </SiteProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
