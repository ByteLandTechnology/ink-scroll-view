/**
 * @fileoverview Auto Demo for ink-scroll-view
 *
 * This file provides automated demonstrations of ScrollView capabilities.
 * It is used to generate animated SVG recordings (via termtosvg) for documentation.
 *
 * Each demo category showcases a specific feature of the ScrollView component:
 * - scrolling: Basic scroll operations (scrollTo, scrollBy, scrollToTop, scrollToBottom)
 * - items: Dynamic item management (adding/removing items)
 * - expand: Expand/collapse functionality with dynamic height changes
 * - resize: ScrollView height changes and remeasure behavior
 * - width: Dynamic width changes affecting text wrapping
 *
 * @usage
 * ```bash
 * # Run a specific demo category
 * npx tsx demo/auto-demo.tsx scrolling
 * npx tsx demo/auto-demo.tsx items
 * npx tsx demo/auto-demo.tsx expand
 * npx tsx demo/auto-demo.tsx resize
 * npx tsx demo/auto-demo.tsx width
 *
 * # Generate SVG animation (requires termtosvg)
 * termtosvg scroll.svg -c "npx tsx demo/auto-demo.tsx scrolling" -t putty -g 70x20
 * ```
 */

import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";
import { render, Text, Box, Spacer } from "ink";
import { ScrollView, ScrollViewRef } from "../src/index";

// =============================================================================
// Configuration
// =============================================================================

/**
 * Get the demo category from command line argument.
 * Defaults to "scrolling" if no argument is provided.
 */
const DEMO_CATEGORY = process.argv[2] || "scrolling";

/**
 * Available demo categories with their display names.
 * Used for validation and display purposes.
 */
const CATEGORIES = {
  scrolling: "Scrolling",
  items: "Dynamic Items",
  expand: "Dynamic Expand/Collapse",
  resize: "ScrollView Resize",
  width: "Dynamic Width",
};

// Validate the provided category
if (!Object.keys(CATEGORIES).includes(DEMO_CATEGORY)) {
  console.error(`Invalid category: ${DEMO_CATEGORY}`);
  console.error(`Available categories: ${Object.keys(CATEGORIES).join(", ")}`);
  process.exit(1);
}

// =============================================================================
// Split Demo Layout Component
// =============================================================================

/**
 * Props for the SplitDemoLayout component.
 */
interface SplitDemoLayoutProps {
  /** Title of the demo (not displayed, kept for reference) */
  title: string;
  /** Current action description shown at the top */
  description?: string;
  /** Content to render in both ScrollViews */
  children?: ReactNode;
  /** Ref to the left (debug mode) ScrollView */
  leftRef?: React.RefObject<ScrollViewRef | null>;
  /** Ref to the right (normal mode) ScrollView */
  rightRef?: React.RefObject<ScrollViewRef | null>;
  /** Default items to render if children is not provided */
  items?: ReactElement[];
  /** Height of the ScrollView viewport */
  height?: number;
  /** Current scroll offset (for display) */
  scrollOffset?: number;
  /** Additional props passed to the left ScrollView */
  leftScrollViewProps?: any;
  /** Additional props passed to the right ScrollView */
  rightScrollViewProps?: any;
}

/**
 * SplitDemoLayout - A side-by-side comparison layout for demos.
 *
 * This component renders two ScrollViews side by side:
 * - Left side: Debug mode enabled (shows viewport boundaries)
 * - Right side: Normal mode (production-like rendering)
 *
 * Both ScrollViews receive the same content and props, allowing users
 * to compare the debug visualization with the actual rendered output.
 *
 * @example
 * ```tsx
 * <SplitDemoLayout
 *   title="My Demo"
 *   description="Demonstrating scrolling..."
 *   leftRef={leftRef}
 *   rightRef={rightRef}
 *   scrollOffset={5}
 *   height={10}
 * >
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 * </SplitDemoLayout>
 * ```
 */
export const SplitDemoLayout: React.FC<SplitDemoLayoutProps> = ({
  title,
  description,
  children,
  leftRef,
  rightRef,
  items = [],
  height = 10,
  scrollOffset = 0,
  leftScrollViewProps = {},
  rightScrollViewProps = {},
}) => {
  // Container height includes padding for the outer box
  const containerHeight = height + 8;

  // Create default items if no children or items are provided
  const defaultItems =
    items.length > 0
      ? items
      : Array.from({ length: 20 }, (_, i) => (
          <Text key={i}>{i + 1}. Item</Text>
        ));

  return (
    <Box flexDirection="column" width={70}>
      {/* Description bar - shows current action being demonstrated */}
      {description && (
        <Box paddingX={1}>
          <Text color="yellow" wrap="truncate">
            {description}
          </Text>
        </Box>
      )}

      {/* Split view container - two ScrollViews side by side */}
      <Box flexDirection="row">
        {/* Left side - DEBUG MODE */}
        {/* Shows the ScrollView with debug=true, displaying viewport boundaries */}
        <Box flexDirection="column" flexBasis={1} flexGrow={1} flexShrink={0}>
          {/* Header showing mode, width, and scroll offset */}
          <Box paddingX={1}>
            <Text color="green" bold>
              DEBUG
            </Text>
            <Spacer />
            {leftScrollViewProps.width && (
              <Text color="gray">W:{leftScrollViewProps.width}</Text>
            )}
            <Spacer />
            {typeof scrollOffset === "number" && (
              <Text color="gray">S:{scrollOffset}</Text>
            )}
          </Box>
          {/* Container box with overflow hidden to simulate viewport clipping */}
          <Box
            height={containerHeight}
            borderStyle="single"
            borderColor="blue"
            flexDirection="column"
            overflow="hidden"
            paddingY={2}
          >
            <ScrollView
              ref={leftRef}
              debug={true}
              height={height}
              width="100%"
              borderStyle="single"
              borderColor="green"
              {...leftScrollViewProps}
            >
              {children || defaultItems}
            </ScrollView>
          </Box>
        </Box>

        {/* Right side - NORMAL MODE */}
        {/* Shows the ScrollView without debug mode (production-like) */}
        <Box flexDirection="column" flexBasis={1} flexGrow={1} flexShrink={0}>
          {/* Header showing mode, width, and scroll offset */}
          <Box paddingX={1}>
            <Text color="magenta" bold>
              NORMAL
            </Text>
            <Spacer />
            {rightScrollViewProps.width && (
              <Text color="gray">W:{rightScrollViewProps.width}</Text>
            )}
            <Spacer />
            {typeof scrollOffset === "number" && (
              <Text color="gray">S:{scrollOffset}</Text>
            )}
          </Box>
          {/* Container box with overflow hidden to simulate viewport clipping */}
          <Box
            height={containerHeight}
            borderStyle="single"
            borderColor="red"
            flexDirection="column"
            overflow="hidden"
            paddingY={2}
          >
            <ScrollView
              ref={rightRef}
              height={height}
              width="100%"
              borderStyle="single"
              borderColor="magenta"
              {...rightScrollViewProps}
            >
              {children || defaultItems}
            </ScrollView>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// =============================================================================
// Demo Components
// =============================================================================

/**
 * ScrollingDemo - Demonstrates basic scroll operations.
 *
 * This demo showcases:
 * 1. Smooth scrolling down line by line (scrollTo)
 * 2. Scrolling to the bottom (scrollToBottom)
 * 3. Scrolling back to top (scrollToTop)
 *
 * The demo runs automatically with timed actions and exits after completion.
 */
const ScrollingDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: any;
  rightRef: any;
}) => {
  const [description, setDescription] = useState(
    "Initializing scrolling demo...",
  );
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // === Demo Sequence ===

    // Step 1: Start smooth scrolling down
    timeouts.push(
      setTimeout(() => setDescription("Smooth scrolling down..."), 1000),
    );
    timeouts.push(
      setTimeout(() => {
        let offset = 0;
        // Scroll down one line at a time with 500ms interval
        const scrollInterval = setInterval(() => {
          offset += 1;
          if (offset < 10) {
            leftRef.current?.scrollTo(offset);
            rightRef.current?.scrollTo(offset);
          } else {
            clearInterval(scrollInterval);
          }
        }, 500);
      }, 500),
    );

    // Step 2: Jump to the bottom
    timeouts.push(
      setTimeout(() => setDescription("Scrolling to bottom..."), 6000),
    );
    timeouts.push(
      setTimeout(() => {
        leftRef.current?.scrollToBottom();
        rightRef.current?.scrollToBottom();
      }, 6500),
    );

    // Step 3: Return to top
    timeouts.push(
      setTimeout(() => setDescription("Scrolling back to top..."), 8000),
    );
    timeouts.push(
      setTimeout(() => {
        leftRef.current?.scrollToTop();
        rightRef.current?.scrollToTop();
      }, 8500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), 9500));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <SplitDemoLayout
      title="📜 Scrolling Demonstrations"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      scrollOffset={scrollOffset}
      height={8}
    >
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i}>Line {i + 1}</Text>
      ))}
    </SplitDemoLayout>
  );
};

/**
 * DynamicItemsDemo - Demonstrates dynamic item management.
 *
 * This demo showcases how ScrollView handles:
 * 1. Adding items at the top of the list
 * 2. Adding items in the middle of the list
 * 3. Removing items from the top
 * 4. Adding items at the bottom
 *
 * ScrollView maintains scroll position stability when items change.
 */
const DynamicItemsDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: any;
  rightRef: any;
}) => {
  const [description, setDescription] = useState(
    "Initializing dynamic items demo...",
  );
  const [dynamicItems, setDynamicItems] = useState<any[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // Initialize with a set of items
    setDynamicItems(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        text: `Item ${i + 1}`,
        color: undefined,
      })),
    );

    // === Demo Sequence ===

    // Step 1: Add item at the top
    timeouts.push(
      setTimeout(() => setDescription("Adding items at top..."), 1000),
    );
    timeouts.push(
      setTimeout(() => {
        setDynamicItems((prev) => [
          { id: Date.now(), text: "🔥 New", color: "red" },
          ...prev,
        ]);
      }, 1500),
    );

    // Step 2: Add item in the middle
    timeouts.push(
      setTimeout(() => setDescription("Adding in middle..."), 3000),
    );
    timeouts.push(
      setTimeout(() => {
        setDynamicItems((prev) => [
          ...prev.slice(0, 4),
          { id: Date.now(), text: "💎 Special", color: "cyan" },
          ...prev.slice(4),
        ]);
      }, 3500),
    );

    // Step 3: Remove items from the top
    timeouts.push(
      setTimeout(() => setDescription("Removing from top..."), 5000),
    );
    timeouts.push(
      setTimeout(() => {
        setDynamicItems((prev) => prev.slice(2));
      }, 5500),
    );

    // Step 4: Add item at the bottom
    timeouts.push(
      setTimeout(() => setDescription("Adding at bottom..."), 7000),
    );
    timeouts.push(
      setTimeout(() => {
        setDynamicItems((prev) => [
          ...prev,
          { id: Date.now(), text: "🎉 End", color: "green" },
        ]);
      }, 7500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), 8500));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <SplitDemoLayout
      title="➕ Dynamic Items Management"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      scrollOffset={scrollOffset}
      height={8}
    >
      {dynamicItems.map((item) => (
        <Text key={item.id} color={item.color}>
          {item.text}
        </Text>
      ))}
    </SplitDemoLayout>
  );
};

/**
 * DynamicExpandDemo - Demonstrates expand/collapse with dynamic heights.
 *
 * This demo showcases how ScrollView handles items that change height:
 * 1. Scrolling to a specific item position
 * 2. Expanding items to show detailed content
 * 3. Collapsing all items back to their original height
 *
 * This demonstrates the remeasurement capability of ScrollView when
 * child heights change dynamically.
 */
const DynamicExpandDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: any;
  rightRef: any;
}) => {
  const [description, setDescription] = useState(
    "Initializing dynamic expand demo...",
  );
  const [expandableItems, setExpandableItems] = useState<any[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // Initialize expandable items with collapsed state
    setExpandableItems(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        expanded: false,
        content: `This is the detailed content for item ${i + 1}. It contains multiple lines of text that will be displayed when the item is expanded, demonstrating how ScrollView handles dynamic height changes.`,
      })),
    );

    // === Demo Sequence ===

    // Step 1: Scroll to Item 2 to set up the viewport
    timeouts.push(
      setTimeout(() => setDescription("Scrolling to Item 2..."), 1000),
    );
    timeouts.push(
      setTimeout(() => {
        const itemPosition = leftRef.current?.getItemPosition(1);
        if (itemPosition) {
          leftRef.current?.scrollTo(itemPosition.top);
          rightRef.current?.scrollTo(itemPosition.top);
        }
      }, 1500),
    );

    // Step 2: Expand Item 3 (below viewport initially)
    timeouts.push(
      setTimeout(() => setDescription("Expanding Item 3..."), 3000),
    );
    timeouts.push(
      setTimeout(() => {
        setExpandableItems((prev) =>
          prev.map((item) =>
            item.id === 2 ? { ...item, expanded: true } : item,
          ),
        );
      }, 3500),
    );

    // Step 3: Expand Item 1 (above viewport - tests scroll stability)
    timeouts.push(
      setTimeout(() => setDescription("Expanding Item 1..."), 5000),
    );
    timeouts.push(
      setTimeout(() => {
        setExpandableItems((prev) =>
          prev.map((item) =>
            item.id === 0 ? { ...item, expanded: true } : item,
          ),
        );
      }, 5500),
    );

    // Step 4: Expand Item 2 (currently visible)
    timeouts.push(
      setTimeout(() => setDescription("Expanding Item 2..."), 7000),
    );
    timeouts.push(
      setTimeout(() => {
        setExpandableItems((prev) =>
          prev.map((item) =>
            item.id === 1 ? { ...item, expanded: true } : item,
          ),
        );
      }, 7500),
    );

    // Step 5: Collapse all items
    timeouts.push(setTimeout(() => setDescription("Collapsing all..."), 9000));
    timeouts.push(
      setTimeout(() => {
        setExpandableItems((prev) =>
          prev.map((item) => ({ ...item, expanded: false })),
        );
      }, 9500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), 10500));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <SplitDemoLayout
      title="📏 Dynamic Height Children"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      scrollOffset={scrollOffset}
      height={8}
    >
      {expandableItems.map((item) => (
        <Box key={item.id} flexDirection="column" marginBottom={1}>
          {/* Item header with expand/collapse indicator */}
          <Box
            borderStyle="single"
            borderColor={item.expanded ? "green" : "gray"}
          >
            <Text color={item.expanded ? "green" : undefined}>
              {item.expanded ? "▼" : "▶"} {item.title}
            </Text>
          </Box>
          {/* Expandable content (only shown when expanded) */}
          {item.expanded && (
            <Box marginLeft={2}>
              <Text wrap="wrap" color="gray">
                {item.content}
              </Text>
            </Box>
          )}
        </Box>
      ))}
    </SplitDemoLayout>
  );
};

/**
 * ScrollViewResizeDemo - Demonstrates ScrollView height changes.
 *
 * This demo showcases how ScrollView handles viewport size changes:
 * 1. Scrolling to a middle position
 * 2. Reducing the ScrollView height
 * 3. Further reducing the height
 * 4. Expanding the height back
 *
 * After each resize, `remeasure()` must be called to update the viewport.
 */
const ScrollViewResizeDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: any;
  rightRef: any;
}) => {
  const [description, setDescription] = useState("Initializing resize demo...");
  const [scrollViewHeight, setScrollViewHeight] = useState(8);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // === Demo Sequence ===

    // Step 1: Scroll to middle position
    timeouts.push(
      setTimeout(() => setDescription("Scrolling to middle..."), 1000),
    );
    timeouts.push(
      setTimeout(() => {
        leftRef.current?.scrollTo(5);
        rightRef.current?.scrollTo(5);
      }, 1500),
    );

    // Step 2: Reduce height to 4
    timeouts.push(
      setTimeout(() => setDescription("Reducing height to 4..."), 3000),
    );
    timeouts.push(
      setTimeout(() => {
        setScrollViewHeight(4);
        // Must call remeasure after height change for ScrollView to recalculate
        setTimeout(() => {
          leftRef.current?.remeasure();
          rightRef.current?.remeasure();
        }, 100);
      }, 3500),
    );

    // Step 3: Further reduce to 3
    timeouts.push(setTimeout(() => setDescription("Further to 3..."), 5000));
    timeouts.push(
      setTimeout(() => {
        setScrollViewHeight(3);
        setTimeout(() => {
          leftRef.current?.remeasure();
          rightRef.current?.remeasure();
        }, 100);
      }, 5500),
    );

    // Step 4: Expand back to 10
    timeouts.push(setTimeout(() => setDescription("Expanding to 10..."), 7000));
    timeouts.push(
      setTimeout(() => {
        setScrollViewHeight(10);
        setTimeout(() => {
          leftRef.current?.remeasure();
          rightRef.current?.remeasure();
        }, 100);
      }, 7500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), 8500));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <SplitDemoLayout
      title="📐 ScrollView Height Changes"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      scrollOffset={scrollOffset}
      height={scrollViewHeight}
      leftScrollViewProps={{ height: scrollViewHeight }}
      rightScrollViewProps={{ height: scrollViewHeight }}
    >
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i}>{i + 1}. Content</Text>
      ))}
    </SplitDemoLayout>
  );
};

/**
 * DynamicWidthDemo - Demonstrates dynamic width changes and text wrapping.
 *
 * This demo showcases how ScrollView handles width changes:
 * 1. Starting with a specific width
 * 2. Reducing the width (causing text to wrap more)
 * 3. Further reducing width
 * 4. Expanding width back
 *
 * When width changes, text wraps differently, changing item heights.
 * `remeasure()` must be called after width changes.
 */
const DynamicWidthDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: any;
  rightRef: any;
}) => {
  const [description, setDescription] = useState("Initializing width demo...");
  const [scrollViewWidth, setScrollViewWidth] = useState<string | number>(30);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // === Demo Sequence ===

    // Step 1: Start with width 30 and scroll to item 2
    timeouts.push(
      setTimeout(
        () => setDescription("Starting width 30, scrolling to item 2..."),
        1000,
      ),
    );
    timeouts.push(
      setTimeout(() => {
        // Get position of second item and scroll to it
        const itemPosition = leftRef.current?.getItemPosition(1);
        if (itemPosition) {
          leftRef.current?.scrollTo(itemPosition.top);
          rightRef.current?.scrollTo(itemPosition.top);
        }
      }, 1500),
    );

    // Step 2: Reduce width to 20
    timeouts.push(setTimeout(() => setDescription("Reducing to 20..."), 3000));
    timeouts.push(
      setTimeout(() => {
        setScrollViewWidth(20);
        // Must remeasure after width change as text wrapping affects item heights
        setTimeout(() => {
          leftRef.current?.remeasure();
          rightRef.current?.remeasure();
        }, 100);
      }, 3500),
    );

    // Step 3: Further reduce to 15
    timeouts.push(setTimeout(() => setDescription("Further to 15..."), 5000));
    timeouts.push(
      setTimeout(() => {
        setScrollViewWidth(15);
        setTimeout(() => {
          leftRef.current?.remeasure();
          rightRef.current?.remeasure();
        }, 100);
      }, 5500),
    );

    // Step 4: Expand back to 25
    timeouts.push(setTimeout(() => setDescription("Expanding to 25..."), 7000));
    timeouts.push(
      setTimeout(() => {
        setScrollViewWidth(25);
        setTimeout(() => {
          leftRef.current?.remeasure();
          rightRef.current?.remeasure();
        }, 100);
      }, 7500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), 8500));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, []);

  // Create items with wrappable text to demonstrate width effects
  const longTextItems = Array.from({ length: 6 }, (_, i) => (
    <Box key={i} flexDirection="column" marginBottom={1}>
      <Text color="blue">{i + 1}:</Text>
      <Text wrap="wrap">This text wraps when width changes.</Text>
    </Box>
  ));

  return (
    <SplitDemoLayout
      title="↔️ Dynamic Width with Text Wrapping"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      scrollOffset={scrollOffset}
      height={8}
      leftScrollViewProps={{ width: scrollViewWidth }}
      rightScrollViewProps={{ width: scrollViewWidth }}
    >
      {longTextItems}
    </SplitDemoLayout>
  );
};

// =============================================================================
// Main Demo Component
// =============================================================================

/**
 * Demo - Main component that renders the selected demo category.
 *
 * This component:
 * 1. Creates refs for both ScrollViews (left and right)
 * 2. Maps the category name to the corresponding demo component
 * 3. Renders the selected demo within a fixed-size container
 */
const Demo = () => {
  const leftRef = useRef<ScrollViewRef>(null);
  const rightRef = useRef<ScrollViewRef>(null);

  // Map category names to their corresponding demo components
  const categoryMap: Record<
    string,
    React.ComponentType<{ leftRef: any; rightRef: any }>
  > = {
    scrolling: ScrollingDemo,
    items: DynamicItemsDemo,
    expand: DynamicExpandDemo,
    resize: ScrollViewResizeDemo,
    width: DynamicWidthDemo,
  };

  const DemoComponent = categoryMap[DEMO_CATEGORY];

  if (!DemoComponent) {
    return <Text color="red">Category not found: {DEMO_CATEGORY}</Text>;
  }

  return (
    <Box flexDirection="column" width={70} height={20}>
      <DemoComponent leftRef={leftRef} rightRef={rightRef} />
    </Box>
  );
};

// =============================================================================
// Entry Point
// =============================================================================

// Clear the terminal before starting the demo
console.clear();

// Render the demo with incremental rendering for smoother updates
render(<Demo />, {
  incrementalRendering: true,
  exitOnCtrlC: true,
});
