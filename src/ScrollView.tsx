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
   * @param size - The new dimensions of the viewport (width, height).
   * @param previousSize - The previous dimensions of the viewport (width, height).
   *
   * @remarks
   * Fired whenever the outer container size changes (e.g., terminal resize or layout update).
   */
  onViewportSizeChange?: (
    size: { width: number; height: number },
    previousSize: { width: number; height: number },
  ) => void;

  /**
   * Callback fired when the total height of the content changes.
   *
   * @param height - The new total content height.
   * @param previousHeight - The previous total content height.
   *
   * @remarks
   * Useful for debug logging or adjusting external layouts based on content size.
   */
  onContentHeightChange?: (height: number, previousHeight: number) => void;

  /**
   * Callback fired when an individual child item's height changes.
   *
   * @param index - The index of the item.
   * @param height - The new height of the item.
   * @param previousHeight - The previous height of the item.
   *
   * @remarks
   * This is triggered whenever an item is re-measured and its height differs from the previous value.
   */
  onItemHeightChange?: (
    index: number,
    height: number,
    previousHeight: number,
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
   * Scrolls to the very bottom.
   *
   * @remarks
   * This calculates the target offset as `contentHeight - viewportHeight`.
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
   * @returns The current scroll offset in terminal rows.
   */
  getScrollOffset: () => number;

  /**
   * Gets the total height of the content.
   *
   * @remarks
   * This is the sum of the heights of all child items.
   *
   * @returns The total content height in terminal rows.
   */
  getContentHeight: () => number;

  /**
   * Gets the current height of the visible viewport.
   *
   * @returns The viewport height in terminal rows.
   */
  getViewportHeight: () => number;

  /**
   * Gets the height of a specific item by its index.
   *
   * @param index - The index of the item.
   * @returns The height of the item in terminal rows, or 0 if not found.
   */
  getItemHeight: (index: number) => number;

  /**
   * Gets the position of a specific item.
   *
   * @param index - The index of the item.
   * @returns The position (top offset) and height of the item, or null if not found.
   */
  getItemPosition: (index: number) => { top: number; height: number } | null;

  /**
   * Re-measures the ScrollView viewport dimensions.
   *
   * @remarks
   * Checks the current dimensions of the viewport and updates state if they have changed.
   * This is crucial for handling terminal resizes, as Ink does not automatically propagate resize events to components.
   *
   * @example
   * ```tsx
   * // Handle terminal resize manually
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
   * Use this if a child's internal content changes size in a way that doesn't trigger a standard React render cycle update
   * (e.g., internal state change within the child that affects its height).
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
 * Hook to manage state with immediate ref synchronization.
 * Useful for values that need to be read synchronously in imperative methods
 * but also trigger re-renders when changed.
 */
function useStateRef<T>(initialValue: T) {
  const [state, setStateInternal] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  const setState = useCallback((update: React.SetStateAction<T>) => {
    const nextValue =
      typeof update === "function"
        ? (update as (prev: T) => T)(ref.current)
        : update;
    ref.current = nextValue;
    setStateInternal(nextValue);
  }, []);

  const getState = useCallback(() => ref.current, []);

  return [state, setState, getState] as const;
}

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
    const [scrollOffset, setScrollOffset, getScrollOffset] = useStateRef(0);

    // Viewport dimensions (visible area)
    const [viewportSize, setViewportSize, getViewportSize] = useStateRef({
      height: 0,
      width: 0,
    });

    // Total height of the scrollable content
    const [contentHeight, setContentHeight, getContentHeight] = useStateRef(0);

    // Per-item measure keys to force re-measurement of specific items
    const [itemMeasureKeys, setItemMeasureKeys] = useState<
      Record<number, number>
    >({});

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

    /**
     * Cache of item offset positions (distance from top).
     * Lazily updated in getItemPosition.
     */
    const itemOffsetsRef = useRef<number[]>([]);

    /**
     * The index of the first invalid item offset position.
     * 0 means no positions are valid.
     * If firstInvalidOffsetIndexRef.current is i, then itemOffsetsRef.current[0...i-1] are valid.
     */
    const firstInvalidOffsetIndexRef = useRef<number>(0);

    /**
     * Handler called by MeasurableItem when its size changes.
     * Implements an "optimistic update" pattern:
     * 1. Check if height truly changed.
     * 2. Immediately update state (contentHeight).
     * 3. Sync the ref (itemHeightsRef) for future lookups.
     */
    const handleItemMeasure = useCallback(
      (index: number, height: number) => {
        const key = itemKeysRef.current[index] || index;
        // Only trigger update if height has effectively changed
        if (itemHeightsRef.current[key] !== height) {
          const previousHeight = itemHeightsRef.current[key] || 0;
          const delta = height - previousHeight;

          // Update total content height state
          setContentHeight((prev) => prev + delta);

          // Update item height in ref
          itemHeightsRef.current = {
            ...itemHeightsRef.current,
            [key]: height,
          };

          // Notify parent of height change
          onItemHeightChange?.(index, height, previousHeight);

          // Invalidate cache from this index onwards
          // If item at index changes height, its offset is same, but subsequent items shift.
          // So valid range is up to index (inclusive), so first invalid is index + 1.
          firstInvalidOffsetIndexRef.current = Math.min(
            firstInvalidOffsetIndexRef.current,
            index + 1,
          );
        }
      },
      [onItemHeightChange],
    );

    const measureViewport = useCallback(() => {
      if (viewportRef.current) {
        const { width, height } = measureElement(viewportRef.current);
        const currentSize = getViewportSize();
        if (width !== currentSize.width || height !== currentSize.height) {
          setViewportSize({ width, height });
        }
      }
    }, [viewportRef]);

    useLayoutEffect(() => {
      measureViewport();
    });

    // Effect: Handle changes to the `children` prop.
    // This rebuilds the item registry and maintains scroll position.
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

      // Reset cache to match new children
      itemOffsetsRef.current = new Array(newItemKeys.length).fill(0);
      firstInvalidOffsetIndexRef.current = 0;
    }, [children]);

    // Effect: Clamp scroll position if it exceeds the new max scroll.
    // Example: Content shrinks significantly, and we were scrolled to the bottom.
    // We must "snap back" to the new bottom.
    useEffect(() => {
      if (scrollOffset > contentHeight) {
        setScrollOffset(contentHeight);
        onScroll?.(contentHeight);
      }
    }, [contentHeight, scrollOffset, onScroll, setScrollOffset]);

    // Expose control methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        scrollTo: (offset: number) => {
          const currentContentHeight = getContentHeight();
          const newScrollTop = Math.max(
            0,
            Math.min(offset, currentContentHeight),
          );
          if (newScrollTop !== getScrollOffset()) {
            setScrollOffset(newScrollTop);
            onScroll?.(newScrollTop);
          }
        },
        scrollBy: (delta: number) => {
          const currentContentHeight = getContentHeight();
          const newScrollTop = Math.max(
            0,
            Math.min(getScrollOffset() + delta, currentContentHeight),
          );
          if (newScrollTop !== getScrollOffset()) {
            setScrollOffset(newScrollTop);
            onScroll?.(newScrollTop);
          }
        },
        scrollToTop: () => {
          if (getScrollOffset() !== 0) {
            setScrollOffset(0);
            onScroll?.(0);
          }
        },
        scrollToBottom: () => {
          const bottomOffset = Math.max(
            0,
            getContentHeight() - getViewportSize().height,
          );
          if (getScrollOffset() !== bottomOffset) {
            setScrollOffset(bottomOffset);
            onScroll?.(bottomOffset);
          }
        },
        getScrollOffset,
        getContentHeight,
        getViewportHeight: () => getViewportSize().height,
        getItemHeight: (index: number) => {
          const key = itemKeysRef.current[index] || index;
          return itemHeightsRef.current[key] || 0;
        },
        remeasure: measureViewport,
        remeasureItem: (index: number) =>
          // Trigger re-measurement of child at specific index
          setItemMeasureKeys((prev) => ({
            ...prev,
            [index]: (prev[index] || 0) + 1,
          })),
        getItemPosition: (index: number) => {
          if (index < 0 || index >= itemKeysRef.current.length) {
            return null;
          }

          // Lazy update of item offsets
          if (index >= firstInvalidOffsetIndexRef.current) {
            let currentOffset = 0;
            let startIndex = 0;

            // Optimization: continue from last valid position if possible
            if (firstInvalidOffsetIndexRef.current > 0) {
              startIndex = firstInvalidOffsetIndexRef.current;
              const prevIndex = startIndex - 1;
              const prevKey = itemKeysRef.current[prevIndex] || prevIndex;
              const prevHeight = itemHeightsRef.current[prevKey] || 0;
              currentOffset =
                (itemOffsetsRef.current[prevIndex] ?? 0) + prevHeight;
            }

            for (let i = startIndex; i <= index; i++) {
              itemOffsetsRef.current[i] = currentOffset;
              const key = itemKeysRef.current[i] || i;
              const height = itemHeightsRef.current[key] || 0;
              currentOffset += height;
            }
            firstInvalidOffsetIndexRef.current = index + 1;
          }

          const top = itemOffsetsRef.current[index] ?? 0;
          const key = itemKeysRef.current[index] || index;
          const height = itemHeightsRef.current[key] || 0;
          return { top, height };
        },
      }),
      [onScroll],
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
                onMeasure={handleItemMeasure}
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
