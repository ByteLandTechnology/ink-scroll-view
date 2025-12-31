/**
 * @file app/demo/page.tsx
 * @description Interactive demo page for ink-scroll-view
 */

import GuidedDemo from "@/app/components/GuidedDemo";
import FreePlayDemo from "@/app/components/FreePlayDemo";
import Link from "next/link";

export const metadata = {
  title: "Showcase | ink-scroll-view",
  description: "Interactive demonstrations of ink-scroll-view features.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient-tri">Showcase</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Learn how{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-mono text-xs">
              ink-scroll-view
            </code>{" "}
            works through hands-on demonstrations.
          </p>
        </div>

        {/* Guided Demo */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
              Tutorial
            </span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Guided Tour
            </h2>
          </div>
          <GuidedDemo />
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
              @byteland/ink-scroll-bar
            </a>
          </p>
        </section>

        {/* Playground */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 rounded-full bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase">
              Sandbox
            </span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Playground
            </h2>
          </div>
          <FreePlayDemo />
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
              @byteland/ink-scroll-bar
            </a>
          </p>
        </section>

        {/* API Cards */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
            Key APIs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <APICard method="scrollBy(n)" desc="Relative scroll" />
            <APICard method="scrollTo(n)" desc="Absolute scroll" />
            <APICard method="scrollToTop()" desc="Jump to start" />
            <APICard method="scrollToBottom()" desc="Jump to end" />
            <APICard method="remeasure()" desc="Recalculate layout" />
            <APICard method="onScroll" desc="Offset callback" />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-gray-200 dark:border-gray-800/50">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Ready to use?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/docs"
              className="bg-gradient-tri px-6 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Docs
            </Link>
            <a
              href="https://www.npmjs.com/package/ink-scroll-view"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              npm install
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function APICard({ method, desc }: { method: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <code className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
        {method}
      </code>
      <p className="text-gray-600 dark:text-gray-500 text-xs mt-1">{desc}</p>
    </div>
  );
}
