import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  ReactNode,
} from "react";
import { BoxProps } from "ink";
import {
  ControlledScrollView,
  ControlledScrollViewRef,
} from "./ControlledScrollView";

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
   * Enable debug mode to visualize the ScrollView internals.
   *
   * @remarks
   * When enabled, the viewport overflow is not hidden, allowing the full content
   * to be visible. This is useful for inspecting the layout and verifying
   * that content is being rendered correctly off-screen.
   */
  debug?: boolean;

  /**
   * The content to be scrolled.
   *
   * @remarks
   * Accepts an array of React elements. Each element should have a unique `key`
   * prop, which will be preserved during rendering for proper reconciliation.
   */
  children?: ReactNode;
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
   * Gets the scroll offset when the content is scrolled to the very bottom.
   *
   * @remarks
   * This is calculated as `contentHeight - viewportHeight`. When the scroll
   * offset equals this value, the last item of the content is visible at the
   * bottom of the viewport.
   *
   * @returns The bottom scroll offset in terminal rows.
   */
  getBottomOffset: () => number;

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
 * - This component does NOT automatically capture keyboard input. You must use `useInput` in a parent component and control the scroll via the `onInput` hook or similar.
 * - Children MUST generally have specific keys if you plan to dynamically update them, to ensure correct height tracking across renders.
 *
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
      debug = false,
      children,
      ...boxProps
    },
    ref,
  ) => {
    // Current scroll position (offset from top).
    const [scrollOffset, setScrollOffset, getScrollOffset] = useStateRef(0);

    const innerRef = useRef<ControlledScrollViewRef>(null);

    // Track content height to handle clamping
    const contentHeightRef = useRef(0);

    const handleContentHeightChange = useCallback(
      (height: number, previousHeight: number) => {
        contentHeightRef.current = height;
        onContentHeightChange?.(height, previousHeight);

        // Clamp scroll position if it exceeds the new max scroll.
        // This ensures the view doesn't get "stuck" showing empty space if content shrinks.
        if (getScrollOffset() > height) {
          setScrollOffset(height);
          onScroll?.(height);
        }
      },
      [onContentHeightChange, onScroll, getScrollOffset, setScrollOffset],
    );

    // Helper to calculate the bottom scroll offset
    const getBottomOffset = useCallback(
      () =>
        Math.max(
          0,
          contentHeightRef.current -
            (innerRef.current?.getViewportHeight() || 0),
        ),
      [],
    );

    // Expose control methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        scrollTo: (offset: number) => {
          if (typeof offset !== "number" || isNaN(offset)) {
            return;
          }
          const currentContentHeight = contentHeightRef.current;
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
          if (typeof delta !== "number" || isNaN(delta)) {
            return;
          }
          const currentContentHeight = contentHeightRef.current;
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
          const bottomOffset = getBottomOffset();
          if (getScrollOffset() !== bottomOffset) {
            setScrollOffset(bottomOffset);
            onScroll?.(bottomOffset);
          }
        },
        getScrollOffset,
        getContentHeight: () => contentHeightRef.current,
        getViewportHeight: () => innerRef.current?.getViewportHeight() || 0,
        getBottomOffset,
        getItemHeight: (index: number) =>
          innerRef.current?.getItemHeight(index) || 0,
        getItemPosition: (index: number) =>
          innerRef.current?.getItemPosition(index) || null,
        remeasure: () => innerRef.current?.remeasure(),
        remeasureItem: (index: number) =>
          innerRef.current?.remeasureItem(index),
      }),
      [onScroll, getBottomOffset, getScrollOffset, setScrollOffset],
    );

    return (
      <ControlledScrollView
        ref={innerRef}
        scrollOffset={scrollOffset}
        onViewportSizeChange={onViewportSizeChange}
        onContentHeightChange={handleContentHeightChange}
        onItemHeightChange={onItemHeightChange}
        debug={debug}
        children={children}
        {...boxProps}
      />
    );
  },
);
