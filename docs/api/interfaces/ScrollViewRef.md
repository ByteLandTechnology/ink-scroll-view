[**ink-scroll-view**](../README.md)

---

# Interface: ScrollViewRef

Ref interface for controlling the ScrollView programmatically.

## Properties

### getBottomOffset()

> **getBottomOffset**: () => `number`

Gets the scroll offset when the content is scrolled to the very bottom.

#### Returns

`number`

The bottom scroll offset in terminal rows.

#### Remarks

This is calculated as `contentHeight - viewportHeight`. When the scroll
offset equals this value, the last item of the content is visible at the
bottom of the viewport.

---

### getContentHeight()

> **getContentHeight**: () => `number`

Gets the total height of the content.

#### Returns

`number`

The total content height in terminal rows.

#### Remarks

This is the sum of the heights of all child items.

---

### getItemHeight()

> **getItemHeight**: (`index`) => `number`

Gets the height of a specific item by its index.

#### Parameters

##### index

`number`

The index of the item.

#### Returns

`number`

The height of the item in terminal rows, or 0 if not found.

---

### getItemPosition()

> **getItemPosition**: (`index`) => \{ `height`: `number`; `top`: `number`; \} \| `null`

Gets the position of a specific item.

#### Parameters

##### index

`number`

The index of the item.

#### Returns

\{ `height`: `number`; `top`: `number`; \} \| `null`

The position (top offset) and height of the item, or null if not found.

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

---

### getViewportHeight()

> **getViewportHeight**: () => `number`

Gets the current height of the visible viewport.

#### Returns

`number`

The viewport height in terminal rows.

---

### remeasure()

> **remeasure**: () => `void`

Re-measures the ScrollView viewport dimensions.

#### Returns

`void`

#### Remarks

Checks the current dimensions of the viewport and updates state if they have changed.
This is crucial for handling terminal resizes, as Ink does not automatically propagate resize events to components.

#### Example

```tsx
// Handle terminal resize manually
useEffect(() => {
  const onResize = () => ref.current?.remeasure();
  process.stdout.on("resize", onResize);
  return () => process.stdout.off("resize", onResize);
}, []);
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

Use this if a child's internal content changes size in a way that doesn't trigger a standard React render cycle update
(e.g., internal state change within the child that affects its height).

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

#### Example

```tsx
useInput((input, key) => {
  if (key.downArrow) ref.current?.scrollBy(1);
  if (key.upArrow) ref.current?.scrollBy(-1);
});
```

---

### scrollTo()

> **scrollTo**: (`offset`) => `void`

Scrolls to a specific vertical position.

#### Parameters

##### offset

`number`

The target Y offset (distance from top).

#### Returns

`void`

#### Example

```tsx
// Scroll to the very top
ref.current?.scrollTo(0);
```

---

### scrollToBottom()

> **scrollToBottom**: () => `void`

Scrolls to the very bottom.

#### Returns

`void`

#### Remarks

This calculates the target offset as `contentHeight - viewportHeight`.

---

### scrollToTop()

> **scrollToTop**: () => `void`

Scrolls to the very top (position 0).

#### Returns

`void`
