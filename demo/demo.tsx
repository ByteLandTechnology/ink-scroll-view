import React, { useState, useRef, useEffect, useCallback } from "react";
import { render, useInput, Text, Box, useStdout } from "ink";
import { ScrollView, ScrollViewRef } from "../src/index";

// --- Types & Constants ---

type WidthSetting = "100%" | "70%" | "auto";

interface DemoItemData {
  id: number;
  title: string;
  summary: string;
  details: string;
}

// --- Helper Functions ---

const generateItem = (id: number): DemoItemData => ({
  id,
  title: `List Item #${id}`,
  summary: `This is a summary for item ${id}. It has some text.`,
  details:
    `Here are the detailed contents for item ${id}.\n` +
    `It spans multiple lines to demonstrate variable height.\n` +
    `ScrollView handles this dynamic content seamlessly.\n` +
    `• Detail point A\n• Detail point B\n• Detail point C`,
});

// --- Components ---

const DemoItem = ({
  data,
  isSelected,
  isExpanded,
  width,
}: {
  data: DemoItemData;
  isSelected: boolean;
  isExpanded: boolean;
  width: WidthSetting;
}) => {
  return (
    <Box
      flexDirection="column"
      borderStyle={isSelected ? "double" : "single"}
      borderColor={isSelected ? "cyan" : "gray"}
      paddingX={1}
      width={width === "auto" ? undefined : width}
      marginBottom={0}
    >
      <Box justifyContent="space-between">
        <Text color={isSelected ? "cyan" : "white"} bold={isSelected}>
          {isSelected ? "▶ " : "  "}
          {data.title}
        </Text>
        <Text color="gray">{isExpanded ? "[-]" : "[+]"}</Text>
      </Box>

      <Text color="gray" wrap="wrap">
        {data.summary}
      </Text>

      {isExpanded && (
        <Box marginTop={1} borderStyle="single" borderColor="blue" paddingX={1}>
          <Text color="yellow">{data.details}</Text>
        </Box>
      )}
    </Box>
  );
};

const ControlPanel = ({
  width,
  itemCount,
}: {
  width: WidthSetting;
  itemCount: number;
}) => (
  <Box
    borderStyle="round"
    borderColor="magenta"
    flexDirection="column"
    paddingX={1}
    height={5}
    flexShrink={0}
  >
    <Text bold color="magenta" wrap="truncate">
      🎮 ScrollView Demo | <Text color="green">W</Text>idth:{" "}
      <Text color="yellow">{width}</Text> | Items:{" "}
      <Text color="cyan">{itemCount}</Text>
    </Text>
    <Text color="gray" wrap="truncate">
      ↑/↓: Select | Space: Expand | e/c: Expand/Collapse All | +/-: Add/Remove |
      q: Quit
    </Text>
  </Box>
);

const StatusBar = ({
  selectedIndex,
  scrollOffset,
  maxScroll,
  viewportHeight,
}: {
  selectedIndex: number;
  scrollOffset: number;
  maxScroll: number;
  viewportHeight: number;
}) => (
  <Box
    borderStyle="single"
    borderColor="gray"
    paddingX={1}
    height={3}
    flexShrink={0}
  >
    <Box width="30%">
      <Text wrap="truncate">
        Selected:{" "}
        <Text color="cyan" bold>
          {selectedIndex}
        </Text>
      </Text>
    </Box>
    <Box width="40%" justifyContent="center">
      <Text wrap="truncate">
        Scroll: <Text color="green">{scrollOffset}</Text> / {maxScroll}
      </Text>
    </Box>
    <Box width="30%" justifyContent="flex-end">
      <Text wrap="truncate">Viewport: {viewportHeight}</Text>
    </Box>
  </Box>
);

// --- Main Demo ---

const Demo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const { stdout } = useStdout();

  // State
  const [items, setItems] = useState<DemoItemData[]>(() =>
    Array.from({ length: 20 }, (_, i) => generateItem(i)),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [width, setWidth] = useState<WidthSetting>("100%");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Metrics for Status Bar
  const [metrics, setMetrics] = useState({ offset: 0, max: 0, viewport: 0 });

  // Helpers
  const updateMetrics = useCallback(() => {
    if (scrollRef.current) {
      setMetrics({
        offset: scrollRef.current.getScrollOffset(),
        max: scrollRef.current.getMaxScrollOffset(),
        viewport: scrollRef.current.getViewportHeight(),
      });
    }
  }, []);

  // Listen for resize
  useEffect(() => {
    const handleResize = () => {
      scrollRef.current?.remeasure();
    };
    stdout?.on("resize", handleResize);
    return () => {
      stdout?.off("resize", handleResize);
    };
  }, [stdout]);

  // Ensure scroll metrics update when content changes
  const handleContentChange = useCallback(() => {
    // Defer to allow layout to settle
    setTimeout(updateMetrics, 10);
  }, [updateMetrics]);

  // Helper to scroll to selected item manualy
  const scrollToItem = useCallback((index: number) => {
    const layout = scrollRef.current?.getItemLayout(index);
    if (!layout) return;

    const { top, height } = layout;
    const { visibleTop, visibleHeight } = layout;
    // Simple visibility check: is it fully visible?
    if (visibleHeight < height) {
      // Not fully visible. Scroll to it.
      // If top < currentScroll -> scroll to top
      // If bottom > currentScroll + viewport -> scroll to bottom-viewport
      const viewportH = scrollRef.current?.getViewportHeight() || 0;
      const currentScroll = scrollRef.current?.getScrollOffset() || 0;
      const bottom = top + height;

      if (top < currentScroll) {
        scrollRef.current?.scrollTo(top);
      } else if (bottom > currentScroll + viewportH) {
        scrollRef.current?.scrollTo(bottom - viewportH);
      }
    }
  }, []);

  // Effect: Scroll to selected item when it changes
  useEffect(() => {
    // Small timeout to ensure layout is ready if sizes changed
    setTimeout(() => scrollToItem(selectedIndex), 20);
  }, [selectedIndex, scrollToItem]);

  useInput((input, key) => {
    if (input === "q") process.exit(0);

    // Navigation
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
    } else if (key.pageUp) {
      const viewH = metrics.viewport || 5;
      scrollRef.current?.scrollBy(-(viewH - 1));
    } else if (key.pageDown) {
      const viewH = metrics.viewport || 5;
      scrollRef.current?.scrollBy(viewH - 1);
    }

    // Configuration
    else if (input === "w") {
      const widths: WidthSetting[] = ["100%", "70%", "auto"];
      setWidth(widths[(widths.indexOf(width) + 1) % widths.length]);
      setTimeout(() => scrollRef.current?.remeasure(), 50);
    }

    // Content Manipulation
    else if (input === " ") {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(selectedIndex)) next.delete(selectedIndex);
        else next.add(selectedIndex);
        return next;
      });
      // Trigger remeasure only for this item for efficiency
      scrollRef.current?.remeasureItem(selectedIndex);
      handleContentChange();
    } else if (input === "e") {
      const all = new Set(items.map((_, i) => i));
      setExpandedItems(all);
      setTimeout(() => {
        scrollRef.current?.remeasure();
        scrollToItem(selectedIndex);
        updateMetrics();
      }, 50);
    } else if (input === "c") {
      setExpandedItems(new Set());
      setTimeout(() => {
        scrollRef.current?.remeasure();
        scrollToItem(selectedIndex);
        updateMetrics();
      }, 50);
    } else if (input === "+" || input === "=") {
      setItems((prev) => [...prev, generateItem(prev.length)]);
      updateMetrics();
    } else if (input === "-" || input === "_") {
      setItems((prev) => prev.slice(0, -1));
      setSelectedIndex((prev) => Math.min(prev, items.length - 2));
      updateMetrics();
    }
  });

  return (
    <Box flexDirection="column" height={process.stdout.rows - 1}>
      <ControlPanel width={width} itemCount={items.length} />

      <Box flexGrow={1} borderStyle="single" borderColor="white">
        <ScrollView
          ref={scrollRef}
          onScroll={updateMetrics}
          onLayout={updateMetrics}
          onItemLayoutChange={(index, layout) => {
            // If the item expanding/collapsing is the selected one, ensure it stays visible
            if (index === selectedIndex) {
              scrollToItem(index);
            }
            updateMetrics();
          }}
        >
          {items.map((item, i) => (
            <DemoItem
              key={item.id} // Use stable ID as key
              data={item}
              isSelected={i === selectedIndex}
              isExpanded={expandedItems.has(i)}
              width={width}
            />
          ))}
        </ScrollView>
      </Box>

      <StatusBar
        selectedIndex={selectedIndex}
        scrollOffset={metrics.offset}
        maxScroll={metrics.max}
        viewportHeight={metrics.viewport}
      />
    </Box>
  );
};

console.clear();
render(<Demo />);
