[**ink-scroll-view**](../README.md)

---

# Interface: ScrollListRef

Defined in: src/ScrollList.tsx:64

Ref interface for controlling the ScrollList programmatically.

## Remarks

Extends [ScrollViewRef](ScrollViewRef.md) with selection management methods.

## Extends

- [`ScrollViewRef`](ScrollViewRef.md)

## Properties

### forceLayout()

> **forceLayout**: () => `void`

Defined in: src/ScrollView.tsx:235

Forces a complete re-layout of the ScrollView.

#### Returns

`void`

#### Remarks

**IMPORTANT**: This ScrollView does NOT automatically listen to terminal
resize events. The parent component is responsible for calling this
method when the layout needs to be recalculated.

This method should be called when:

1. The terminal window is resized - parent should listen to stdout
   resize events and call `forceLayout()`.
2. Child content has dynamically changed (e.g., text expanded/collapsed,
   images loaded, async content populated) but the `children` array
   reference itself has not changed.
3. After programmatic changes to child components that affect their
   rendered height.

What it does:

- Clears the cached item heights, forcing all children to be re-measured.
- Re-measures the viewport dimensions.
- Recalculates the maximum scroll position.
- Adjusts the current scroll position if it exceeds the new maximum.

#### Example

```tsx
const scrollViewRef = useRef<ScrollViewRef>(null);
const { stdout } = useStdout();

// Handle terminal resize
useEffect(() => {
  const handleResize = () => scrollViewRef.current?.forceLayout();
  stdout?.on("resize", handleResize);
  return () => {
    stdout?.off("resize", handleResize);
  };
}, [stdout]);

// After expanding/collapsing an item:
const handleToggleExpand = () => {
  setExpanded(!expanded);
  // Force re-layout after state update
  requestAnimationFrame(() => {
    scrollViewRef.current?.forceLayout();
  });
};
```

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`forceLayout`](ScrollViewRef.md#forcelayout)

---

### getItemCount()

> **getItemCount**: () => `number`

Defined in: src/ScrollList.tsx:134

Gets the total number of items.

#### Returns

`number`

The count of child elements.

---

### getItemLayout()

> **getItemLayout**: (`index`) => \{ `bottom`: `number`; `height`: `number`; `isVisible`: `boolean`; `top`: `number`; `visibleHeight`: `number`; `visibleTop`: `number`; \} \| `null`

Defined in: src/ScrollView.tsx:181

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

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`getItemLayout`](ScrollViewRef.md#getitemlayout)

---

### getMaxScrollOffset()

> **getMaxScrollOffset**: () => `number`

Defined in: src/ScrollView.tsx:102

Gets the maximum possible scroll offset.

#### Returns

`number`

The maximum scroll offset in terminal rows.

#### Remarks

This is calculated as `contentHeight - viewportHeight`. When the scroll
offset equals this value, the content is scrolled to the very bottom.
Returns 0 if the content fits within the viewport.

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`getMaxScrollOffset`](ScrollViewRef.md#getmaxscrolloffset)

---

### getScrollOffset()

> **getScrollOffset**: () => `number`

Defined in: src/ScrollView.tsx:90

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

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`getScrollOffset`](ScrollViewRef.md#getscrolloffset)

---

### getSelectedIndex()

> **getSelectedIndex**: () => `number`

Defined in: src/ScrollList.tsx:78

Gets the currently selected index.

#### Returns

`number`

The current selection index, or `-1` if nothing is selected.

---

### getViewportHeight()

> **getViewportHeight**: () => `number`

Defined in: src/ScrollView.tsx:113

Gets the current height of the visible viewport.

#### Returns

`number`

The viewport height in terminal rows.

#### Remarks

The viewport is the visible area where content is displayed.
This value depends on the container's height and terminal size.

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`getViewportHeight`](ScrollViewRef.md#getviewportheight)

---

### isSelectedVisible()

> **isSelectedVisible**: () => `boolean`

Defined in: src/ScrollList.tsx:127

Checks if the currently selected item is fully visible.

#### Returns

`boolean`

`true` if the selected item is completely within the viewport.

---

### scrollBy()

> **scrollBy**: (`delta`) => `void`

Defined in: src/ScrollView.tsx:53

Scrolls by a relative amount.

#### Parameters

##### delta

`number`

Positive for down, negative for up.

#### Returns

`void`

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`scrollBy`](ScrollViewRef.md#scrollby)

---

### scrollTo()

> **scrollTo**: (`y`) => `void`

Defined in: src/ScrollView.tsx:46

Scrolls to a specific vertical position.

#### Parameters

##### y

`number`

The target Y coordinate.

#### Returns

`void`

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`scrollTo`](ScrollViewRef.md#scrollto)

---

### scrollToBottom()

> **scrollToBottom**: () => `void`

Defined in: src/ScrollView.tsx:63

Scrolls to the very bottom (maxScroll).

#### Returns

`void`

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`scrollToBottom`](ScrollViewRef.md#scrolltobottom)

---

### scrollToItem()

> **scrollToItem**: (`index`, `mode?`) => `void`

Defined in: src/ScrollList.tsx:71

Scrolls to a specific child item by index.

#### Parameters

##### index

`number`

The index of the child to scroll to.

##### mode?

[`ScrollAlignment`](../type-aliases/ScrollAlignment.md)

Alignment mode. Defaults to component's `scrollAlignment` prop.

#### Returns

`void`

---

### scrollToTop()

> **scrollToTop**: () => `void`

Defined in: src/ScrollView.tsx:58

Scrolls to the very top (position 0).

#### Returns

`void`

#### Inherited from

[`ScrollViewRef`](ScrollViewRef.md).[`scrollToTop`](ScrollViewRef.md#scrolltotop)

---

### select()

> **select**: (`index`, `mode?`) => `void`

Defined in: src/ScrollList.tsx:86

Selects an item by index and scrolls to make it visible.

#### Parameters

##### index

`number`

The index to select.

##### mode?

[`ScrollAlignment`](../type-aliases/ScrollAlignment.md)

Alignment mode. Defaults to component's `scrollAlignment` prop.

#### Returns

`void`

---

### selectFirst()

> **selectFirst**: () => `number`

Defined in: src/ScrollList.tsx:113

Selects the first item and scrolls to the top.

#### Returns

`number`

The new selected index (0).

---

### selectLast()

> **selectLast**: () => `number`

Defined in: src/ScrollList.tsx:120

Selects the last item and scrolls to the bottom.

#### Returns

`number`

The new selected index.

---

### selectNext()

> **selectNext**: () => `number`

Defined in: src/ScrollList.tsx:96

Selects the next item and scrolls to make it visible.

#### Returns

`number`

The new selected index.

#### Remarks

Does nothing if already at the last item.

---

### selectPrevious()

> **selectPrevious**: () => `number`

Defined in: src/ScrollList.tsx:106

Selects the previous item and scrolls to make it visible.

#### Returns

`number`

The new selected index.

#### Remarks

Does nothing if already at the first item.
