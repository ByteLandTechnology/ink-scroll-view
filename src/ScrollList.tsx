import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { ScrollView, ScrollViewRef, ScrollViewProps } from "./ScrollView";

/**
 * Alignment mode for scrolling to items.
 */
export type ScrollAlignment = "auto" | "top" | "bottom" | "center";

/**
 * Props for the ScrollList component.
 *
 * @remarks
 * Extends {@link ScrollViewProps} and adds selection state management
 * with automatic scroll-into-view behavior.
 */
export interface ScrollListProps extends ScrollViewProps {
  /**
   * The currently selected item index.
   *
   * @remarks
   * When this value changes, the component will automatically scroll to ensure
   * the selected item is visible in the viewport.
   */
  selectedIndex?: number;

  /**
   * Alignment mode when scrolling to the selected item.
   *
   * @remarks
   * - `'auto'`: Minimal scrolling to bring item into view (default).
   * - `'top'`: Align item to the top of the viewport.
   * - `'bottom'`: Align item to the bottom of the viewport.
   * - `'center'`: Align item to the center of the viewport.
   *
   * @defaultValue `'auto'`
   */
  scrollAlignment?: ScrollAlignment;

  /**
   * Callback fired when the selected index changes internally.
   *
   * @remarks
   * This is called when selection changes due to internal navigation methods
   * like `selectNext()` or `selectPrevious()`.
   *
   * @param index - The new selected index.
   */
  onSelectionChange?: (index: number) => void;
}

/**
 * Ref interface for controlling the ScrollList programmatically.
 *
 * @remarks
 * Extends {@link ScrollViewRef} with selection management methods.
 */
export interface ScrollListRef extends ScrollViewRef {
  /**
   * Scrolls to a specific child item by index.
   *
   * @param index - The index of the child to scroll to.
   * @param mode - Alignment mode. Defaults to component's `scrollAlignment` prop.
   */
  scrollToItem: (index: number, mode?: ScrollAlignment) => void;

  /**
   * Gets the currently selected index.
   *
   * @returns The current selection index, or `-1` if nothing is selected.
   */
  getSelectedIndex: () => number;

  /**
   * Selects an item by index and scrolls to make it visible.
   *
   * @param index - The index to select.
   * @param mode - Alignment mode. Defaults to component's `scrollAlignment` prop.
   */
  select: (index: number, mode?: ScrollAlignment) => void;

  /**
   * Selects the next item and scrolls to make it visible.
   *
   * @remarks
   * Does nothing if already at the last item.
   *
   * @returns The new selected index.
   */
  selectNext: () => number;

  /**
   * Selects the previous item and scrolls to make it visible.
   *
   * @remarks
   * Does nothing if already at the first item.
   *
   * @returns The new selected index.
   */
  selectPrevious: () => number;

  /**
   * Selects the first item and scrolls to the top.
   *
   * @returns The new selected index (0).
   */
  selectFirst: () => number;

  /**
   * Selects the last item and scrolls to the bottom.
   *
   * @returns The new selected index.
   */
  selectLast: () => number;

  /**
   * Checks if the currently selected item is fully visible.
   *
   * @returns `true` if the selected item is completely within the viewport.
   */
  isSelectedVisible: () => boolean;

  /**
   * Gets the total number of items.
   *
   * @returns The count of child elements.
   */
  getItemCount: () => number;
}

/**
 * A scrollable list with built-in selection state management.
 *
 * @remarks
 * This component extends {@link ScrollView} to provide:
 * - Selection state tracking
 * - Automatic scroll-into-view when selection changes
 * - Navigation methods (`selectNext`, `selectPrevious`, etc.)
 *
 * **IMPORTANT**:
 * - This component does NOT handle user input. Use `useInput` to control selection.
 * - This component does NOT automatically respond to terminal resize events.
 *   Call `forceLayout()` on resize.
 *
 * @example
 * ```tsx
 * const listRef = useRef<ScrollListRef>(null);
 * const [selectedIndex, setSelectedIndex] = useState(0);
 *
 * useInput((input, key) => {
 *   if (key.downArrow) {
 *     const newIndex = listRef.current?.selectNext() ?? 0;
 *     setSelectedIndex(newIndex);
 *   }
 *   if (key.upArrow) {
 *     const newIndex = listRef.current?.selectPrevious() ?? 0;
 *     setSelectedIndex(newIndex);
 *   }
 * });
 *
 * return (
 *   <ScrollList
 *     ref={listRef}
 *     selectedIndex={selectedIndex}
 *     scrollAlignment="auto"
 *     height={10}
 *   >
 *     {items.map((item, i) => (
 *       <Box key={i} borderStyle={i === selectedIndex ? 'double' : 'single'}>
 *         <Text>{item}</Text>
 *       </Box>
 *     ))}
 *   </ScrollList>
 * );
 * ```
 */
export const ScrollList = forwardRef<ScrollListRef, ScrollListProps>(
  (
    {
      children,
      selectedIndex: controlledSelectedIndex,
      scrollAlignment = "auto",
      onScroll,
      onSelectionChange,
      ...boxProps
    },
    ref,
  ) => {
    const scrollViewRef = useRef<ScrollViewRef>(null);

    // Internal selection state (used when not controlled)
    const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);

    // Use controlled or internal selection
    const selectedIndex = controlledSelectedIndex ?? internalSelectedIndex;
    const itemCount = React.Children.count(children);

    // Scroll to item helper
    const scrollToItem = useCallback(
      (index: number, mode: ScrollAlignment = scrollAlignment) => {
        const layout = scrollViewRef.current?.getItemLayout(index);
        if (!layout) return;

        const { top: itemTop, height: itemHeight } = layout;
        const viewportHeight = scrollViewRef.current?.getViewportHeight() ?? 0;
        const currentScrollOffset =
          scrollViewRef.current?.getScrollOffset() ?? 0;
        const maxScrollOffset =
          scrollViewRef.current?.getMaxScrollOffset() ?? 0;

        let targetScrollOffset = currentScrollOffset;

        if (mode === "top") {
          targetScrollOffset = itemTop;
        } else if (mode === "bottom") {
          targetScrollOffset = itemTop + itemHeight - viewportHeight;
        } else if (mode === "center") {
          targetScrollOffset = itemTop + itemHeight / 2 - viewportHeight / 2;
        } else {
          // auto - minimal scrolling
          const itemBottom = itemTop + itemHeight;
          if (itemTop < currentScrollOffset) {
            targetScrollOffset = itemTop;
          } else if (itemBottom > currentScrollOffset + viewportHeight) {
            targetScrollOffset = itemBottom - viewportHeight;
          }
        }

        const clampedScrollOffset = Math.max(
          0,
          Math.min(targetScrollOffset, maxScrollOffset),
        );
        if (clampedScrollOffset !== currentScrollOffset) {
          scrollViewRef.current?.scrollTo(clampedScrollOffset);
        }
      },
      [scrollAlignment],
    );

    // Update selection and notify
    const updateSelection = useCallback(
      (newIndex: number, mode?: ScrollAlignment) => {
        const clampedIndex = Math.max(0, Math.min(newIndex, itemCount - 1));
        if (controlledSelectedIndex === undefined) {
          setInternalSelectedIndex(clampedIndex);
        }
        onSelectionChange?.(clampedIndex);

        // Scroll to item after a tick to ensure layout is measured
        setImmediate(() => {
          scrollToItem(clampedIndex, mode);
        });

        return clampedIndex;
      },
      [itemCount, controlledSelectedIndex, onSelectionChange, scrollToItem],
    );

    // Auto-scroll when selectedIndex changes
    useEffect(() => {
      if (selectedIndex >= 0 && selectedIndex < itemCount) {
        // Use setImmediate to ensure layout is ready
        setImmediate(() => {
          scrollToItem(selectedIndex);
        });
      }
    }, [selectedIndex, scrollToItem, itemCount]);

    // Expose API via ref
    useImperativeHandle(ref, () => ({
      // Delegate to ScrollView
      scrollTo: (y: number) => scrollViewRef.current?.scrollTo(y),
      scrollBy: (delta: number) => scrollViewRef.current?.scrollBy(delta),
      scrollToTop: () => scrollViewRef.current?.scrollToTop(),
      scrollToBottom: () => scrollViewRef.current?.scrollToBottom(),
      getScrollOffset: () => scrollViewRef.current?.getScrollOffset() ?? 0,
      getMaxScrollOffset: () =>
        scrollViewRef.current?.getMaxScrollOffset() ?? 0,
      getViewportHeight: () => scrollViewRef.current?.getViewportHeight() ?? 0,
      getItemLayout: (index: number) =>
        scrollViewRef.current?.getItemLayout(index) ?? null,
      forceLayout: () => scrollViewRef.current?.forceLayout(),

      // Selection-specific methods
      scrollToItem,
      getSelectedIndex: () => selectedIndex,
      select: (index: number, mode?: ScrollAlignment) => {
        updateSelection(index, mode);
      },
      selectNext: () => {
        if (selectedIndex < itemCount - 1) {
          return updateSelection(selectedIndex + 1);
        }
        return selectedIndex;
      },
      selectPrevious: () => {
        if (selectedIndex > 0) {
          return updateSelection(selectedIndex - 1);
        }
        return selectedIndex;
      },
      selectFirst: () => {
        return updateSelection(0, "top");
      },
      selectLast: () => {
        return updateSelection(itemCount - 1, "bottom");
      },
      isSelectedVisible: () => {
        const layout = scrollViewRef.current?.getItemLayout(selectedIndex);
        return (
          (layout?.isVisible && layout.visibleHeight === layout.height) ?? false
        );
      },
      getItemCount: () => itemCount,
    }));

    return (
      <ScrollView ref={scrollViewRef} onScroll={onScroll} {...boxProps}>
        {children}
      </ScrollView>
    );
  },
);
