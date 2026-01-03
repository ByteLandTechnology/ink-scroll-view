import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useCallback,
  Children,
  ReactNode,
  isValidElement,
} from "react";
import { Box, BoxProps, measureElement, DOMElement } from "ink";

/**
 * Internal helper component to measure the height of each child item.
 *
 * @internal
 * @remarks
 * This component wraps each child in a Box and uses `measureElement` from `ink`
 * to determine its dimensions. It reports the height back to the parent via `onMeasure`.
 *
 * It uses `useLayoutEffect` to measure synchronously after rendering to ensure
 * layout stability and prevent flickering.
 */
const MeasurableItem = ({
  children,
  onMeasure,
  index,
  width,
  measureKey,
}: {
  children: ReactNode;
  onMeasure: (index: number, height: number) => void;
  index: number;
  width: number;
  // Used to force re-measurement even if other props haven't changed
  measureKey?: number;
}) => {
  const ref = useRef<DOMElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const { height } = measureElement(ref.current);
      onMeasure(index, height);
    }
  }, [index, onMeasure, width, measureKey, children]);

  return (
    <Box ref={ref} flexShrink={0} width="100%" flexDirection="column">
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

export interface ControlledScrollViewProps extends BoxProps {
  /**
   * The current scroll offset (distance from top).
   * Controlled by the parent.
   */
  scrollOffset: number;

  /**
   * Callback fired when the ScrollView viewport (visible area) dimensions change.
   */
  onViewportSizeChange?: (
    size: { width: number; height: number },
    previousSize: { width: number; height: number },
  ) => void;

  /**
   * Callback fired when the total height of the content changes.
   */
  onContentHeightChange?: (height: number, previousHeight: number) => void;

  /**
   * Callback fired when an individual child item's height changes.
   */
  onItemHeightChange?: (
    index: number,
    height: number,
    previousHeight: number,
  ) => void;

  /**
   * Enable debug mode to visualize the ScrollView internals.
   */
  debug?: boolean;

  children?: ReactNode;
}

export interface ControlledScrollViewRef {
  /**
   * Gets the total height of the content.
   *
   * @returns The sum of heights of all child items.
   */
  getContentHeight: () => number;

  /**
   * Gets the current height of the visible viewport.
   *
   * @returns The height of the viewport container.
   */
  getViewportHeight: () => number;

  /**
   * Gets the maximum scroll offset (content height - viewport height).
   *
   * @remarks
   * This represents the scroll offset required to view the very bottom of the content.
   * It is clamped to 0 if the content fits entirely within the viewport.
   */
  getBottomOffset: () => number;

  /**
   * Gets the height of a specific item by its index.
   *
   * @param index - The index of the child item.
   * @returns The measured height of the item.
   */
  getItemHeight: (index: number) => number;

  /**
   * Gets the absolute position and dimensions of a specific item.
   *
   * @param index - The index of the child item.
   * @returns Object containing `top` (offset from content start) and `height`, or `null` if the index is invalid.
   *
   * @remarks
   * This method uses a cached offset calculation system (`itemOffsetsRef`) for performance.
   * It calculates offsets lazily and caches them until the underlying measurements change.
   */
  getItemPosition: (index: number) => { top: number; height: number } | null;

  /**
   * Re-measures the ScrollView viewport dimensions.
   *
   * @remarks
   * Explicitly triggers a measurement of the viewport Box. This is necessary because
   * Ink does not automatically detect terminal window resizes or parent layout changes
   * that might affect the viewport size.
   */
  remeasure: () => void;

  /**
   * Triggers re-measurement of a specific child item.
   *
   * @param index - The index of the child to re-measure.
   *
   * @remarks
   * Forces the `MeasurableItem` wrapper for the specified index to re-run `measureElement`.
   * Use this when a child's content changes internally (e.g., expanding text) without changing props.
   */
  remeasureItem: (index: number) => void;
}

/**
 * A ControlledScrollView component for Ink applications.
 *
 * @remarks
 * This is a lower-level component that handles the complex logic of:
 * 1. Rendering children within a virtual viewport.
 * 2. Continuously measuring child heights.
 * 3. Calculating total content height.
 * 4. Managing viewport wrapping adjustments (`marginTop`).
 *
 * It is "controlled" because it does not maintain its own scroll state; it purely renders
 * based on the provided `scrollOffset` prop. This allows for flexible parent-controlled behavior.
 */
export const ControlledScrollView = forwardRef<
  ControlledScrollViewRef,
  ControlledScrollViewProps
>(
  (
    {
      scrollOffset,
      onViewportSizeChange,
      onContentHeightChange,
      onItemHeightChange,
      debug = false,
      children,
      ...boxProps
    },
    ref,
  ) => {
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

    // Track previous content height to fire the change callback
    const prevContentHeightRef = useRef(0);

    useLayoutEffect(() => {
      if (contentHeight !== prevContentHeightRef.current) {
        onContentHeightChange?.(contentHeight, prevContentHeightRef.current);
        prevContentHeightRef.current = contentHeight;
      }
    }, [contentHeight, onContentHeightChange]);

    /**
     * Map of item unique keys (or indices) to their measured heights.
     * Used to calculate total content height and individual item offsets.
     */
    const itemHeightsRef = useRef<Record<string | number, number>>({});

    /**
     * Map of child index to their unique key.
     * Preserves the association between standard array indices and React element keys.
     */
    const itemKeysRef = useRef<(string | number)[]>([]);

    /**
     * Cache of accumulated item offset positions (distance from top).
     * `itemOffsetsRef.current[i]` stores the `top` position of item `i`.
     *
     * @remarks
     * This cache is strictly lazy. It is populated only when `getItemPosition` is called.
     * The `firstInvalidOffsetIndexRef` tracks which part of the cache is valid.
     */
    const itemOffsetsRef = useRef<number[]>([]);

    /**
     * The index of the first item whose cached offset is considered invalid/dirty.
     *
     * @remarks
     * When an item's height changes, all subsequent items' offsets become incorrect.
     * We set this index to the changed item's index.
     * When querying positions, we recalculate offsets from this index onwards.
     */
    const firstInvalidOffsetIndexRef = useRef<number>(0);

    const handleItemMeasure = useCallback(
      (index: number, height: number) => {
        // Identify the item by its stable key (or index if no key provided)
        const key = itemKeysRef.current[index] || index;

        // Check if the measurement has actually changed to avoid unnecessary updates
        if (itemHeightsRef.current[key] !== height) {
          const previousHeight = itemHeightsRef.current[key] || 0;

          // Update the height map
          itemHeightsRef.current = {
            ...itemHeightsRef.current,
            [key]: height,
          };

          // Recalculate total content height
          let newTotalHeight = 0;
          for (const itemKey of itemKeysRef.current) {
            newTotalHeight += itemHeightsRef.current[itemKey] || 0;
          }

          const currentHeight = getContentHeight();
          if (newTotalHeight !== currentHeight) {
            setContentHeight(newTotalHeight);
          }

          // Notify parent of the specific item change
          onItemHeightChange?.(index, height, previousHeight);

          // Invalidate the offset cache starting from this item
          // because if this item's height changed, all items below it have shifted.
          firstInvalidOffsetIndexRef.current = Math.min(
            firstInvalidOffsetIndexRef.current,
            index + 1,
          );
        }
      },
      [
        onItemHeightChange,
        onContentHeightChange,
        getContentHeight,
        setContentHeight,
      ],
    );

    const measureViewport = useCallback(() => {
      if (viewportRef.current) {
        const { width, height } = measureElement(viewportRef.current);
        const currentSize = getViewportSize();
        if (width !== currentSize.width || height !== currentSize.height) {
          onViewportSizeChange?.({ width, height }, currentSize);
          setViewportSize({ width, height });
        }
      }
    }, [viewportRef, onViewportSizeChange, getViewportSize, setViewportSize]);

    useLayoutEffect(() => {
      measureViewport();
    });

    const prevChildrenRef = useRef<typeof children>(null);
    if (prevChildrenRef.current !== children) {
      prevChildrenRef.current = children;

      const newItemKeys: (string | number)[] = [];
      const newItemHeights: Record<string | number, number> = {};

      Children.forEach(children, (child, index) => {
        if (!child) return;
        const key = isValidElement(child) ? child.key : null;
        const effectiveKey = key !== null ? key : index;

        newItemKeys[index] = effectiveKey;
        const itemHeight = itemHeightsRef.current[effectiveKey] || 0;
        newItemHeights[effectiveKey] = itemHeight;
      });

      itemHeightsRef.current = newItemHeights;
      itemKeysRef.current = newItemKeys;
      itemOffsetsRef.current = new Array(newItemKeys.length).fill(0);
      firstInvalidOffsetIndexRef.current = 0;

      let newTotalHeight = 0;
      newItemKeys.forEach((itemKey) => {
        newTotalHeight += newItemHeights[itemKey] || 0;
      });

      const currentHeight = getContentHeight();
      if (newTotalHeight !== currentHeight) {
        setContentHeight(newTotalHeight);
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        getContentHeight,
        getViewportHeight: () => getViewportSize().height,
        getBottomOffset: () =>
          Math.max(0, getContentHeight() - getViewportSize().height),
        getItemHeight: (index: number) => {
          const key = itemKeysRef.current[index] || index;
          return itemHeightsRef.current[key] || 0;
        },
        remeasure: measureViewport,
        remeasureItem: (index: number) =>
          setItemMeasureKeys((prev) => ({
            ...prev,
            [index]: (prev[index] || 0) + 1,
          })),
        getItemPosition: (index: number) => {
          if (index < 0 || index >= itemKeysRef.current.length) {
            return null;
          }

          if (index >= firstInvalidOffsetIndexRef.current) {
            let currentOffset = 0;
            let startIndex = 0;

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
      [],
    );

    return (
      <Box {...boxProps}>
        <Box ref={viewportRef} width="100%">
          <Box overflow={debug ? undefined : "hidden"} width="100%">
            <Box
              ref={contentRef}
              width="100%"
              flexDirection="column"
              marginTop={-scrollOffset}
            >
              {Children.map(children, (child, index) => {
                if (!child) return null;
                return (
                  <MeasurableItem
                    key={isValidElement(child) ? child.key || index : index}
                    index={index}
                    width={viewportSize.width}
                    onMeasure={handleItemMeasure}
                    measureKey={itemMeasureKeys[index]}
                  >
                    {child}
                  </MeasurableItem>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);
