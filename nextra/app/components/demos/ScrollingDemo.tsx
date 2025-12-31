import React, { useState, useRef } from "react";
import { Box, Text } from "ink";
import { InkCanvas } from "ink-canvas";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { THEME, Btn, StatusRow, ActionFeedback } from "./shared";

const ScrollingDemo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const viewportHeight = 8;

  const actions = [
    {
      label: "↓1",
      fn: () => {
        scrollRef.current?.scrollBy(1);
        setLastAction("scrollBy(1)");
      },
      color: THEME.blue,
    },
    {
      label: "↑1",
      fn: () => {
        scrollRef.current?.scrollBy(-1);
        setLastAction("scrollBy(-1)");
      },
      color: THEME.blue,
    },
    {
      label: "↓Page",
      fn: () => {
        scrollRef.current?.scrollBy(viewportHeight);
        setLastAction(`scrollBy(${viewportHeight})`);
      },
      color: THEME.green,
    },
    {
      label: "↑Page",
      fn: () => {
        scrollRef.current?.scrollBy(-viewportHeight);
        setLastAction(`scrollBy(-${viewportHeight})`);
      },
      color: THEME.green,
    },
    {
      label: "⇊End",
      fn: () => {
        scrollRef.current?.scrollToBottom();
        setLastAction("scrollToBottom()");
      },
      color: THEME.purple,
    },
    {
      label: "⇈Top",
      fn: () => {
        scrollRef.current?.scrollToTop();
        setLastAction("scrollToTop()");
      },
      color: THEME.purple,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {actions.map((a) => (
            <Btn key={a.label} onClick={a.fn} color={a.color}>
              {a.label}
            </Btn>
          ))}
          <Btn
            onClick={() => {
              scrollRef.current?.scrollToTop();
              setLastAction(null);
            }}
          >
            Reset
          </Btn>
        </div>
        <div
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a]"
          style={{ background: THEME.dark }}
        >
          <InkCanvas>
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
                  ref={scrollRef}
                  height={viewportHeight}
                  onScroll={setScrollOffset}
                  onContentHeightChange={setContentHeight}
                >
                  {Array.from({ length: 25 }, (_, i) => (
                    <Text key={i} color={i % 2 === 0 ? "white" : "gray"}>
                      {String(i + 1).padStart(2, "0")} │ Line {i + 1}
                    </Text>
                  ))}
                </ScrollView>
              </ScrollBarBox>
            </Box>
          </InkCanvas>
        </div>
      </div>
      <div className="lg:w-48 p-3 rounded-lg border border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
        <div className="space-y-1">
          <StatusRow label="Offset" value={scrollOffset} color={THEME.blue} />
          <StatusRow
            label="Content"
            value={contentHeight}
            color={THEME.green}
          />
          <StatusRow
            label="Viewport"
            value={viewportHeight}
            color={THEME.purple}
          />
          <StatusRow
            label="MaxScroll"
            value={Math.max(0, contentHeight - viewportHeight)}
            color={THEME.yellow}
          />
        </div>
        <ActionFeedback message={lastAction} color={THEME.blue} />
      </div>
    </div>
  );
};

export default ScrollingDemo;
