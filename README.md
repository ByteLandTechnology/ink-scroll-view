# ink-scroll-view

A robust ScrollView and ScrollList component for [Ink](https://github.com/vadimdemedes/ink) CLI applications.

![License](https://img.shields.io/npm/l/ink-scroll-view)
![Version](https://img.shields.io/npm/v/ink-scroll-view)

## Features

- **ScrollView**: A flexible container for scrolling content that exceeds the viewport.
- **Performance**: Optimized for Ink, simplyfing layout calculations to O(1) where possible and efficiently rendering only visible items.
- **Stability**: Implements scroll anchoring to keep the visible viewport stable even when content above dynamicially expands or collapses.

## Installation

```bash
npm install ink-scroll-view
# Peer dependencies
npm install ink react
```

## Usage

### ScrollView

The `ScrollView` is a low-level container. You are responsible for handling input (e.g., using `useInput` from Ink) and calling the exposed ref methods.

```tsx
import React, { useRef, useEffect } from "react";
import { render, Text, useInput, useStdout } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";

const App = () => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const { stdout } = useStdout();

  // Handle terminal resize
  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure();
    stdout?.on("resize", handleResize);
    return () => {
      stdout?.off("resize", handleResize);
    };
  }, [stdout]);

  useInput((input, key) => {
    if (key.upArrow) scrollRef.current?.scrollBy(-1);
    if (key.downArrow) scrollRef.current?.scrollBy(1);
  });

  return (
    <ScrollView ref={scrollRef} height={10}>
      {Array.from({ length: 50 }).map((_, i) => (
        <Text key={i}>Item {i + 1}</Text>
      ))}
    </ScrollView>
  );
};

render(<App />);
```

## Key Methods

### ScrollViewRef

| Method                 | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `scrollTo(y)`          | Scroll to a specific vertical position                     |
| `scrollBy(delta)`      | Scroll by a relative amount                                |
| `scrollToTop()`        | Scroll to the top                                          |
| `scrollToBottom()`     | Scroll to the bottom                                       |
| `getScrollOffset()`    | Get current scroll offset                                  |
| `getMaxScrollOffset()` | Get maximum scroll offset                                  |
| `getViewportHeight()`  | Get viewport height                                        |
| `getItemLayout(index)` | Get layout info for a specific item                        |
| `remeasure()`          | Force re-measurement of all items                          |
| `remeasureItem(index)` | Re-measure a specific item (efficient for expand/collapse) |

## API Documentation

See the [API Reference](docs/api/README.md) for full details on props, methods, and interfaces.

## License

MIT
