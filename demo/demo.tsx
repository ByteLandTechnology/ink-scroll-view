import React, { useState, useRef, useEffect, useCallback } from "react";
import { render, useInput, Text, Box, useStdout } from "ink";
import { ScrollList, ScrollListRef, ScrollAlignment } from "../src/index";

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
    `ScrollList should handle this dynamic content seamlessly.\n` +
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
  alignment,
  width,
  itemCount,
}: {
  alignment: ScrollAlignment;
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
      🎮 ScrollList Demo | <Text color="green">A</Text>lign:{" "}
      <Text color="yellow">{alignment.toUpperCase()}</Text> |{" "}
      <Text color="green">W</Text>idth: <Text color="yellow">{width}</Text> |{" "}
      Items: <Text color="cyan">{itemCount}</Text>
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
  const listRef = useRef<ScrollListRef>(null);
  const { stdout } = useStdout();

  // State
  const [items, setItems] = useState<DemoItemData[]>(() =>
    Array.from({ length: 20 }, (_, i) => generateItem(i)),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [alignment, setAlignment] = useState<ScrollAlignment>("auto");
  const [width, setWidth] = useState<WidthSetting>("100%");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Metrics for Status Bar
  const [metrics, setMetrics] = useState({ offset: 0, max: 0, viewport: 0 });

  // Helpers
  const updateMetrics = useCallback(() => {
    if (listRef.current) {
      setMetrics({
        offset: listRef.current.getScrollOffset(),
        max: listRef.current.getMaxScrollOffset(),
        viewport: listRef.current.getViewportHeight(),
      });
    }
  }, []);

  // Listen for resize
  useEffect(() => {
    const handleResize = () => {
      listRef.current?.remeasure();
      updateMetrics();
    };
    stdout?.on("resize", handleResize);
    return () => {
      stdout?.off("resize", handleResize);
    };
  }, [stdout, updateMetrics]);

  // Ensure layout updates when content changes significantly
  useEffect(() => {
    // Small delay to allow render to complete before measuring
    setTimeout(() => {
      listRef.current?.remeasure();
      updateMetrics();
    }, 10);
  }, [items.length, width, expandedItems, updateMetrics]);

  useInput((input, key) => {
    if (input === "q") process.exit(0);

    // Navigation
    if (key.upArrow) {
      listRef.current?.selectPrevious();
      listRef.current?.scrollToItem(listRef.current.getSelectedIndex());
    } else if (key.downArrow) {
      listRef.current?.selectNext();
      listRef.current?.scrollToItem(listRef.current.getSelectedIndex());
    } else if (key.pageUp) {
      const viewH = metrics.viewport || 5;
      listRef.current?.scrollBy(-(viewH - 1));
      updateMetrics();
    } else if (key.pageDown) {
      const viewH = metrics.viewport || 5;
      listRef.current?.scrollBy(viewH - 1);
      updateMetrics();
    }

    // Configuration
    else if (input === "a") {
      const modes: ScrollAlignment[] = ["auto", "center", "top", "bottom"];
      const next = modes[(modes.indexOf(alignment) + 1) % modes.length];
      setAlignment(next);
      // Re-select current to apply new alignment immediately
      if (listRef.current) {
        const current = listRef.current.getSelectedIndex();
        listRef.current.select(current, next);
      }
    } else if (input === "w") {
      const widths: WidthSetting[] = ["100%", "70%", "auto"];
      setWidth(widths[(widths.indexOf(width) + 1) % widths.length]);
    }

    // Content Manipulation
    else if (input === " ") {
      const idx = listRef.current?.getSelectedIndex() ?? -1;
      if (idx >= 0) {
        setExpandedItems((prev) => {
          const next = new Set(prev);
          if (next.has(idx)) next.delete(idx);
          else next.add(idx);
          return next;
        });
        // Re-measure only the affected item (more efficient than remeasure)
        setTimeout(() => {
          listRef.current?.remeasureItem(idx);
          updateMetrics();
        }, 0);
      }
    } else if (input === "e") {
      const all = new Set(items.map((_, i) => i));
      setExpandedItems(all);
    } else if (input === "c") {
      setExpandedItems(new Set());
    } else if (input === "+" || input === "=") {
      setItems((prev) => [...prev, generateItem(prev.length)]);
    } else if (input === "-" || input === "_") {
      setItems((prev) => prev.slice(0, -1));
      // Adjust selection if it was on the removed item
      if (selectedIndex >= items.length - 1) {
        listRef.current?.select(Math.max(0, items.length - 2));
      }
    }
  });

  return (
    <Box flexDirection="column" height={process.stdout.rows - 1}>
      <ControlPanel
        alignment={alignment}
        width={width}
        itemCount={items.length}
      />

      <Box flexGrow={1} borderStyle="single" borderColor="white">
        <ScrollList
          ref={listRef}
          height="100%"
          width="100%"
          onSelectionChange={setSelectedIndex}
          onScroll={updateMetrics}
          selectedIndex={selectedIndex}
          scrollAlignment={alignment}
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
        </ScrollList>
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
