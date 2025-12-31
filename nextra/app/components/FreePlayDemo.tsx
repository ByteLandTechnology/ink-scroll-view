"use client";

/**
 * @file FreePlayDemo.tsx
 * @description Free-play sandbox for ink-scroll-view - compact version
 */

import "ink-canvas/shims/process";
import { useState, useEffect, useRef } from "react";
import { Box, Text } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import {
  HiChevronUp,
  HiChevronDown,
  HiArrowUp,
  HiArrowDown,
  HiPlus,
  HiMinus,
  HiArrowPath,
  HiCog6Tooth,
} from "react-icons/hi2";
import { THEME, Btn } from "./demos/shared";

// ===================================
// Types
// ===================================
interface FreePlayItem {
  id: number;
  title: string;
  expanded: boolean;
  color?: string;
}

// ===================================
// Main Component
// ===================================
export default function FreePlayDemo() {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [mounted, setMounted] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const [items, setItems] = useState<FreePlayItem[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `Section ${i + 1}`,
      expanded: false,
    })),
  );
  const [nextId, setNextId] = useState(10);
  const [viewportHeight, setViewportHeight] = useState(8);
  const [width, setWidth] = useState(50);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const log = (msg: string) => setActionLog((p) => [msg, ...p].slice(0, 6));
  const forceRender = () => setRenderKey((k) => k + 1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll
  const scrollUp = () => {
    scrollRef.current?.scrollBy(-1);
    log("scrollBy(-1)");
  };
  const scrollDown = () => {
    scrollRef.current?.scrollBy(1);
    log("scrollBy(1)");
  };
  const scrollTop = () => {
    scrollRef.current?.scrollToTop();
    log("scrollToTop()");
  };
  const scrollBottom = () => {
    scrollRef.current?.scrollToBottom();
    log("scrollToBottom()");
  };

  // Items
  const addTop = () => {
    setItems((p) => [
      { id: nextId, title: "NEW (top)", expanded: false, color: "yellow" },
      ...p,
    ]);
    setNextId((n) => n + 1);
    log("Add top");
  };
  const addEnd = () => {
    setItems((p) => [
      ...p,
      { id: nextId, title: "NEW (end)", expanded: false, color: "cyan" },
    ]);
    setNextId((n) => n + 1);
    log("Add end");
  };
  const rmTop = () => {
    if (items.length > 1) {
      setItems((p) => p.slice(1));
      log("Remove first");
    }
  };
  const rmEnd = () => {
    if (items.length > 1) {
      setItems((p) => p.slice(0, -1));
      log("Remove last");
    }
  };

  // Toggle
  const toggleItem = (id: number) => {
    setItems((p) =>
      p.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item,
      ),
    );
    forceRender();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    log(`Toggle #${id}`);
  };
  const expandAll = () => {
    setItems((p) => p.map((item) => ({ ...item, expanded: true })));
    forceRender();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    log("Expand all");
  };
  const collapseAll = () => {
    setItems((p) => p.map((item) => ({ ...item, expanded: false })));
    forceRender();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    log("Collapse all");
  };

  // Dimensions
  const decWidth = () => {
    setWidth((w) => Math.max(w - 10, 25));
    forceRender();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    log("Width -10");
  };
  const incWidth = () => {
    setWidth((w) => Math.min(w + 10, 70));
    forceRender();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    log("Width +10");
  };
  const decHeight = () => {
    setViewportHeight((h) => Math.max(h - 2, 4));
    forceRender();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    log("Height -2");
  };
  const incHeight = () => {
    setViewportHeight((h) => Math.min(h + 2, 14));
    forceRender();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    log("Height +2");
  };

  // Reset
  const reset = () => {
    setItems(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        title: `Section ${i + 1}`,
        expanded: false,
      })),
    );
    setNextId(10);
    setViewportHeight(8);
    setWidth(50);
    forceRender();
    scrollRef.current?.scrollToTop();
    setActionLog([]);
    log("Reset");
  };

  if (!mounted)
    return (
      <div className="h-[320px] w-full rounded-xl bg-slate-900 animate-pulse" />
    );

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          🎮 Sandbox
        </span>
        <Btn onClick={reset}>
          <HiArrowPath className="w-3 h-3" />
          Reset
        </Btn>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Controls */}
        <div className="lg:w-64 p-3 border-b lg:border-b-0 lg:border-r space-y-3 border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
          {/* Scroll */}
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
              Scroll
            </div>
            <div className="flex flex-wrap gap-1">
              <Btn onClick={scrollUp} color={THEME.blue}>
                <HiChevronUp className="w-3 h-3" />
              </Btn>
              <Btn onClick={scrollDown} color={THEME.blue}>
                <HiChevronDown className="w-3 h-3" />
              </Btn>
              <Btn onClick={scrollTop} color={THEME.purple}>
                <HiArrowUp className="w-3 h-3" />
              </Btn>
              <Btn onClick={scrollBottom} color={THEME.purple}>
                <HiArrowDown className="w-3 h-3" />
              </Btn>
            </div>
          </div>
          {/* Items */}
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
              Items
            </div>
            <div className="flex flex-wrap gap-1">
              <Btn onClick={addTop} color={THEME.yellow}>
                <HiPlus className="w-3 h-3" />
                Top
              </Btn>
              <Btn onClick={addEnd} color={THEME.green}>
                <HiPlus className="w-3 h-3" />
                End
              </Btn>
              <Btn onClick={rmTop} color={THEME.red}>
                <HiMinus className="w-3 h-3" />
                1st
              </Btn>
              <Btn onClick={rmEnd} color={THEME.red}>
                <HiMinus className="w-3 h-3" />
                Last
              </Btn>
            </div>
          </div>
          {/* Toggle */}
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
              Toggle
            </div>
            <div className="flex flex-wrap gap-1">
              {items.slice(0, 6).map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    item.expanded
                      ? "bg-green-100 text-green-700 dark:bg-green-600/30 dark:text-green-400"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Btn onClick={expandAll} color={THEME.green} small>
                All+
              </Btn>
              <Btn onClick={collapseAll} color={THEME.red} small>
                All-
              </Btn>
            </div>
          </div>
          {/* Dimensions */}
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
              Size
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400 w-6">W:</span>
              <Btn onClick={decWidth} color={THEME.blue} small>
                <HiMinus className="w-2.5 h-2.5" />
              </Btn>
              <span className="font-mono text-gray-600 dark:text-white w-8 text-center">
                {width}
              </span>
              <Btn onClick={incWidth} color={THEME.blue} small>
                <HiPlus className="w-2.5 h-2.5" />
              </Btn>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-gray-500 dark:text-gray-400 w-6">H:</span>
              <Btn onClick={decHeight} color={THEME.purple} small>
                <HiMinus className="w-2.5 h-2.5" />
              </Btn>
              <span className="font-mono text-gray-600 dark:text-white w-8 text-center">
                {viewportHeight}
              </span>
              <Btn onClick={incHeight} color={THEME.purple} small>
                <HiPlus className="w-2.5 h-2.5" />
              </Btn>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-3 bg-white dark:bg-[#12121a]">
          <div
            className="rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a]"
            style={{ background: THEME.dark }}
          >
            <InkCanvas key={renderKey}>
              <Box height="100%" width="100%">
                <Box width={width}>
                  <ScrollBarBox
                    borderStyle="single"
                    borderColor="cyan"
                    height={viewportHeight + 2}
                    contentHeight={contentHeight}
                    viewportHeight={viewportHeight}
                    scrollOffset={scrollOffset}
                  >
                    <ScrollView
                      ref={scrollRef}
                      height={viewportHeight}
                      onScroll={setScrollOffset}
                      onContentHeightChange={setContentHeight}
                    >
                      {items.map((item) => (
                        <Box key={item.id} flexDirection="column">
                          <Text
                            color={
                              item.color || (item.expanded ? "green" : "white")
                            }
                            bold
                          >
                            {item.expanded ? "▼" : "▶"} {item.title}
                          </Text>
                          {item.expanded && (
                            <Box
                              marginLeft={2}
                              borderStyle="single"
                              borderColor="gray"
                            >
                              <Text color="gray">{`Details for ${item.title}`}</Text>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </ScrollView>
                  </ScrollBarBox>
                </Box>
              </Box>
            </InkCanvas>
          </div>
        </div>

        {/* Status */}
        <div className="lg:w-48 p-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
          <div className="flex items-center gap-1 mb-2">
            <HiCog6Tooth className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              Status
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Items</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {items.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Expanded</span>
              <span className="font-mono text-yellow-600 dark:text-yellow-400">
                {items.filter((i) => i.expanded).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Offset</span>
              <span className="font-mono text-green-600 dark:text-green-400">
                {scrollOffset}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Content</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">
                {contentHeight}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Viewport</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {viewportHeight}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Width</span>
              <span className="font-mono text-fuchsia-600 dark:text-[#ff00ff]">
                {width}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">
              Log
            </div>
            <div
              className="rounded p-1.5 space-y-0.5 max-h-24 overflow-auto text-[10px] font-mono"
              style={{ background: THEME.dark }}
            >
              {actionLog.length === 0 ? (
                <span className="text-gray-600">...</span>
              ) : (
                actionLog.map((a, i) => (
                  <div
                    key={i}
                    style={{ color: i === 0 ? THEME.green : THEME.textMuted }}
                  >
                    {i === 0 && "→ "}
                    {a}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
