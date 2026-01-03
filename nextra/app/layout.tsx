/**
 * @file app/layout.tsx
 * @description Root layout component - defines the base structure for the entire application
 *
 * This is the root layout file for Next.js App Router. All pages inherit this layout.
 * Main features:
 * - Configures the Nextra documentation theme
 * - Defines custom Navbar
 * - Sets up global fonts and styles
 * - Disables default footer
 */

import { Layout, Navbar, ThemeSwitch } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Exo_2 } from "next/font/google";
import "nextra-theme-docs/style.css";
import "./globals.css";
import type { Metadata } from "next";
import BytelandLogo from "./BytelandLogo";

/**
 * Configure Exo 2 font
 * - subsets: Only load Latin character set to reduce file size
 * - variable: Define CSS variable name for use in styles
 * - display: swap ensures text displays with system font first, then swaps when loaded
 */
const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  display: "swap",
});

/**
 * Page metadata - used for SEO and browser tab
 */
export const metadata: Metadata = {
  title: "ink-scroll-view",
  description:
    "A documentation site template for ByteLand open-source projects, built with Nextra 4 and Next.js 15",
};

/**
 * Custom Navbar component
 *
 * Structure:
 * - Left: Project logo (Openland icon) + site title (with gradient)
 * - Right: Spinning ByteLand logo (links to main site)
 */
const navbar = (
  <Navbar
    logo={
      <div className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        {/* Project icon */}
        <img src="/openland.svg" alt="Openland Logo" className="h-8 w-auto" />
        {/* Site title - uses ByteLand tri-color gradient */}
        <span className="font-bold text-2xl tracking-tight text-gradient-tri">
          ink-scroll-view
        </span>
      </div>
    }
  >
    <ThemeSwitch lite />
    {/* GitHub Link - Manually added to control order */}
    <a
      href="https://github.com/ByteLandTechnology/ink-scroll-view"
      target="_blank"
      rel="noreferrer"
      className="p-2 text-current opacity-80 hover:opacity-100 transition-opacity"
      title="GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    </a>
    {/* Right side: ByteLand main site link - icon with spin animation */}
    <BytelandLogo />
  </Navbar>
);

/**
 * Root layout component
 *
 * @param children - Child page content
 * @returns Complete HTML document structure
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get page map for generating sidebar navigation
  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      {/* Nextra Head component - sets favicon */}
      <Head faviconGlyph="✦" />
      <body className={`${exo2.variable} antialiased`}>
        {/* Nextra Layout component - provides complete docs theme layout */}
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/ByteLandTechnology/ink-scroll-view/tree/main"
          footer={null}
          sidebar={{ defaultOpen: true }}
          toc={{ float: true, title: "On This Page" }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
