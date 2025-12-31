import { useState, useRef, useMemo } from "react";
import { Box, Text } from "ink";
import { InkCanvas } from "ink-canvas";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { THEME, Btn, StatusRow, ActionFeedback } from "./shared";

const ExpandCollapseDemo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [sections, setSections] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      title: `Section ${i + 1}`,
      expanded: false,
    })),
  );
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const viewportHeight = 8;

  // Calculate expected content height
  const expectedHeight = useMemo(() => {
    return sections.reduce((h, s) => h + (s.expanded ? 5 : 1), 0);
  }, [sections]);

  const toggle = (idx: number) => {
    const s = sections[idx];
    setSections((p) =>
      p.map((sec, i) =>
        i === idx ? { ...sec, expanded: !sec.expanded } : sec,
      ),
    );
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    setLastAction(`${s.expanded ? "Collapsed" : "Expanded"} "${s.title}"`);
  };

  const expandAll = () => {
    setSections((p) => p.map((s) => ({ ...s, expanded: true })));
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    setLastAction("Expanded all");
  };

  const collapseAll = () => {
    setSections((p) => p.map((s) => ({ ...s, expanded: false })));
    setTimeout(() => scrollRef.current?.remeasure(), 100);
    setLastAction("Collapsed all");
  };

  const reset = () => {
    setSections(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        title: `Section ${i + 1}`,
        expanded: false,
      })),
    );
    scrollRef.current?.scrollToTop();
    setLastAction(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {sections.slice(0, 6).map((s, i) => (
            <button
              key={s.id}
              onClick={() => toggle(i)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${s.expanded ? "bg-green-600/30 text-green-400 border border-green-600/50" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`}
            >
              {i + 1}
            </button>
          ))}
          <Btn onClick={expandAll} color={THEME.green}>
            All+
          </Btn>
          <Btn onClick={collapseAll} color={THEME.red}>
            All-
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
                borderStyle="double"
                borderColor="yellow"
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
                  {sections.map((s) => (
                    <Box key={s.id} flexDirection="column">
                      <Text color={s.expanded ? "green" : "white"} bold>
                        {s.expanded ? "▼" : "▶"} {s.title}
                      </Text>
                      {s.expanded && (
                        <Box
                          marginLeft={2}
                          borderStyle="single"
                          borderColor="gray"
                        >
                          <Text color="gray">{`Status: OK\nData: ...\n`}</Text>
                        </Box>
                      )}
                    </Box>
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
            label="Expanded"
            value={`${sections.filter((s) => s.expanded).length}/${sections.length}`}
            color={THEME.yellow}
          />
          <StatusRow
            label="ContentHeight"
            value={contentHeight}
            color={THEME.green}
          />
          <StatusRow
            label="Expected"
            value={expectedHeight}
            color={THEME.purple}
          />
          <StatusRow label="Offset" value={scrollOffset} color={THEME.blue} />
        </div>
        <ActionFeedback message={lastAction} color={THEME.yellow} />
        <div className="mt-2 p-2 rounded bg-gray-200 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400">
          <strong>Tip:</strong>{" "}
          <code className="text-purple-600 dark:text-purple-400">
            remeasure()
          </code>{" "}
          recalculates height after expand/collapse.
        </div>
      </div>
    </div>
  );
};

export default ExpandCollapseDemo;
