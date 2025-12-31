"use client";

import React from "react";
import { InkCanvas } from "ink-canvas";

interface TerminalFrameProps {
  title: string;
  description: string;
  inkContent: React.ReactNode;
  controls: React.ReactNode;
}

export default function TerminalFrame({
  title,
  description,
  inkContent,
  controls,
}: TerminalFrameProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Terminal View */}
      <div className="flex-1 flex flex-col min-h-[500px] h-[600px] bg-[#0d1117] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl relative group">
        {/* Fake Terminal Header */}
        <div className="flex-none h-9 bg-slate-800/50 border-b border-white/5 flex items-center px-4 space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <div className="ml-4 text-xs text-slate-400 font-mono flex-1 text-center pr-12">
            {title}
          </div>
        </div>

        {/* Ink Content Area */}
        <div className="flex-1 pt-6 relative overflow-hidden">
          {/* Using InkCanvas here implies we instantiate a new context for each demo switch - might be costly but guarantees clean state */}
          <InkCanvas>{inkContent}</InkCanvas>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full lg:w-96 flex flex-col space-y-6">
        <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {description}
          </p>
          {controls}
        </div>
      </div>
    </div>
  );
}
