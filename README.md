# ink-scroll-view

A robust, performance-optimized ScrollView component for [Ink](https://github.com/vadimdemedes/ink) CLI applications.

![License](https://img.shields.io/npm/l/ink-scroll-view?style=flat-square) ![Version](https://img.shields.io/npm/v/ink-scroll-view?style=flat-square) ![Downloads](https://img.shields.io/npm/d18m/ink-scroll-view?style=flat-square)

Visit the [**Project Website**](https://ink-scroll-view.byteland.app).

## 📘 Documentation

Read the [**Documentation**](https://ink-scroll-view.byteland.app/docs).

## ✨ Features

- **📦 Flexible Container**: Handles content larger than the visible terminal viewport.
- **⚡ Performance First**:
  - **Optimistic Updates**: Immediate state updates for smoother interaction.
  - **Efficient Re-rendering**: Renders all children but strictly manages visibility via `overflow` and offsets, ensuring correct layout without layout thrashing.
- **📏 Auto-Measurement**: Automatically measures child heights using a virtually rendered DOM.
- **🔁 Dynamic Content**: Supports adding, removing, and expanding/collapsing items on the fly.
- **⚓️ Layout Stability**: Includes logic to maintain scroll position context when content changes.

## 🎬 Demos

Try the interactive [**Showcase**](https://ink-scroll-view.byteland.app/showcase).

### Scrolling

![Scrolling Demo](docs/_media/scroll.svg)

### Dynamic Items

![Dynamic Items Demo](docs/_media/items.svg)

### Expand/Collapse

![Expand Demo](docs/_media/expand.svg)

### Resize

![Resize Demo](docs/_media/resize.svg)

### Dynamic Width

![Width Demo](docs/_media/width.svg)

## 📦 Installation

```bash
npm install ink-scroll-view
# Peer dependencies
npm install ink react
```

## 🚀 Usage

`ScrollView` is a layout primitive. It **does not** capture user input automatically. You must control it programmatically using React `refs` and Ink's `useInput`.

```tsx
import React, { useRef, useEffect } from "react";
import { render, Text, Box, useInput, useStdout } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";

const App = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const { stdout } = useStdout();

  // 1. Handle Terminal Resizing due to manual window change
  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure();
    stdout?.on("resize", handleResize);
    return () => {
      stdout?.off("resize", handleResize);
    };
  }, [stdout]);

  // 2. Handle Keyboard Input
  useInput((input, key) => {
    if (key.upArrow) {
      scrollRef.current?.scrollBy(-1); // Scroll up 1 line
    }
    if (key.downArrow) {
      scrollRef.current?.scrollBy(1); // Scroll down 1 line
    }
    if (key.pageUp) {
      // Scroll up by viewport height
      const height = scrollRef.current?.getViewportHeight() || 1;
      scrollRef.current?.scrollBy(-height);
    }
    if (key.pageDown) {
      const height = scrollRef.current?.getViewportHeight() || 1;
      scrollRef.current?.scrollBy(height);
    }
  });

  return (
    <Box
      height={10}
      width="100%"
      borderStyle="single"
      borderColor="green"
      flexDirection="column"
    >
      <ScrollView ref={scrollRef}>
        {Array.from({ length: 50 }).map((_, i) => (
          <Text key={i}>Item {i + 1} - content with variable length...</Text>
        ))}
      </ScrollView>
    </Box>
  );
};

render(<App />);
```

## 📐 How it Works

The component renders all children into a container but shifts the content vertically using `marginTop`. The parent box with `overflow="hidden"` acts as the "viewport".

```
┌─────────────────────────┐
│  (hidden content)       │ ← Content above viewport
│  ...                    │
├─────────────────────────┤ ← scrollOffset (distance from top)
│  ┌───────────────────┐  │
│  │ Visible Viewport  │  │ ← What user sees
│  │                   │  │
│  └───────────────────┘  │
├─────────────────────────┤
│  (hidden content)       │ ← Content below viewport
│  ...                    │
└─────────────────────────┘
```

## 📚 API Reference

For detailed API documentation, see [API Reference](docs/api/README.md).

### Props (`ScrollViewProps`)

Inherits standard `BoxProps` from Ink.

| Prop                    | Type                                      | Description                                                                     |
| :---------------------- | :---------------------------------------- | :------------------------------------------------------------------------------ |
| `children`              | `ReactNode`                               | Optional. List of child elements. **Must use unique `key`s** (strings/numbers). |
| `onScroll`              | `(offset: number) => void`                | Called when scroll position changes.                                            |
| `onViewportSizeChange`  | `(layout: { width, height }) => void`     | Called when the **viewport** dimensions change.                                 |
| `onContentHeightChange` | `(height: number) => void`                | Called when the total content height changes.                                   |
| `onItemHeightChange`    | `(index, height, previousHeight) => void` | Called when an individual item's height changes.                                |
| ...                     | `BoxProps`                                | Any other prop accepted by Ink's `Box`.                                         |

### Ref Methods (`ScrollViewRef`)

Access these via `ref.current`.

| Method              | Signature                            | Description                                                                                                                |
| :------------------ | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `scrollTo`          | `(offset: number) => void`           | Scrolls to an absolute Y offset from the top.                                                                              |
| `scrollBy`          | `(delta: number) => void`            | Scrolls by a relative amount (negative = up, positive = down).                                                             |
| `scrollToTop`       | `() => void`                         | Helper to scroll to offset 0.                                                                                              |
| `scrollToBottom`    | `() => void`                         | Helper to scroll to the maximum possible offset (`contentHeight - viewportHeight`).                                        |
| `getScrollOffset`   | `() => number`                       | Returns the current scroll offset.                                                                                         |
| `getContentHeight`  | `() => number`                       | Returns the total height of all content items.                                                                             |
| `getViewportHeight` | `() => number`                       | Returns the current height of the visible area.                                                                            |
| `getBottomOffset`   | `() => number`                       | Returns the scroll offset when scrolled to the bottom (`contentHeight - viewportHeight`).                                  |
| `getItemHeight`     | `(index: number) => number`          | Returns the measured height of a specific item by its index.                                                               |
| `getItemPosition`   | `(index: number) => { top, height }` | Returns the position (top offset) and height of a specific item.                                                           |
| `remeasure`         | `() => void`                         | Re-checks viewport dimensions. **Must call this on terminal resize.**                                                      |
| `remeasureItem`     | `(index: number) => void`            | Forces a specific child to re-measure. Useful for dynamic content (expand/collapse) that doesn't trigger a full re-render. |

## 💡 Tips

1.  **Unique Keys**: Always provide stable, unique `key` props (strings or numbers) to your children. This allows `ScrollView` to accurately track height changes even when items are re-ordered or removed.
2.  **Terminal Resizing**: Ink components don't automatically know when the terminal window resizes. You need to listen to `process.stdout`'s `resize` event and call `remeasure()` on the ref.
3.  **Dynamic Content**: If you have an item that expands (e.g., "See more"), calling `remeasureItem(index)` is more efficient than forcing a full update.

## 🔗 Related Packages

This package is part of a family of Ink scroll components:

| Package                                                                  | Description                                                                                          |
| :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| [ink-scroll-view](https://github.com/ByteLandTechnology/ink-scroll-view) | Core scroll container component (this package)                                                       |
| [ink-scroll-list](https://github.com/ByteLandTechnology/ink-scroll-list) | A scrollable list component built on top of ink-scroll-view with focus management and item selection |
| [ink-scroll-bar](https://github.com/ByteLandTechnology/ink-scroll-bar)   | A standalone scrollbar component that can be used with any scroll container                          |

## License

MIT
