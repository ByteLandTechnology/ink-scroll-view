[**ink-scroll-view**](../README.md)

---

# Interface: ScrollViewRef

Ref interface for controlling the ScrollView programmatically.

## Extended by

- [`ScrollListRef`](ScrollListRef.md)

## Properties

### getItemLayout()

> **getItemLayout**: (`index`) => \{ `bottom`: `number`; `height`: `number`; `isVisible`: `boolean`; `top`: `number`; `visibleHeight`: `number`; `visibleTop`: `number`; \} \| `null`

Gets the layout information (position and size) of a specific item.

#### Parameters

##### index

`number`

The index of the child item (0-based).

#### Returns

\{ `bottom`: `number`; `height`: `number`; `isVisible`: `boolean`; `top`: `number`; `visibleHeight`: `number`; `visibleTop`: `number`; \} \| `null`

An object containing the item's layout metrics, or `null` if
the index is out of bounds or the item hasn't been measured yet.

#### Remarks

**Layout Coordinate System**:

```
                 Content Area
┌─────────────────────────────────┐  ← top = 0
│  Item 0                         │
│  (height: 3)                    │
├─────────────────────────────────┤  ← top = 3
│  Item 1                         │
│  (height: 2)                    │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  ← scrollOffset (viewport start)
│ ┌─────────────────────────────┐ │
│ │ Item 2 (partially visible)  │ │  ← visibleTop = 0 (relative to viewport)
├─┼─────────────────────────────┼─┤  ← top = 5
│ │ Item 3 (fully visible)      │ │
│ │ (height: 4)                 │ │
│ └─────────────────────────────┘ │  ← visibleHeight = 4 (fully visible)
├─────────────────────────────────┤  ← viewport end
│  Item 4                         │
│  (partially visible)            │
└─────────────────────────────────┘  ← bottom of content
```

**Return Properties**:

- `top`: Absolute Y position of the item's top edge within the entire
  content area (not the viewport). This is the sum of all preceding
  items' heights.

- `height`: The measured height of this item in terminal rows.

- `bottom`: Absolute Y position of the item's bottom edge (`top + height`).

- `isVisible`: `true` if any part of the item is currently within the
  visible viewport.

- `visibleTop`: The Y position where the visible portion of this item
  starts, **relative to the viewport** (not the content). If the item
  is above the viewport, this would be 0 (clamped). If the item starts
  within the viewport, this is `top - scrollOffset`.

- `visibleHeight`: How many rows of this item are actually visible.
  Equals `height` if fully visible, less if partially visible, 0 if
  not visible.

#### Example

```tsx
const layout = scrollViewRef.current?.getItemLayout(5);
if (layout) {
  console.log(`Item 5 position: top=${layout.top}, height=${layout.height}`);
  console.log(`Bottom edge at: ${layout.bottom}`);
  console.log(`Is visible: ${layout.isVisible}`);
  if (layout.isVisible) {
    console.log(`Visible at viewport row ${layout.visibleTop}`);
    console.log(`Visible height: ${layout.visibleHeight}/${layout.height}`);
  }
}
```

---

### getMaxScrollOffset()

> **getMaxScrollOffset**: () => `number`

Gets the maximum possible scroll offset.

#### Returns

`number`

The maximum scroll offset in terminal rows.

#### Remarks

This is calculated as `contentHeight - viewportHeight`. When the scroll
offset equals this value, the content is scrolled to the very bottom.
Returns 0 if the content fits within the viewport.

---

### getScrollOffset()

> **getScrollOffset**: () => `number`

Gets the current scroll offset (distance scrolled from the top).

#### Returns

`number`

The current scroll offset in terminal rows.

#### Remarks

The scroll offset represents how many terminal rows the content has been
scrolled up from its initial position. A value of 0 means the content is
at the very top (no scrolling has occurred).

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

---

### getViewportHeight()

> **getViewportHeight**: () => `number`

Gets the current height of the visible viewport.

#### Returns

`number`

The viewport height in terminal rows.

#### Remarks

The viewport is the visible area where content is displayed.
This value depends on the container's height and terminal size.

---

### remeasure()

> **remeasure**: () => `void`

Forces a complete re-layout of the ScrollView.

#### Returns

`void`

#### Remarks

Triggers re-measurement of all children and viewport dimensions.
Use this when the terminal is resized or when multiple items change.

#### Example

```tsx
// Handle terminal resize
useEffect(() => {
  const handleResize = () => scrollViewRef.current?.remeasure();
  stdout?.on("resize", handleResize);
  return () => {
    stdout?.off("resize", handleResize);
  };
}, [stdout]);
```

---

### remeasureItem()

> **remeasureItem**: (`index`) => `void`

Triggers re-measurement of a specific child item.

#### Parameters

##### index

`number`

The index of the child to re-measure.

#### Returns

`void`

#### Remarks

More efficient than `remeasure()` when only a single item's content
has changed (e.g., expanded/collapsed). The `itemOffsets` and
`contentHeight` will be automatically recalculated.

#### Example

```tsx
const handleToggleExpand = (index: number) => {
  setExpandedItems((prev) => {
    const next = new Set(prev);
    next.has(index) ? next.delete(index) : next.add(index);
    return next;
  });
  // Re-measure only the affected item
  setTimeout(() => scrollViewRef.current?.remeasureItem(index), 0);
};
```

---

### scrollBy()

> **scrollBy**: (`delta`) => `void`

Scrolls by a relative amount.

#### Parameters

##### delta

`number`

Positive for down, negative for up.

#### Returns

`void`

---

### scrollTo()

> **scrollTo**: (`y`) => `void`

Scrolls to a specific vertical position.

#### Parameters

##### y

`number`

The target Y coordinate.

#### Returns

`void`

---

### scrollToBottom()

> **scrollToBottom**: () => `void`

Scrolls to the very bottom (maxScroll).

#### Returns

`void`

---

### scrollToTop()

> **scrollToTop**: () => `void`

Scrolls to the very top (position 0).

#### Returns

`void`
