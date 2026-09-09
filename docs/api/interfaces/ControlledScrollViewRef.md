[**ink-scroll-view**](../README.md)

---

# Interface: ControlledScrollViewRef

## Properties

### getBottomOffset()

> **getBottomOffset**: () => `number`

Gets the maximum scroll offset (content height - viewport height).

#### Returns

`number`

#### Remarks

This represents the scroll offset required to view the very bottom of the content.
It is clamped to 0 if the content fits entirely within the viewport.

---

### getContentHeight()

> **getContentHeight**: () => `number`

Gets the total height of the content.

#### Returns

`number`

The sum of heights of all child items.

---

### getItemHeight()

> **getItemHeight**: (`index`) => `number`

Gets the height of a specific item by its index.

#### Parameters

##### index

`number`

The index of the child item.

#### Returns

`number`

The measured height of the item.

---

### getItemPosition()

> **getItemPosition**: (`index`) => \{ `height`: `number`; `top`: `number`; \} \| `null`

Gets the absolute position and dimensions of a specific item.

#### Parameters

##### index

`number`

The index of the child item.

#### Returns

\{ `height`: `number`; `top`: `number`; \} \| `null`

Object containing `top` (offset from content start) and `height`, or `null` if the index is invalid.

#### Remarks

This method uses a cached offset calculation system (`itemOffsetsRef`) for performance.
It calculates offsets lazily and caches them until the underlying measurements change.

---

### getViewportHeight()

> **getViewportHeight**: () => `number`

Gets the current height of the visible viewport.

#### Returns

`number`

The height of the viewport container.

---

### remeasure()

> **remeasure**: () => `void`

Re-measures the ScrollView viewport dimensions.

#### Returns

`void`

#### Remarks

Layout changes — terminal resizes, parent or sibling resizes — are tracked
automatically, so this is rarely needed. Reach for it when the viewport
size changes without any Ink layout commit, such as after writing to the
terminal outside of Ink.

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

Forces the `MeasurableItem` wrapper for the specified index to re-run `measureElement`.
Use this when a child's content changes internally (e.g., expanding text) without changing props.
