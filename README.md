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

The `ScrollView` is a low-level container. You are responsible for handling input (e.g., using `useInput` from Ink) and calling the exposed `scrollTo` or `scrollBy` methods.

```tsx
import React, { useRef } from "react";
import { render, Text, useInput } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";

const App = () => {
  const scrollRef = useRef<ScrollViewRef>(null);

  useInput((input, key) => {
    if (key.upArrow) {
      scrollRef.current?.scrollBy(-1);
    }
    if (key.downArrow) {
      scrollRef.current?.scrollBy(1);
    }
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
    if (key.upArrow) {
      // selectPrevious returns the new index
      const newIndex = listRef.current?.selectPrevious() ?? 0;
      setSelectedIndex(newIndex);
    }
    if (key.downArrow) {
      // selectNext returns the new index
      const newIndex = listRef.current?.selectNext() ?? 0;
      setSelectedIndex(newIndex);
    }
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

## API Documentation

See the [API Reference](docs/api/modules.md) for full details on props, methods, and interfaces.

## License

MIT
