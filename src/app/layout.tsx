import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { headers } from "next/headers";
import { Suspense, type ReactNode } from "react";
import { ChatAssistant } from "@/components/assistant/ChatAssistant";
import { ToonDefs } from "@/components/illustrations/base";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionScheduler } from "@/components/layout/MotionScheduler";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { PageEnhancements } from "@/components/layout/PageEnhancements";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { themeInitScript } from "@/lib/theme";
import { profile } from "@/content/profile";
import { getArticleMetas } from "@/lib/articles";
import { buildKnowledge } from "@/lib/assistant/knowledge";
import { rssAlternate, siteUrl } from "@/lib/site";
import "./globals.css";
import "./toon.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

const description =
  "Academic portfolio of Supriyo Sarkar, covering federated learning, medical image analysis, homomorphic encryption and knowledge distillation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.siteName} | ${profile.name}, ${profile.role}`, template: `%s | ${profile.siteName}` },
  description,
  applicationName: profile.siteName,
  authors: [{ name: profile.name }],
  openGraph: { type: "website", siteName: profile.siteName, title: `${profile.siteName} | ${profile.name}`, description, locale: "en_GB" },
  twitter: { card: "summary_large_image", title: `${profile.siteName} | ${profile.name}`, description },
  alternates: { canonical: "/", types: rssAlternate },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1024" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
        >
          Skip to content
        </a>
        <ToonDefs />
        <span className="scroll-progress" aria-hidden="true" />
        {/* Shown only if the page takes a while to become interactive, e.g. on a slow connection */}
        <div className="boot-loader" aria-hidden="true">
          <span className="boot-orbit">
            <span />
            <span />
            <span />
          </span>
          <span className="boot-text">Loading DeveloperBro.</span>
        </div>
        <AmbientBackground />
        <div className="site-layer flex min-h-dvh flex-col">
          <Header />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <RevealObserver />
        <PageEnhancements />
        <MotionScheduler />
        <ChatAssistant knowledge={buildKnowledge(getArticleMetas())} />
        <CookieNotice />
      </body>
    </html>
  );
}
