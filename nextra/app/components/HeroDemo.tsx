"use client";

/**
 * @file HomeDemo.tsx
 * @description Auto-playing demonstration component for the homepage
 *
 * Features:
 * - ByteLand tri-color gradient theme integration
 * - Smooth animations and micro-interactions
 * - Glassmorphism design elements
 * - Auto-cycling demo scenes with manual tab selection
 * - Real-time status display
 * - Hover to pause functionality
 */

import "ink-canvas/shims/process";
import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Text } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import {
  HiArrowsUpDown,
  HiPlusCircle,
  HiSquaresPlus,
  HiArrowsPointingOut,
  HiArrowPath,
} from "react-icons/hi2";

// ===================================
// Theme Colors (ByteLand Brand)
// ===================================
const THEME = {
  blue: "#007aff",
  green: "#34c759",
  red: "#ff3b30",
  dark: "#0a0a0f",
  surface: "#12121a",
  surfaceLight: "#1a1a25",
  border: "#2a2a3a",
  text: "#e0e0e8",
  textMuted: "#8888a0",
};

// ===================================
// Shared Types & Interfaces
// ===================================
interface DemoState {
  activity: string;
  offset: number;
  total: number;
  meta?: string;
}

interface SceneProps {
  active: boolean;
  onUpdate: (state: DemoState) => void;
}

// ===================================
// Scene 1: Scrolling Demo
// ===================================
const ScrollingScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollViewRef>(null);
  const [activity, setActivity] = useState("Ready");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const viewportHeight = 12;

  const updateParent = useCallback(() => {
    onUpdate({
      activity,
      offset: scrollOffset,
      total: contentHeight,
      meta: "Smooth Scroll",
    });
  }, [activity, scrollOffset, contentHeight, onUpdate]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(500);
      if (!isRun) return;
      setActivity("Scrolling Down");

      for (let i = 0; i < 15; i++) {
        if (!isRun) return;
        ref.current?.scrollBy(1);
        await wait(180);
      }

      if (!isRun) return;
      setActivity("Jump to Bottom");
      ref.current?.scrollToBottom();
      await wait(2000);

      if (!isRun) return;
      setActivity("Return to Top");
      ref.current?.scrollToTop();
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="single"
        borderColor="cyan"
        height={viewportHeight + 2}
        contentHeight={contentHeight}
        viewportHeight={viewportHeight}
        scrollOffset={scrollOffset}
      >
        <ScrollView
          ref={ref}
          height={viewportHeight}
          onScroll={setScrollOffset}
          onContentHeightChange={setContentHeight}
        >
          {Array.from({ length: 50 }, (_, i) => (
            <Text key={i} color={i % 2 === 0 ? "white" : "gray"}>
              {String(i + 1).padStart(2, "0")} │ System log entry - process
              status update
            </Text>
          ))}
        </ScrollView>
      </ScrollBarBox>
    </Box>
  );
};

// ===================================
// Scene 2: Dynamic Items Demo
// ===================================
const DynamicItemsScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollViewRef>(null);
  const [items, setItems] = useState<
    Array<{ id: number; text: string; color?: string }>
  >(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      text: `Task ${i + 1}: Processing...`,
    })),
  );
  const [activity, setActivity] = useState("Ready");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const viewportHeight = 10;

  const updateParent = useCallback(() => {
    onUpdate({
      activity,
      offset: scrollOffset,
      total: contentHeight,
      meta: `${items.length} items`,
    });
  }, [activity, scrollOffset, contentHeight, items.length, onUpdate]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(1000);
      if (!isRun) return;
      setActivity("Adding to top");
      setItems((p) => [
        {
          id: Date.now(),
          text: "★ Urgent: New priority task",
          color: "yellow",
        },
        ...p,
      ]);

      await wait(1500);
      if (!isRun) return;
      setActivity("Appending");
      setItems((p) => [
        ...p,
        {
          id: Date.now() + 1,
          text: "✓ Completed: System backup",
          color: "green",
        },
      ]);
      ref.current?.scrollToBottom();

      await wait(1500);
      if (!isRun) return;
      setActivity("Removing old");
      setItems((p) => p.slice(1));
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="single"
        borderColor="green"
        height={viewportHeight + 2}
        contentHeight={contentHeight}
        viewportHeight={viewportHeight}
        scrollOffset={scrollOffset}
      >
        <ScrollView
          ref={ref}
          height={viewportHeight}
          onScroll={setScrollOffset}
          onContentHeightChange={setContentHeight}
        >
          {items.map((item, i) => (
            <Text key={item.id} color={item.color || "white"}>
              {String(i + 1).padStart(2, "0")} │ {item.text}
            </Text>
          ))}
        </ScrollView>
      </ScrollBarBox>
    </Box>
  );
};

// ===================================
// Scene 3: Expandable Sections Demo
// ===================================
const ExpandScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollViewRef>(null);
  const [sections, setSections] = useState([
    { id: 1, title: "System Status", expanded: false },
    { id: 2, title: "Network Config", expanded: false },
    { id: 3, title: "Security Log", expanded: false },
  ]);
  const [activity, setActivity] = useState("Ready");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const viewportHeight = 10;

  const updateParent = useCallback(() => {
    onUpdate({
      activity,
      offset: scrollOffset,
      total: contentHeight,
      meta: `${sections.filter((s) => s.expanded).length} expanded`,
    });
  }, [activity, scrollOffset, contentHeight, sections, onUpdate]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(1000);
      if (!isRun) return;
      setActivity("Expand: System");
      setSections((p) =>
        p.map((s) => (s.id === 1 ? { ...s, expanded: true } : s)),
      );
      setTimeout(() => ref.current?.remeasureItem(0), 50);

      await wait(1500);
      if (!isRun) return;
      setActivity("Expand: Network");
      setSections((p) =>
        p.map((s) => (s.id === 2 ? { ...s, expanded: true } : s)),
      );
      setTimeout(() => ref.current?.remeasureItem(1), 50);

      await wait(2000);
      if (!isRun) return;
      setActivity("Collapse All");
      setSections((p) => p.map((s) => ({ ...s, expanded: false })));
      setTimeout(() => ref.current?.remeasure(), 50);
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="double"
        borderColor="yellow"
        height={viewportHeight + 2}
        contentHeight={contentHeight}
        viewportHeight={viewportHeight}
        scrollOffset={scrollOffset}
      >
        <ScrollView
          ref={ref}
          height={viewportHeight}
          onScroll={setScrollOffset}
          onContentHeightChange={setContentHeight}
        >
          {sections.map((section) => (
            <Box key={section.id} flexDirection="column" marginBottom={1}>
              <Text color={section.expanded ? "green" : "white"} bold>
                {section.expanded ? "▼" : "▶"} {section.title}
              </Text>
              {section.expanded && (
                <Box
                  marginLeft={2}
                  borderStyle="single"
                  borderColor="gray"
                  paddingX={1}
                >
                  <Text color="gray">
                    {`Status: Active\nUptime: 99.9%\nLast Check: Now`}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </ScrollView>
      </ScrollBarBox>
    </Box>
  );
};

// ===================================
// Scene 4: Resize Demo
// ===================================
const ResizeScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollViewRef>(null);
  const [height, setHeight] = useState(12);
  const [activity, setActivity] = useState("Ready");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (!active) return;
    const i = setInterval(() => {
      if (ref.current) {
        const off = ref.current.getScrollOffset() || 0;
        const inner = (ref.current as any).getInnerHeight?.() || contentHeight;
        setScrollOffset(off);
        setContentHeight(inner);
        onUpdate({
          activity,
          offset: off,
          total: inner,
          meta: `Height: ${height}`,
        });
      }
    }, 50);
    return () => clearInterval(i);
  }, [active, onUpdate, height, activity, contentHeight]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const remeasure = () => setTimeout(() => ref.current?.remeasure(), 50);

      await wait(1000);
      if (!isRun) return;
      setActivity("Scroll to middle");
      ref.current?.scrollTo(10);

      await wait(2000);
      if (!isRun) return;
      setActivity("Shrink viewport");
      setHeight(6);
      remeasure();

      await wait(2000);
      if (!isRun) return;
      setActivity("Compact mode");
      setHeight(4);
      remeasure();

      await wait(2000);
      if (!isRun) return;
      setActivity("Restore size");
      setHeight(12);
      remeasure();
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="single"
        borderColor="blue"
        height={height + 2}
        contentHeight={contentHeight}
        viewportHeight={height}
        scrollOffset={scrollOffset}
      >
        <ScrollView
          ref={ref}
          height={height}
          onScroll={setScrollOffset}
          onContentHeightChange={setContentHeight}
        >
          {Array.from({ length: 30 }, (_, i) => (
            <Text key={i} color={i % 3 === 0 ? "cyan" : "white"}>
              {String(i + 1).padStart(2, "0")} │ Viewport resize demonstration
            </Text>
          ))}
        </ScrollView>
      </ScrollBarBox>
    </Box>
  );
};

// ===================================
// Scene 5: Width Demo
// ===================================
const WidthScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollViewRef>(null);
  const [width, setWidth] = useState(45);
  const [activity, setActivity] = useState("Ready");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const viewportHeight = 10;

  const updateParent = useCallback(() => {
    onUpdate({
      activity,
      offset: scrollOffset,
      total: contentHeight,
      meta: `Width: ${width}ch`,
    });
  }, [activity, scrollOffset, contentHeight, width, onUpdate]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const remeasure = () => setTimeout(() => ref.current?.remeasure(), 50);

      await wait(1000);
      if (!isRun) return;
      setActivity("Scroll to item");
      const pos = ref.current?.getItemPosition(1);
      if (pos) ref.current?.scrollTo(pos.top);

      await wait(2000);
      if (!isRun) return;
      setActivity("Narrow width");
      setWidth(28);
      remeasure();

      await wait(2000);
      if (!isRun) return;
      setActivity("Compact width");
      setWidth(18);
      remeasure();

      await wait(2000);
      if (!isRun) return;
      setActivity("Full width");
      setWidth(45);
      remeasure();
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <Box width={width}>
        <ScrollBarBox
          borderStyle="single"
          borderColor="magenta"
          height={viewportHeight + 2}
          contentHeight={contentHeight}
          viewportHeight={viewportHeight}
          scrollOffset={scrollOffset}
        >
          <ScrollView
            ref={ref}
            height={viewportHeight}
            onScroll={setScrollOffset}
            onContentHeightChange={setContentHeight}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <Text key={i} wrap="wrap">
                {String(i + 1).padStart(2, "0")} │ Long content that wraps
                dynamically when width changes, demonstrating responsive
                behavior.
              </Text>
            ))}
          </ScrollView>
        </ScrollBarBox>
      </Box>
    </Box>
  );
};

// ===================================
// Scene Configuration
// ===================================
const SCENES = [
  {
    id: "scroll",
    label: "Scrolling",
    icon: HiArrowsUpDown,
    description: "Smooth scroll, jump to top/bottom",
    duration: 6000,
    component: ScrollingScene,
    color: THEME.blue,
  },
  {
    id: "items",
    label: "Dynamic Items",
    icon: HiPlusCircle,
    description: "Add & remove list items",
    duration: 5000,
    component: DynamicItemsScene,
    color: THEME.green,
  },
  {
    id: "expand",
    label: "Expand/Collapse",
    icon: HiSquaresPlus,
    description: "Toggle section visibility",
    duration: 6000,
    component: ExpandScene,
    color: "#ffd60a",
  },
  {
    id: "resize",
    label: "Viewport Resize",
    icon: HiArrowsPointingOut,
    description: "Dynamic viewport dimensions",
    duration: 7000,
    component: ResizeScene,
    color: "#5e5ce6",
  },
  {
    id: "width",
    label: "Dynamic Width",
    icon: HiArrowPath,
    description: "Width changes & text wrap",
    duration: 7000,
    component: WidthScene,
    color: THEME.red,
  },
];

// ===================================
// Main HeroDemo Component
// ===================================
export default function HeroDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [demoState, setDemoState] = useState<DemoState>({
    activity: "Ready",
    offset: 0,
    total: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-cycle and progress effect
  useEffect(() => {
    const duration = SCENES[activeTab].duration;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= duration) {
        setActiveTab((prev) => (prev + 1) % SCENES.length);
        setProgress(0);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [activeTab]);

  if (!mounted) {
    return (
      <div className="h-[360px] w-full rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 animate-pulse flex items-center justify-center">
        <div className="text-slate-600 text-sm">Loading demo...</div>
      </div>
    );
  }

  const ActiveComponent = SCENES[activeTab].component;
  const activeScene = SCENES[activeTab];

  return (
    <>
      <div className="w-full flex flex-col rounded-xl overflow-hidden font-mono text-sm shadow-xl border border-gray-200 dark:border-[#2a2a3a] bg-white dark:bg-[#12121a]">
        {/* ========== Header ========== */}
        <div className="h-10 flex items-center px-4 select-none bg-gray-50 dark:bg-[#1a1a25] border-b border-gray-200 dark:border-[#2a2a3a]">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 mr-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>

          {/* Title: Current Demo Name with Gradient */}
          <div className="flex-1 text-center">
            <span
              className="font-bold text-sm tracking-wide text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(90deg, ${THEME.blue}, ${THEME.green}, ${THEME.red})`,
              }}
            >
              {activeScene.label}
            </span>
          </div>

          {/* Step Indicator */}
          <div className="text-[10px] text-gray-500 dark:text-gray-400">
            {activeTab + 1}/{SCENES.length}
          </div>
        </div>

        {/* ========== Progress Bar ========== */}
        <div className="h-[2px] relative bg-gray-200 dark:bg-[#2a2a3a]">
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${THEME.blue}, ${THEME.green}, ${THEME.red})`,
            }}
          />
        </div>

        {/* ========== Main Content ========== */}
        <div
          className="flex-1 relative overflow-hidden p-3"
          style={{ background: THEME.dark, minHeight: "280px" }}
        >
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(${THEME.textMuted} 1px, transparent 1px), linear-gradient(90deg, ${THEME.textMuted} 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />

          {/* Canvas */}
          <div className="relative z-10 h-full rounded-lg overflow-hidden border border-[#2a2a3a]">
            <InkCanvas>
              <ActiveComponent active={true} onUpdate={setDemoState} />
            </InkCanvas>
          </div>
        </div>

        {/* ========== Footer Status Bar ========== */}
        <div
          className="h-6 flex items-center px-3 text-[10px] select-none"
          style={{
            background: `linear-gradient(90deg, ${THEME.blue}dd, ${THEME.green}cc, ${THEME.red}bb)`,
          }}
        >
          {/* Left: Activity */}
          <div className="flex-1 flex items-center gap-2 text-white">
            <span className="font-bold uppercase tracking-wider">
              {demoState.activity}
            </span>
            {demoState.meta && (
              <>
                <span className="opacity-30">│</span>
                <span className="opacity-80">{demoState.meta}</span>
              </>
            )}
          </div>

          {/* Right: Position */}
          <div className="flex items-center gap-2 text-white/70">
            <span>Ln {demoState.offset}</span>
            <span className="opacity-30">│</span>
            <span>Total {demoState.total}</span>
          </div>
        </div>
      </div>
    </>
  );
}
