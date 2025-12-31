import React, { useState, useRef } from "react";
import { Box, Text } from "ink";
import { InkCanvas } from "ink-canvas";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { THEME, Btn, StatusRow, ActionFeedback } from "./shared";

const HeightChangeDemo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [viewportHeight, setViewportHeight] = useState(8);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const changeHeight = (h: number) => {
    setViewportHeight(h);
    setTimeout(() => {
      scrollRef.current?.remeasure();
      const newMax = Math.max(0, contentHeight - h);
      setLastAction(`Height → ${h}. MaxScroll = ${newMax}`);
    }, 100);
  };

  const reset = () => {
    setViewportHeight(8);
    scrollRef.current?.scrollToTop();
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    setLastAction(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2 items-center">
          <span className="text-xs text-gray-500">Height:</span>
          {[4, 6, 8, 10, 12].map((h) => (
            <button
              key={h}
              onClick={() => changeHeight(h)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${viewportHeight === h ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
            >
              {h}
            </button>
          ))}
          <Btn
            onClick={() => scrollRef.current?.scrollToBottom()}
            color={THEME.blue}
          >
            ⇊End
          </Btn>
          <Btn
            onClick={() => scrollRef.current?.scrollTo(8)}
            color={THEME.green}
          >
            →8
          </Btn>
          <Btn onClick={reset}>Reset</Btn>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          💡 Scroll down first, then resize to see offset clamping
        </div>
        <div
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a]"
          style={{ background: THEME.dark }}
        >
          <InkCanvas>
            <Box height="100%" width="100%">
              <ScrollBarBox
                borderStyle="single"
                borderColor="blue"
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
                  {Array.from({ length: 18 }, (_, i) => (
                    <Text key={i} color={i % 2 === 0 ? "white" : "gray"}>
                      {String(i + 1).padStart(2, "0")} │ Row {i + 1}
                    </Text>
                  ))}
                </ScrollView>
              </ScrollBarBox>
            </Box>
          </InkCanvas>
        </div>
      </div>
      <div className="lg:w-52 p-3 rounded-lg border border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
        <div className="space-y-1">
          <StatusRow
            label="Viewport"
            value={viewportHeight}
            color={THEME.purple}
          />
          <StatusRow
            label="Content"
            value={contentHeight}
            color={THEME.green}
          />
          <StatusRow label="Offset" value={scrollOffset} color={THEME.blue} />
          <StatusRow
            label="MaxScroll"
            value={Math.max(0, contentHeight - viewportHeight)}
            color={THEME.yellow}
          />
        </div>
        <ActionFeedback message={lastAction} color={THEME.purple} />
        <div className="mt-2 p-2 rounded bg-gray-200 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400">
          <strong>Clamping:</strong> If viewport grows, maxScroll shrinks.
          Offset gets clamped.
        </div>
      </div>
    </div>
  );
};

export default HeightChangeDemo;
