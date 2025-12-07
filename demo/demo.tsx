import React, { useState, useRef, useEffect, useCallback } from "react";
import { render, useInput, Text, Box, useStdout } from "ink";
import { ScrollView, ScrollViewRef } from "../src/index";

const Demo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const { stdout } = useStdout();
  const [width, setWidth] = useState<string | number>("100%");

  // Track scroll state for display
  const [scrollInfo, setScrollInfo] = useState({ scroll: 0, max: 0 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      scrollRef.current?.remeasure();
    };
    stdout?.on("resize", handleResize);
    return () => {
      stdout?.off("resize", handleResize);
    };
  }, [stdout]);

  const updateScrollInfo = useCallback(() => {
    if (scrollRef.current) {
      setScrollInfo({
        scroll: scrollRef.current.getScrollOffset(),
        max: scrollRef.current.getMaxScrollOffset(),
      });
    }
  }, []);

  // Update info after layout
  useEffect(() => {
    // Small timeout to wait for layout
    setTimeout(updateScrollInfo, 100);
  }, [width, updateScrollInfo]);

  useInput((input, key) => {
    if (input === "q") process.exit(0);

    if (key.upArrow) {
      scrollRef.current?.scrollBy(-1);
    } else if (key.downArrow) {
      scrollRef.current?.scrollBy(1);
    } else if (key.pageUp) {
      const vh = scrollRef.current?.getViewportHeight() || 10;
      scrollRef.current?.scrollBy(-vh);
    } else if (key.pageDown) {
      const vh = scrollRef.current?.getViewportHeight() || 10;
      scrollRef.current?.scrollBy(vh);
    }

    if (input === "w") {
      // Toggle widths
      setWidth((prev) => {
        if (prev === "100%") return 60;
        if (prev === 60) return 40;
        return "100%";
      });
      // Allow re-render then measure
      setTimeout(() => scrollRef.current?.remeasure(), 50);
    }
  });

  return (
    <Box flexDirection="column" height={process.stdout.rows}>
      <Box borderStyle="round" borderColor="cyan" paddingX={1} flexShrink={0}>
        <Text>
          <Text bold color="cyan">
            Simple Scroll Demo
          </Text>{" "}
          |<Text color="yellow"> Width: {width}</Text> |
          <Text color="green">
            {" "}
            Scroll: {scrollInfo.scroll}/{scrollInfo.max}
          </Text>
        </Text>
      </Box>

      <Box marginY={1}>
        <Text color="gray">
          Logs: [Up/Down] Scroll • [w] Toggle Width • [q] Quit
        </Text>
      </Box>

      <Box
        flexGrow={1}
        width="100%"
        borderStyle="single"
        borderColor="white"
        padding={1} // Padding around the scrollview container to show it's constrained
      >
        {/* Constrain the ScrollView width here */}
        <Box width={width} borderStyle="single" borderColor="blue">
          <ScrollView
            ref={scrollRef}
            onScroll={(offset) => {
              setScrollInfo((prev) => ({ ...prev, scroll: offset }));
            }}
          >
            {[
              <Box
                key="tall-content"
                flexDirection="column"
                height={60}
                width="100%"
                borderStyle="double"
                borderColor="magenta"
                paddingX={2}
              >
                <Text underline bold>
                  HEADER OF TALL BOX
                </Text>
                <Box height={1} />
                <Text wrap="wrap">
                  Line 1: Beginning of the long journey... This text should wrap
                  if the width is small enough to trigger wrapping.
                </Text>
                <Text wrap="wrap">Line 2: Still near the top.</Text>
                <Box height={5} borderStyle="single" borderColor="gray">
                  <Text>Some nested content box here.</Text>
                </Box>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Text key={i}>Filler line {i + 3}</Text>
                ))}
                <Box
                  flexGrow={1}
                  justifyContent="center"
                  alignItems="center"
                  borderStyle="classic"
                  borderColor="yellow"
                >
                  <Text color="yellow">MIDDLE SECTION (Flexible Space)</Text>
                </Box>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Text key={i + 20}>Bottom Filler {i}</Text>
                ))}
                <Text>Line 98: Almost there...</Text>
                <Text>Line 99: The End.</Text>
                <Text inverse>FOOTER</Text>
              </Box>,
            ]}
          </ScrollView>
        </Box>
      </Box>
    </Box>
  );
};

console.clear();
render(<Demo />);
