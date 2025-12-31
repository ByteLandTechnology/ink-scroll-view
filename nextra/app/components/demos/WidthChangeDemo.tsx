import { useState, useRef } from "react";
import { Box, Text } from "ink";
import { InkCanvas } from "ink-canvas";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { THEME, Btn, StatusRow, ActionFeedback } from "./shared";

const WidthChangeDemo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [width, setWidth] = useState(50);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const viewportHeight = 8;

  const changeWidth = (w: number) => {
    setWidth(w);
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    setLastAction(`Width → ${w}ch`);
  };

  const reset = () => {
    setWidth(50);
    scrollRef.current?.scrollToTop();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    setLastAction(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2 items-center">
          <span className="text-xs text-gray-500">Width:</span>
          {[20, 30, 40, 50, 60].map((w) => (
            <button
              key={w}
              onClick={() => changeWidth(w)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${width === w ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
            >
              {w}
            </button>
          ))}
          <Btn onClick={() => scrollRef.current?.scrollBy(-1)}>↑</Btn>
          <Btn onClick={() => scrollRef.current?.scrollBy(1)}>↓</Btn>
          <Btn onClick={reset}>Reset</Btn>
        </div>
        <div
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a]"
          style={{ background: THEME.dark }}
        >
          <InkCanvas>
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
                    ref={scrollRef}
                    height={viewportHeight}
                    onScroll={setScrollOffset}
                    onContentHeightChange={setContentHeight}
                  >
                    {Array.from({ length: 6 }, (_, i) => (
                      <Text key={i} wrap="wrap">
                        {String(i + 1).padStart(2, "0")} │ Long text that wraps
                        when width is reduced, changing content height
                        dynamically.
                      </Text>
                    ))}
                  </ScrollView>
                </ScrollBarBox>
              </Box>
            </Box>
          </InkCanvas>
        </div>
      </div>
      <div className="lg:w-48 p-3 rounded-lg border border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
        <div className="space-y-1">
          <StatusRow label="Width" value={`${width}ch`} color="#ff00ff" />
          <StatusRow
            label="ContentHeight"
            value={contentHeight}
            color={THEME.green}
          />
          <StatusRow label="Offset" value={scrollOffset} color={THEME.blue} />
        </div>
        <ActionFeedback message={lastAction} color="#ff00ff" />
        <div className="mt-2 p-2 rounded bg-gray-200 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400">
          Narrower width → more wrapping → taller content.
        </div>
      </div>
    </div>
  );
};

export default WidthChangeDemo;
