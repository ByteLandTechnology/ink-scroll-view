# ink-scroll-view

A robust ScrollView and ScrollList component for [Ink](https://github.com/vadimdemedes/ink) CLI applications.

![License](https://img.shields.io/npm/l/ink-scroll-view)
![Version](https://img.shields.io/npm/v/ink-scroll-view)

## Features

- **ScrollView**: A flexible container for scrolling content that exceeds the viewport.
- **ScrollList**: A high-level component managing selection state and automatic scrolling (ideal for menus and lists).
- **Performance**: Optimized for Ink, efficiently measuring and rendering only visible items.
- **TypeScript**: Written in TypeScript with full type definitions and TSDoc comments.
- **Navigation**: Built-in support for programmatic scrolling and selection (next/previous/first/last).

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

### ScrollList

The `ScrollList` simplifies building selectable lists. It manages the `selectedIndex` and ensures the selected item is always visible.

```tsx
import React, { useRef, useState } from "react";
import { render, Text, Box, useInput } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-view";

const App = () => {
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];

  useInput((input, key) => {
    if (key.upArrow) listRef.current?.selectPrevious();
    if (key.downArrow) listRef.current?.selectNext();
  });

  return (
    <ScrollList
      ref={listRef}
      height={4}
      selectedIndex={selectedIndex}
      onSelectionChange={setSelectedIndex}
    >
      {items.map((item, i) => (
        <Box key={i}>
          <Text color={i === selectedIndex ? "green" : "white"}>
            {i === selectedIndex ? "> " : "  "}
            {item}
          </Text>
        </Box>
      ))}
    </ScrollList>
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

### ScrollListRef

Extends `ScrollViewRef` with:

| Method                       | Description                       |
| ---------------------------- | --------------------------------- |
| `scrollToItem(index, mode?)` | Scroll to a specific item         |
| `select(index, mode?)`       | Select an item and scroll to it   |
| `selectNext()`               | Select the next item              |
| `selectPrevious()`           | Select the previous item          |
| `selectFirst()`              | Select the first item             |
| `selectLast()`               | Select the last item              |
| `getSelectedIndex()`         | Get current selected index        |
| `isSelectedVisible()`        | Check if selected item is visible |
| `getItemCount()`             | Get total number of items         |

## API Documentation

See the [API Reference](docs/api/README.md) for full details on props, methods, and interfaces.

## License

MIT
