import React, { useState, useRef } from "react";
import { Box, Text } from "ink";
import { InkCanvas } from "ink-canvas";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { HiPlus, HiMinus } from "react-icons/hi2";
import { THEME, Btn, StatusRow, ActionFeedback } from "./shared";

const DynamicItemsDemo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [items, setItems] = useState(
    Array.from({ length: 12 }, (_, i) => ({ id: i, text: `Item ${i + 1}` })),
  );
  const [nextId, setNextId] = useState(12);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const viewportHeight = 8;

  const addTop = () => {
    setItems((p) => [{ id: nextId, text: "NEW (top)", color: "yellow" }, ...p]);
    setNextId((n) => n + 1);
    setLastAction("Added at top");
  };
  const addMid = () => {
    const m = Math.floor(items.length / 2);
    setItems((p) => [
      ...p.slice(0, m),
      { id: nextId, text: "NEW (mid)", color: "green" },
      ...p.slice(m),
    ]);
    setNextId((n) => n + 1);
    setLastAction("Added at middle");
  };
  const addEnd = () => {
    setItems((p) => [...p, { id: nextId, text: "NEW (end)", color: "cyan" }]);
    setNextId((n) => n + 1);
    setLastAction("Added at end");
  };
  const rmTop = () => {
    if (items.length > 1) {
      setItems((p) => p.slice(1));
      setLastAction("Removed first");
    }
  };
  const rmEnd = () => {
    if (items.length > 1) {
      setItems((p) => p.slice(0, -1));
      setLastAction("Removed last");
    }
  };
  const reset = () => {
    setItems(
      Array.from({ length: 12 }, (_, i) => ({ id: i, text: `Item ${i + 1}` })),
    );
    setNextId(12);
    scrollRef.current?.scrollToTop();
    setLastAction(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <Btn onClick={addTop} color={THEME.yellow}>
            <HiPlus className="w-3 h-3" />
            Top
          </Btn>
          <Btn onClick={addMid} color={THEME.green}>
            <HiPlus className="w-3 h-3" />
            Mid
          </Btn>
          <Btn onClick={addEnd} color={THEME.blue}>
            <HiPlus className="w-3 h-3" />
            End
          </Btn>
          <Btn onClick={rmTop} color={THEME.red}>
            <HiMinus className="w-3 h-3" />
            First
          </Btn>
          <Btn onClick={rmEnd} color={THEME.red}>
            <HiMinus className="w-3 h-3" />
            Last
          </Btn>
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
              <ScrollBarBox
                borderStyle="single"
                borderColor="green"
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
                  {items.map((item, i) => (
                    <Text
                      key={item.id}
                      color={
                        (item as any).color || (i % 2 === 0 ? "white" : "gray")
                      }
                    >
                      {String(i + 1).padStart(2, "0")} │ {item.text}
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
          <StatusRow label="Items" value={items.length} color={THEME.blue} />
          <StatusRow label="Offset" value={scrollOffset} color={THEME.green} />
          <StatusRow
            label="Visible"
            value={`${scrollOffset + 1}-${Math.min(scrollOffset + viewportHeight, items.length)}`}
            color={THEME.purple}
          />
        </div>
        <ActionFeedback message={lastAction} color={THEME.green} />
      </div>
    </div>
  );
};

export default DynamicItemsDemo;
