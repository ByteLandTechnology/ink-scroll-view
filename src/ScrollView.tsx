import React, {
  useState,
  useRef,
  useEffect,
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
   *
   * @remarks
   * Use this to sync external state or UI (e.g., scrollbars) with the current scroll position.
   */
  onScroll?: (scrollOffset: number) => void;

  /**
   * Callback fired when the ScrollView viewport (visible area) dimensions change.
   *
   * @param layout - The new dimensions of the viewport (width, height).
   *
   * @remarks
   * Fired whenever the outer container size changes (e.g., terminal resize or layout update).
   */
  onViewportSizeChange?: (layout: { width: number; height: number }) => void;

  /**
   * Callback fired when the total height of the content changes.
   *
   * @param height - The new total content height.
   *
   * @remarks
   * Useful for debug logging or adjusting external layouts based on content size.
   */
  onContentHeightChange?: (height: number) => void;

  /**
   * Callback fired when an individual child item's height changes.
   *
   * @param index - The index of the item.
   * @param height - The new height of the item.
   *
   * @remarks
   * This is triggered whenever an item is re-measured and its height differs from the previous value.
   */
  onItemHeightChange?: (index: number, height: number) => void;

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
   * @param offset - The target Y offset (distance from top).
   *
   * @example
   * ```tsx
   * // Scroll to the very top
   * ref.current?.scrollTo(0);
   * ```
   */
  scrollTo: (offset: number) => void;

  /**
   * Scrolls by a relative amount.
   *
   * @param delta - Positive for down, negative for up.
   *
   * @example
   * ```tsx
   * useInput((input, key) => {
   *   if (key.downArrow) ref.current?.scrollBy(1);
   *   if (key.upArrow) ref.current?.scrollBy(-1);
   * });
   * ```
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
   * @returns The viewport height in terminal rows.
   */
  getViewportHeight: () => number;

  /**
   * Gets the height of a specific item by its key.
   *
   * @param key - The unique key of the item.
   * @returns The height of the item in terminal rows, or 0 if not found.
   */
  getItemHeight: (key: string) => number | null;

  /**
   * Re-measures the ScrollView viewport dimensions.
   *
   * @remarks
   * Checks the current dimensions of the viewport and updates state if they have changed.
   * This does not necessarily force a re-layout of children unless the viewport size changes.
   * Use this manually if you suspect the terminal size or container size has changed.
   *
   * @example
   * ```tsx
   * // Handle terminal resize manually if needed
   * useEffect(() => {
   *   const onResize = () => ref.current?.remeasure();
   *   process.stdout.on('resize', onResize);
   *   return () => process.stdout.off('resize', onResize);
   * }, []);
   * ```
   */
  remeasure: () => void;

  /**
   * Triggers re-measurement of a specific child item.
   *
   * @param index - The index of the child to re-measure.
   *
   * @remarks
   * Use this if a child's internal content changes size in a way that doesn't trigger a standard React render cycle update.
   */
  remeasureItem: (index: number) => void;
}

/**
 * Internal helper component to measure the height of each child item.
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
  measureKey?: number;
}) => {
  const ref = useRef<DOMElement>(null);

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
 * It manages a virtual viewport and renders all children, but strictly controls
 * their visibility using `overflow="hidden"` and `marginTop` offsets.
 *
 * **Features:**
 * - ↕️ Vertical scrolling
 * - 📏 Auto-measurement of child heights
 * - 🎯 Imperative scrolling methods via ref
 * - 🔁 Dynamic content support (adding/removing children)
 * - 🖥️ Viewport resize handling (via manual `remeasure`)
 *
 * **Important Notes:**
 * - This component does NOT typically handle keyboard input directly. Use a hook like `useInput` in a parent component and call `scrollBy` or `scrollTo`.
 * - Children MUST generally have specific keys if you plan to dynamically update them, to ensure correct height tracking.
 *
 * @example
 * ```tsx
 * import React, { useRef } from 'react';
 * import { Box, Text, useInput } from 'ink';
 * import { ScrollView, ScrollViewRef } from 'ink-scroll-view';
 *
 * const Demo = () => {
 *   const scrollRef = useRef<ScrollViewRef>(null);
 *
 *   useInput((input, key) => {
 *     if (key.downArrow) {
 *       scrollRef.current?.scrollBy(1);
 *     }
 *     if (key.upArrow) {
 *       scrollRef.current?.scrollBy(-1);
 *     }
 *   });
 *
 *   return (
 *     <Box height={10} borderStyle="single">
 *       <ScrollView ref={scrollRef}>
 *         {items.map(item => (
 *           <Text key={item.id}>{item.label}</Text>
 *         ))}
 *       </ScrollView>
 *     </Box>
 *   );
 * };
 * ```
 */
export const ScrollView = forwardRef<ScrollViewRef, ScrollViewProps>(
  (
    {
      onScroll,
      onViewportSizeChange,
      onContentHeightChange,
      onItemHeightChange,
      children,
      ...boxProps
    },
    ref,
  ) => {
    // Current scroll position (offset from top).
    // Represents how many lines the content is shifted up.
    const [scrollOffset, setScrollOffset] = useState(0);

    const viewportRef = useRef<DOMElement>(null);
    const contentRef = useRef<DOMElement>(null);

    /**
     * Map of item keys/indices to their measured heights.
     * We use a Ref instead of State to allow "optimistic" updates inside
     * layout callbacks without triggering cascading re-renders.
     */
    const itemHeightsRef = useRef<Record<string | number, number>>({});

    /**
     * Map of child index to their unique key.
     * Used to look up the correct height in `itemHeightsRef` given an index.
     */
    const itemKeysRef = useRef<(string | number)[]>([]);

    // Viewport dimensions (visible area)
    const [viewportSize, setViewportSize] = useState({
      height: 0,
      width: 0,
    });

    // Total height of the scrollable content
    const [contentHeight, setContentHeight] = useState(0);

    // Maximum allowable scroll offset
    // The content cannot be scrolled past this point (where the bottom of content meets bottom of viewport).
    const [maxScrollOffset, setMaxScrollOffset] = useState(0);

    // Per-item measure keys to force re-measurement of specific items
    const [itemMeasureKeys, setItemMeasureKeys] = useState<
      Record<number, number>
    >({});

    /**
     * Handler called by MeasurableItem when its size changes.
     * Implements an "optimistic update" pattern:
     * 1. Check if height truly changed.
     * 2. Immediately update state (contentHeight).
     * 3. Sync the ref (itemHeightsRef) for future lookups.
     */
    const onItemMeasure = useCallback(
      (index: number, height: number) => {
        const key = itemKeysRef.current[index];
        // Only trigger update if height has effectively changed
        if (key && itemHeightsRef.current[key] !== height) {
          const oldHeight = itemHeightsRef.current[key] || 0;
          const delta = height - oldHeight;

          // Update total content height state
          setContentHeight((prev) => prev + delta);

          // Update item height in ref
          itemHeightsRef.current = {
            ...itemHeightsRef.current,
            [key]: height,
          };

          // Notify parent of height change
          onItemHeightChange?.(index, height);
        }
      },
      [onItemHeightChange],
    );

    // Effect: Measure viewport dimensions on mount and updates
    useEffect(() => {
      if (!viewportRef.current) {
        return;
      }
      const { height, width } = measureElement(viewportRef.current);
      // Only update state if dimensions actually changed to avoid unnecessary renders
      if (height === viewportSize.height && width === viewportSize.width) {
        return;
      }
      setViewportSize({ height, width });
    }, [viewportSize]);

    useEffect(() => {
      onContentHeightChange?.(contentHeight);
    }, [contentHeight, onContentHeightChange]);

    useEffect(() => {
      onViewportSizeChange?.({
        width: viewportSize.width,
        height: viewportSize.height,
      });
    }, [viewportSize, onViewportSizeChange]);

    // Effect: Recalculate max scroll offset when content or viewport changes.
    // This defines the boundaries of the scrollable area.
    useEffect(() => {
      const newMaxOffset = Math.max(0, contentHeight - viewportSize.height);
      if (newMaxOffset !== maxScrollOffset) {
        setMaxScrollOffset(newMaxOffset);
      }
    }, [contentHeight, viewportSize.height, maxScrollOffset]);

    // Effect: Handle changes to the `children` prop.
    // This rebuilds the item registry to ensure we don't hold onto stale items
    // (e.g., if a child is removed, its height must be subtracted from contentHeight).
    useEffect(() => {
      let newItemKeys: (string | number)[] = [];
      let newItemHeights: Record<string | number, number> = {};
      let newContentHeight = 0;

      // Itereate over new children to preserve existing heights where possible
      React.Children.forEach(children, (child, index) => {
        if (child.key && newItemHeights[child.key] === undefined) {
          // If child has a key, try to preserve its known height
          const itemHeight = itemHeightsRef.current[child.key] || 0;
          newItemKeys.push(child.key);
          newItemHeights[child.key] = itemHeight;
          newContentHeight += itemHeight;
        } else {
          // If no key (or fallback), use index-based tracking (reset height to 0 to be safe until measured)
          newItemKeys.push(index);
          newItemHeights[index] = 0;
          newContentHeight += 0;
        }
      });

      // Update refs and state with the new list of items
      itemHeightsRef.current = newItemHeights;
      itemKeysRef.current = newItemKeys;
      setContentHeight(newContentHeight);
    }, [children]);

    // Effect: Clamp scroll position if it exceeds the new max scroll.
    // Example: Content shrinks significantly, and we were scrolled to the bottom.
    // We must "snap back" to the new bottom.
    useEffect(() => {
      if (scrollOffset > maxScrollOffset) {
        setScrollOffset(maxScrollOffset);
        onScroll?.(maxScrollOffset);
      }
    }, [maxScrollOffset, scrollOffset, onScroll]);

    // Expose control methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        scrollTo: (offset: number) => {
          const newScrollTop = Math.max(0, Math.min(offset, maxScrollOffset));
          if (newScrollTop !== scrollOffset) {
            setScrollOffset(newScrollTop);
            onScroll?.(newScrollTop);
          }
        },
        scrollBy: (delta: number) => {
          const newScrollTop = Math.max(
            0,
            Math.min(scrollOffset + delta, maxScrollOffset),
          );
          if (newScrollTop !== scrollOffset) {
            setScrollOffset(newScrollTop);
            onScroll?.(newScrollTop);
          }
        },
        scrollToTop: () => {
          if (scrollOffset !== 0) {
            setScrollOffset(0);
            onScroll?.(0);
          }
        },
        scrollToBottom: () => {
          if (scrollOffset !== maxScrollOffset) {
            setScrollOffset(maxScrollOffset);
            onScroll?.(maxScrollOffset);
          }
        },
        getScrollOffset: () => scrollOffset,
        getMaxScrollOffset: () => maxScrollOffset,
        getViewportHeight: () => viewportSize.height,
        getItemHeight: (key: string) => itemHeightsRef.current[key] || 0,
        remeasure: () => {
          // Force re-measurement of the viewport
          if (viewportRef.current) {
            const { width, height } = measureElement(viewportRef.current);
            if (
              width !== viewportSize.width ||
              height !== viewportSize.height
            ) {
              setViewportSize({ width, height });
            }
          }
        },
        remeasureItem: (index: number) =>
          // Trigger re-measurement of child at specific index
          setItemMeasureKeys((prev) => ({
            ...prev,
            [index]: (prev[index] || 0) + 1,
          })),
      }),
      [scrollOffset, maxScrollOffset, viewportSize, onScroll],
    );

    return (
      <Box ref={viewportRef} {...boxProps}>
        <Box overflow="hidden">
          <Box
            ref={contentRef}
            flexDirection="column"
            marginTop={-scrollOffset}
          >
            {React.Children.map(children, (child, index) => (
              <MeasurableItem
                key={child.key}
                index={index}
                width={viewportSize.width}
                onMeasure={onItemMeasure}
                measureKey={itemMeasureKeys[index]}
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
