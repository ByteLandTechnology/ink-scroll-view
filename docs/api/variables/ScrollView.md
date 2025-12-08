[**ink-scroll-view**](../README.md)

---

# Variable: ScrollView

> `const` **ScrollView**: `ForwardRefExoticComponent`\<[`ScrollViewProps`](../interfaces/ScrollViewProps.md) & `RefAttributes`\<[`ScrollViewRef`](../interfaces/ScrollViewRef.md)\>\>

A ScrollView component for Ink applications.

## Remarks

Allows scrolling through content that exceeds the visible area of the terminal.
It manages a virtual viewport and renders all children, but strictly controls
their visibility using `overflow="hidden"` and `marginTop` offsets.

**Features:**

- ↕️ Vertical scrolling
- 📏 Auto-measurement of child heights
- 🎯 Imperative scrolling methods via ref
- 🔁 Dynamic content support (adding/removing children)
- 🖥️ Viewport resize handling (via manual `remeasure`)

**Important Notes:**

- This component does NOT typically handle keyboard input directly. Use a hook like `useInput` in a parent component and call `scrollBy` or `scrollTo`.
- Children MUST generally have specific keys if you plan to dynamically update them, to ensure correct height tracking.

## Example

```tsx
import React, { useRef } from "react";
import { Box, Text, useInput } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";

const Demo = () => {
  const scrollRef = useRef<ScrollViewRef>(null);

  useInput((input, key) => {
    if (key.downArrow) {
      scrollRef.current?.scrollBy(1);
    }
    if (key.upArrow) {
      scrollRef.current?.scrollBy(-1);
    }
  });

  return (
    <Box height={10} borderStyle="single">
      <ScrollView ref={scrollRef}>
        {items.map((item) => (
          <Text key={item.id}>{item.label}</Text>
        ))}
      </ScrollView>
    </Box>
  );
};
```
