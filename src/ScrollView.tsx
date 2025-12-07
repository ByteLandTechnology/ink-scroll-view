import React, {
  useState,
  useRef,
  useEffect,
  useReducer,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useCallback,
} from "react";
import { Box, BoxProps, measureElement, DOMElement } from "ink";

/**
 * Props for the ScrollView component.
 *
 * @remarks
 * Extends standard BoxProps from Ink.
 */
export interface ScrollViewProps extends BoxProps {
  /**
   * Callback fired when the scroll position changes.
   *
   * @param scrollOffset - The new scroll offset (distance from top).
   */
  onScroll?: (scrollOffset: number) => void;

  /**
   * Callback fired when the ScrollView layout (viewport) changes.
   *
   * @param layout - The new dimensions of the viewport.
   */
  onLayout?: (layout: { width: number; height: number }) => void;

  /**
   * Callback fired when a child's layout (top, height, bottom) changes.
   *
   * @remarks
   * This is triggered when an item's height changes. The provided layout
   * includes the calculated top position based on preceding items.
   *
   * @param index - The index of the item.
   * @param layout - The new layout of the item.
   */
  onItemLayoutChange?: (
    index: number,
    layout: { top: number; height: number; bottom: number },
  ) => void;

  /**
   * The content to be scrolled.
   *
   * @remarks
   * Accepts an array of React elements. Each element should have a unique `key`
   * prop, which will be preserved during rendering for proper reconciliation.
   */
  children: React.ReactElement[];
}

/**
 * Ref interface for controlling the ScrollView programmatically.
 */
export interface ScrollViewRef {
  /**
   * Scrolls to a specific vertical position.
   *
   * @param y - The target Y coordinate.
   */
  scrollTo: (y: number) => void;

  /**
   * Scrolls by a relative amount.
   *
   * @param delta - Positive for down, negative for up.
   */
  scrollBy: (delta: number) => void;

  /**
   * Scrolls to the very top (position 0).
   */
  scrollToTop: () => void;

  /**
   * Scrolls to the very bottom (maxScroll).
   */
  scrollToBottom: () => void;

  /**
   * Gets the current scroll offset (distance scrolled from the top).
   *
   * @remarks
   * The scroll offset represents how many terminal rows the content has been
   * scrolled up from its initial position. A value of 0 means the content is
   * at the very top (no scrolling has occurred).
   *
   * ```
   * ┌─────────────────────────┐
   * │  (hidden content)       │ ← Content above viewport
   * │  ...                    │
   * ├─────────────────────────┤ ← scrollOffset (distance from top)
   * │  ┌───────────────────┐  │
   * │  │ Visible Viewport  │  │ ← What user sees
   * │  │                   │  │
   * │  └───────────────────┘  │
   * ├─────────────────────────┤
   * │  (hidden content)       │ ← Content below viewport
   * │  ...                    │
   * └─────────────────────────┘
   * ```
   *
   * @returns The current scroll offset in terminal rows.
   */
  getScrollOffset: () => number;

  /**
   * Gets the maximum possible scroll offset.
   *
   * @remarks
   * This is calculated as `contentHeight - viewportHeight`. When the scroll
   * offset equals this value, the content is scrolled to the very bottom.
   * Returns 0 if the content fits within the viewport.
   *
   * @returns The maximum scroll offset in terminal rows.
   */
  getMaxScrollOffset: () => number;

  /**
   * Gets the current height of the visible viewport.
   *
   * @remarks
   * The viewport is the visible area where content is displayed.
   * This value depends on the container's height and terminal size.
   *
   * @returns The viewport height in terminal rows.
   */
  getViewportHeight: () => number;

  /**
   * Gets the layout information (position and size) of a specific item.
   *
   * @param index - The index of the child item (0-based).
   *
   * @returns An object containing the item's layout metrics, or `null` if
   * the index is out of bounds or the item hasn't been measured yet.
   *
   * @remarks
   * **Layout Coordinate System**:
   * ```
   *                  Content Area
   * ┌─────────────────────────────────┐  ← top = 0
   * │  Item 0                         │
   * │  (height: 3)                    │
   * ├─────────────────────────────────┤  ← top = 3
   * │  Item 1                         │
   * │  (height: 2)                    │
   * ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  ← scrollOffset (viewport start)
   * │ ┌─────────────────────────────┐ │
   * │ │ Item 2 (partially visible)  │ │  ← visibleTop = 0 (relative to viewport)
   * ├─┼─────────────────────────────┼─┤  ← top = 5
   * │ │ Item 3 (fully visible)      │ │
   * │ │ (height: 4)                 │ │
   * │ └─────────────────────────────┘ │  ← visibleHeight = 4 (fully visible)
   * ├─────────────────────────────────┤  ← viewport end
   * │  Item 4                         │
   * │  (partially visible)            │
   * └─────────────────────────────────┘  ← bottom of content
   * ```
   *
   * **Return Properties**:
   * - `top`: Absolute Y position of the item's top edge within the entire
   *   content area (not the viewport). This is the sum of all preceding
   *   items' heights.
   *
   * - `height`: The measured height of this item in terminal rows.
   *
   * - `bottom`: Absolute Y position of the item's bottom edge (`top + height`).
   *
   * - `isVisible`: `true` if any part of the item is currently within the
   *   visible viewport.
   *
   * - `visibleTop`: The Y position where the visible portion of this item
   *   starts, **relative to the viewport** (not the content). If the item
   *   is above the viewport, this would be 0 (clamped). If the item starts
   *   within the viewport, this is `top - scrollOffset`.
   *
   * - `visibleHeight`: How many rows of this item are actually visible.
   *   Equals `height` if fully visible, less if partially visible, 0 if
   *   not visible.
   *
   * @example
   * ```tsx
   * const layout = scrollViewRef.current?.getItemLayout(5);
   * if (layout) {
   *   console.log(`Item 5 position: top=${layout.top}, height=${layout.height}`);
   *   console.log(`Bottom edge at: ${layout.bottom}`);
   *   console.log(`Is visible: ${layout.isVisible}`);
   *   if (layout.isVisible) {
   *     console.log(`Visible at viewport row ${layout.visibleTop}`);
   *     console.log(`Visible height: ${layout.visibleHeight}/${layout.height}`);
   *   }
   * }
   * ```
   */
  getItemLayout: (index: number) => {
    top: number;
    height: number;
    bottom: number;
    isVisible: boolean;
    visibleTop: number;
    visibleHeight: number;
  } | null;

  /**
   * Forces a complete re-layout of the ScrollView.
   *
   * @remarks
   * Triggers re-measurement of all children and viewport dimensions.
   * Use this when the terminal is resized or when multiple items change.
   *
   * @example
   * ```tsx
   * // Handle terminal resize
   * useEffect(() => {
   *   const handleResize = () => scrollViewRef.current?.remeasure();
   *   stdout?.on('resize', handleResize);
   *   return () => { stdout?.off('resize', handleResize); };
   * }, [stdout]);
   * ```
   */
  remeasure: () => void;

  /**
   * Triggers re-measurement of a specific child item.
   *
   * @remarks
   * More efficient than `remeasure()` when only a single item's content
   * has changed (e.g., expanded/collapsed). The `itemOffsets` and
   * `contentHeight` will be automatically recalculated.
   *
   * @param index - The index of the child to re-measure.
   *
   * @example
   * ```tsx
   * const handleToggleExpand = (index: number) => {
   *   setExpandedItems(prev => {
   *     const next = new Set(prev);
   *     next.has(index) ? next.delete(index) : next.add(index);
   *     return next;
   *   });
   *   // Re-measure only the affected item
   *   setTimeout(() => scrollViewRef.current?.remeasureItem(index), 0);
   * };
   * ```
   */
  remeasureItem: (index: number) => void;
}

/**
 * Internal helper component to measure the height of each child item.
 *
 * @remarks
 * Wraps each child element and reports the measured height back to the parent
 * ScrollView via the `onMeasure` callback. Preserves the child's original key
 * for proper React reconciliation.
 *
 * @internal
 */
const MeasurableItem = ({
  children,
  onMeasure,
  index,
  width,
  measureKey,
}: {
  children: React.ReactElement;
  onMeasure: (index: number, height: number) => void;
  index: number;
  width: number;
  measureKey: number;
}) => {
  const ref = useRef<DOMElement>(null);

  // Measure on mount, when width changes, or when measureKey changes
  useLayoutEffect(() => {
    if (ref.current) {
      const { height } = measureElement(ref.current);
      onMeasure(index, height);
    }
  }, [index, onMeasure, width, measureKey]);

  return (
    <Box ref={ref} flexShrink={0} width="100%">
      {children}
    </Box>
  );
};

/**
 * A ScrollView component for Ink applications.
 *
 * @remarks
 * Allows scrolling through content that exceeds the visible area of the terminal.
 *
 * **IMPORTANT**:
 * - This component does NOT handle user input (keyboard/mouse).
 *   You must control scrolling via the exposed ref methods (e.g., using `useInput`).
 * - This component does NOT automatically respond to terminal resize events.
 *   The parent component must call {@link ScrollViewRef.remeasure | remeasure()}
 *   when the terminal resizes or when child content changes dynamically.
 *
 * @example
 * ```tsx
 * const scrollViewRef = useRef<ScrollViewRef>(null);
 * const { stdout } = useStdout();
 *
 * // Handle terminal resize
 * useEffect(() => {
 *   const handleResize = () => scrollViewRef.current?.remeasure();
 *   stdout?.on('resize', handleResize);
 *   return () => { stdout?.off('resize', handleResize); };
 * }, [stdout]);
 *
 * // Handle keyboard input
 * useInput((input, key) => {
 *   if (key.upArrow) scrollViewRef.current?.scrollBy(-1);
 *   if (key.downArrow) scrollViewRef.current?.scrollBy(1);
 * });
 *
 * return (
 *   <ScrollView ref={scrollViewRef} height={10}>
 *     {items.map((item, i) => <Text key={i}>{item}</Text>)}
 *   </ScrollView>
 * );
 * ```
 */
export const ScrollView = forwardRef<ScrollViewRef, ScrollViewProps>(
  ({ onScroll, onLayout, onItemLayoutChange, children, ...boxProps }, ref) => {
    const [scrollTop, setScrollTop] = useState(0);
    const outerRef = useRef<DOMElement>(null);
    const innerRef = useRef<DOMElement>(null);
    // Force a redraw when remeasure is called
    const [redrawIndex, redraw] = useReducer((x) => x + 1, 0);

    // Keep weak refs to props to avoid dependency cycles / re-renders
    const callbacksRef = useRef({
      onScroll,
      onLayout,
      onItemLayoutChange,
    });
    callbacksRef.current = {
      onScroll,
      onLayout,
      onItemLayoutChange,
    };

    // Store heights of all child items to calculate positions
    const [itemHeights, setItemHeights] = useState<Record<number, number>>({});
    // Ref to track item heights for change detection in event handlers
    const itemHeightsRef = useRef(itemHeights);
    itemHeightsRef.current = itemHeights;

    // Per-item measure keys for targeted re-measurement
    const [itemMeasureKeys, setItemMeasureKeys] = useState<
      Record<number, number>
    >({});

    // Store dimensions of the viewport
    const [viewDimensions, setViewDimensions] = useState({
      height: 0,
      width: 0,
    });

    // Callback to update item height registry
    const handleMeasure = useCallback(
      (index: number, height: number) => {
        // Only trigger update and notify if height has changed
        if (itemHeightsRef.current[index] !== height) {
          const oldHeight = itemHeightsRef.current[index] || 0;
          const delta = height - oldHeight;

          // Optimistic update of ref to prevent double firing in same cycle
          itemHeightsRef.current = {
            ...itemHeightsRef.current,
            [index]: height,
          };

          // Calculate top position based on current heights
          let top = 0;
          for (let i = 0; i < index; i++) {
            top += itemHeightsRef.current[i] || 0;
          }
          const bottom = top + height;
          const oldBottom = top + oldHeight;

          // Scroll Anchoring:
          // If the item that changed size is entirely above the current scroll position,
          // we need to adjust the scroll position by the delta to keep the visible content stable.
          // Note: We use the callback ref for scrollTop if available, but since scrollTop is state,
          // we might need to access the latest value. We can't access state in callback easily without ref.
          // Let's rely on setState functional update or a ref for scrollTop if needed.
          // But wait, we need to call `setScrollTop` here.

          // We don't have scrollTop ref. Let's rely on the fact that if we use setScrollTop(prev => ...),
          // we can access the latest value. However, we also need to trigger onScroll prop.
          // So we should probably use a ref for scrollTop or just use setScrollTop callback logic carefully.

          setItemHeights((prev) => {
            if (prev[index] === height) return prev;
            return { ...prev, [index]: height };
          });

          setScrollTop((prevScrollTop) => {
            // Check if item ended strictly above the viewport window START
            // We use <= because if it touches the top edge, changing height pushes content down.
            if (oldBottom <= prevScrollTop) {
              const newScrollTop = Math.max(0, prevScrollTop + delta);
              if (newScrollTop !== prevScrollTop) {
                // Defer notification to avoid side-effects during render/state update if possible,
                // but here we are in a callback.
                callbacksRef.current.onScroll?.(newScrollTop);
                return newScrollTop;
              }
            }
            return prevScrollTop;
          });

          callbacksRef.current.onItemLayoutChange?.(index, {
            top,
            height,
            bottom,
          });
        }
      },
      [callbacksRef],
    );

    // Trigger initial measurement on mount
    useEffect(() => {
      redraw();
    }, []);

    // Measure the outer viewport whenever we redraw (e.g. resize)
    useEffect(() => {
      if (!outerRef.current) return;
      const { height, width } = measureElement(outerRef.current);
      setViewDimensions({ height, width });
      callbacksRef.current.onLayout?.({ width, height });
    }, [redrawIndex]);

    // Helper to calculate content height on-the-fly
    const calculateContentHeight = useCallback(() => {
      let total = 0;
      const count = React.Children.count(children);
      for (let i = 0; i < count; i++) {
        total += itemHeights[i] || 0;
      }
      return total;
    }, [itemHeights, children]);

    // Helper to calculate layout metrics
    const calculateMetrics = useCallback(() => {
      if (!outerRef.current || !innerRef.current) {
        return { viewportHeight: 0, contentHeight: 0, maxScroll: 0 };
      }
      const viewportHeight = viewDimensions.height;
      const contentHeight = calculateContentHeight();
      const maxScroll = Math.max(0, contentHeight - viewportHeight);
      return { viewportHeight, contentHeight, maxScroll };
    }, [viewDimensions.height, calculateContentHeight]);

    // Ensure scroll position stays within bounds when content/layout changes
    useEffect(() => {
      const { maxScroll } = calculateMetrics();
      if (scrollTop > maxScroll) {
        setScrollTop(maxScroll);
        callbacksRef.current.onScroll?.(maxScroll);
      }
    }, [redrawIndex, calculateMetrics, scrollTop]); // Added scrollTop dependency to be safe, though mainly triggered by height changes

    // Expose API via ref
    useImperativeHandle(ref, () => ({
      scrollTo: (y: number) => {
        const { maxScroll } = calculateMetrics();
        const newScrollTop = Math.max(0, Math.min(y, maxScroll));
        if (newScrollTop !== scrollTop) {
          setScrollTop(newScrollTop);
          callbacksRef.current.onScroll?.(newScrollTop);
        }
      },
      scrollBy: (delta: number) => {
        const { maxScroll } = calculateMetrics();
        const newScrollTop = Math.max(
          0,
          Math.min(scrollTop + delta, maxScroll),
        );
        if (newScrollTop !== scrollTop) {
          setScrollTop(newScrollTop);
          callbacksRef.current.onScroll?.(newScrollTop);
        }
      },
      scrollToTop: () => {
        if (scrollTop !== 0) {
          setScrollTop(0);
          callbacksRef.current.onScroll?.(0);
        }
      },
      scrollToBottom: () => {
        const { maxScroll } = calculateMetrics();
        if (scrollTop !== maxScroll) {
          setScrollTop(maxScroll);
          callbacksRef.current.onScroll?.(maxScroll);
        }
      },
      getScrollOffset: () => scrollTop,
      getMaxScrollOffset: () => calculateMetrics().maxScroll,
      getViewportHeight: () => calculateMetrics().viewportHeight,
      getItemLayout: (index: number) => {
        // Check bounds
        if (index < 0 || index >= React.Children.count(children)) {
          return null;
        }
        // Check if item has been measured
        if (itemHeights[index] === undefined) {
          return null;
        }

        // Calculate top on-the-fly
        let top = 0;
        for (let i = 0; i < index; i++) {
          top += itemHeights[i] || 0;
        }

        const height = itemHeights[index] || 0;
        const bottom = top + height;
        const { viewportHeight } = calculateMetrics();

        // Calculate visibility
        const viewportTop = scrollTop;
        const viewportBottom = scrollTop + viewportHeight;

        const isVisible = bottom > viewportTop && top < viewportBottom;
        const visibleTop = Math.max(top, viewportTop);
        const visibleBottom = Math.min(bottom, viewportBottom);
        const visibleHeight = isVisible
          ? Math.max(0, visibleBottom - visibleTop)
          : 0;

        return {
          top,
          height,
          bottom,
          isVisible,
          visibleTop: visibleTop - scrollTop, // Relative to viewport
          visibleHeight,
        };
      },
      remeasure: () => {
        // Trigger a redraw to re-measure viewport and all items.
        redraw();
      },
      remeasureItem: (index: number) => {
        // Increment the measure key for a specific item to trigger re-measurement
        setItemMeasureKeys((prev) => ({
          ...prev,
          [index]: (prev[index] || 0) + 1,
        }));
      },
    }));

    return (
      <Box ref={outerRef} {...boxProps}>
        <Box
          flexShrink={0}
          flexGrow={1}
          overflowY="hidden"
          flexDirection="column"
        >
          <Box
            ref={innerRef}
            width="100%"
            marginTop={-scrollTop}
            flexDirection="column"
          >
            {React.Children.map(children, (child, index) => (
              <MeasurableItem
                key={child.key ?? index}
                width={viewDimensions.width}
                index={index}
                onMeasure={handleMeasure}
                measureKey={redrawIndex + (itemMeasureKeys[index] || 0)}
              >
                {child}
              </MeasurableItem>
            ))}
          </Box>
        </Box>
      </Box>
    );
  },
);
