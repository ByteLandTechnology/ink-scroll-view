/**
 * @file app/page.tsx
 * @description Home page component - displays the ByteLand Docs Template welcome page
 *
 * This is the main landing page, containing:
 * - Hero section: Template introduction and action buttons
 * - Features section: Key features of this template
 * - Tech Stack section: Technologies used in this template
 *
 * Styling notes:
 * Uses inline styles instead of Tailwind to ensure compatibility with
 * Nextra's theme system and proper dark/light mode switching.
 */

import type { Metadata } from "next";
import Link from "next/link";
import HeroDemo from "./components/HeroDemo";

/**
 * Page metadata
 */
export const metadata: Metadata = {
  title: "ink-scroll-view",
  description: "A highly configurable ScrollView component for Ink",
};

/**
 * Home page component
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-20 px-6 max-w-[90rem] mx-auto">
      {/* ========== Hero Section ========== */}
      <section className="flex flex-col xl:flex-row items-center justify-between min-h-[70vh] gap-10 pt-10">
        {/* Left Side: Content */}
        <div className="flex flex-col items-start text-left max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="text-gradient-tri">ink-scroll-view</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
            A flexible, performant scrollable view for your{" "}
            <span className="text-blue-500 font-medium">Ink</span> CLI
            applications. Handle long lists and content overflow with ease.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/showcase"
              className="bg-gradient-tri px-8 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105 active:scale-95"
            >
              Showcase <span>→</span>
            </Link>

            <Link
              href="/docs"
              className="px-8 py-3 rounded-full font-medium border border-current opacity-80 hover:opacity-100 transition-opacity"
            >
              Documentation
            </Link>
          </div>
        </div>

        {/* Right Side: Auto Demo */}
        <div className="w-full max-w-lg xl:max-w-xl">
          <div className="shadow-2xl rounded-xl overflow-hidden shine-effect">
            <HeroDemo />
          </div>
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
            Powered by{" "}
            <a
              href="https://github.com/ByteLandTechnology/ink-canvas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              ink-canvas
            </a>{" "}
            &{" "}
            <a
              href="https://github.com/ByteLandTechnology/ink-scroll-bar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:underline"
            >
              ink-scroll-bar
            </a>
          </p>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section className="py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Why ink-scroll-view?</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Build complex, interactive CLI dashboards with standard React
            patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon="📦"
            title="Flexible Container"
            description="Handles content larger than the visible terminal viewport. A layout primitive that gives you full control over scrolling behavior."
          />
          <FeatureCard
            icon="📏"
            title="Auto-Measurement"
            description="Automatically measures child heights using a virtually rendered DOM. No manual height calculations needed."
          />
          <FeatureCard
            icon="🔁"
            title="Dynamic Content"
            description="Supports adding, removing, and expanding/collapsing items on the fly. Perfect for interactive CLI applications."
          />
          <FeatureCard
            icon="🛡️"
            title="TypeScript Ready"
            description="Written in TypeScript with full type definitions. Enjoy autocomplete and type safety for all props and refs."
          />
        </div>
      </section>
    </div>
  );
}

/**
 * Feature card component
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg dark:hover:shadow-blue-900/10 hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
