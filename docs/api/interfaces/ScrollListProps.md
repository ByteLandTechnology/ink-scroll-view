[**ink-scroll-view**](../README.md)

---

# Interface: ScrollListProps

Props for the ScrollList component.

## Remarks

Extends [ScrollViewProps](ScrollViewProps.md) and adds selection state management
with automatic scroll-into-view behavior.

## Extends

- [`ScrollViewProps`](ScrollViewProps.md)

## Properties

### alignItems?

> `readonly` `optional` **alignItems**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"stretch"`

The align-items property defines the default behavior for how items are laid out along the cross axis (perpendicular to the main axis).
See [align-items](https://css-tricks.com/almanac/properties/a/align-items/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`alignItems`](ScrollViewProps.md#alignitems)

---

### alignSelf?

> `readonly` `optional` **alignSelf**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"auto"`

It makes possible to override the align-items value for specific flex items.
See [align-self](https://css-tricks.com/almanac/properties/a/align-self/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`alignSelf`](ScrollViewProps.md#alignself)

---

### aria-hidden?

> `readonly` `optional` **aria-hidden**: `boolean`

Hide the element from screen readers.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`aria-hidden`](ScrollViewProps.md#aria-hidden)

---

### aria-label?

> `readonly` `optional` **aria-label**: `string`

A label for the element for screen readers.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`aria-label`](ScrollViewProps.md#aria-label)

---

### aria-role?

> `readonly` `optional` **aria-role**: `"button"` \| `"checkbox"` \| `"combobox"` \| `"list"` \| `"listbox"` \| `"listitem"` \| `"menu"` \| `"menuitem"` \| `"option"` \| `"progressbar"` \| `"radio"` \| `"radiogroup"` \| `"tab"` \| `"tablist"` \| `"table"` \| `"textbox"` \| `"timer"` \| `"toolbar"`

The role of the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`aria-role`](ScrollViewProps.md#aria-role)

---

### aria-state?

> `readonly` `optional` **aria-state**: `object`

The state of the element.

#### busy?

> `readonly` `optional` **busy**: `boolean`

#### checked?

> `readonly` `optional` **checked**: `boolean`

#### disabled?

> `readonly` `optional` **disabled**: `boolean`

#### expanded?

> `readonly` `optional` **expanded**: `boolean`

#### multiline?

> `readonly` `optional` **multiline**: `boolean`

#### multiselectable?

> `readonly` `optional` **multiselectable**: `boolean`

#### readonly?

> `readonly` `optional` **readonly**: `boolean`

#### required?

> `readonly` `optional` **required**: `boolean`

#### selected?

> `readonly` `optional` **selected**: `boolean`

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`aria-state`](ScrollViewProps.md#aria-state)

---

### backgroundColor?

> `readonly` `optional` **backgroundColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Background color for the element.

Accepts the same values as `color` in the `<Text>` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`backgroundColor`](ScrollViewProps.md#backgroundcolor)

---

### borderBottom?

> `readonly` `optional` **borderBottom**: `boolean`

Determines whether bottom border is visible.

#### Default

```ts
true;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderBottom`](ScrollViewProps.md#borderbottom)

---

### borderBottomColor?

> `readonly` `optional` **borderBottomColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change bottom border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderBottomColor`](ScrollViewProps.md#borderbottomcolor)

---

### borderBottomDimColor?

> `readonly` `optional` **borderBottomDimColor**: `boolean`

Dim the bottom border color.

#### Default

```ts
false;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderBottomDimColor`](ScrollViewProps.md#borderbottomdimcolor)

---

### borderColor?

> `readonly` `optional` **borderColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change border color. A shorthand for setting `borderTopColor`, `borderRightColor`, `borderBottomColor`, and `borderLeftColor`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderColor`](ScrollViewProps.md#bordercolor)

---

### borderDimColor?

> `readonly` `optional` **borderDimColor**: `boolean`

Dim the border color. A shorthand for setting `borderTopDimColor`, `borderBottomDimColor`, `borderLeftDimColor`, and `borderRightDimColor`.

#### Default

```ts
false;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderDimColor`](ScrollViewProps.md#borderdimcolor)

---

### borderLeft?

> `readonly` `optional` **borderLeft**: `boolean`

Determines whether left border is visible.

#### Default

```ts
true;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderLeft`](ScrollViewProps.md#borderleft)

---

### borderLeftColor?

> `readonly` `optional` **borderLeftColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change left border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderLeftColor`](ScrollViewProps.md#borderleftcolor)

---

### borderLeftDimColor?

> `readonly` `optional` **borderLeftDimColor**: `boolean`

Dim the left border color.

#### Default

```ts
false;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderLeftDimColor`](ScrollViewProps.md#borderleftdimcolor)

---

### borderRight?

> `readonly` `optional` **borderRight**: `boolean`

Determines whether right border is visible.

#### Default

```ts
true;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderRight`](ScrollViewProps.md#borderright)

---

### borderRightColor?

> `readonly` `optional` **borderRightColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change right border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderRightColor`](ScrollViewProps.md#borderrightcolor)

---

### borderRightDimColor?

> `readonly` `optional` **borderRightDimColor**: `boolean`

Dim the right border color.

#### Default

```ts
false;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderRightDimColor`](ScrollViewProps.md#borderrightdimcolor)

---

### borderStyle?

> `readonly` `optional` **borderStyle**: keyof Boxes \| `BoxStyle`

Add a border with a specified style. If `borderStyle` is `undefined` (the default), no border will be added.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderStyle`](ScrollViewProps.md#borderstyle)

---

### borderTop?

> `readonly` `optional` **borderTop**: `boolean`

Determines whether top border is visible.

#### Default

```ts
true;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderTop`](ScrollViewProps.md#bordertop)

---

### borderTopColor?

> `readonly` `optional` **borderTopColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change top border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderTopColor`](ScrollViewProps.md#bordertopcolor)

---

### borderTopDimColor?

> `readonly` `optional` **borderTopDimColor**: `boolean`

Dim the top border color.

#### Default

```ts
false;
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderTopDimColor`](ScrollViewProps.md#bordertopdimcolor)

---

### children

> **children**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

The content to be scrolled.

#### Remarks

Accepts an array of React elements. Each element should have a unique `key`
prop, which will be preserved during rendering for proper reconciliation.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`children`](ScrollViewProps.md#children)

---

### columnGap?

> `readonly` `optional` **columnGap**: `number`

Size of the gap between an element's columns.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`columnGap`](ScrollViewProps.md#columngap)

---

### display?

> `readonly` `optional` **display**: `"flex"` \| `"none"`

Set this property to `none` to hide the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`display`](ScrollViewProps.md#display)

---

### flexBasis?

> `readonly` `optional` **flexBasis**: `string` \| `number`

It specifies the initial size of the flex item, before any available space is distributed according to the flex factors.
See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexBasis`](ScrollViewProps.md#flexbasis)

---

### flexDirection?

> `readonly` `optional` **flexDirection**: `"row"` \| `"column"` \| `"row-reverse"` \| `"column-reverse"`

It establishes the main-axis, thus defining the direction flex items are placed in the flex container.
See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexDirection`](ScrollViewProps.md#flexdirection)

---

### flexGrow?

> `readonly` `optional` **flexGrow**: `number`

This property defines the ability for a flex item to grow if necessary.
See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexGrow`](ScrollViewProps.md#flexgrow)

---

### flexShrink?

> `readonly` `optional` **flexShrink**: `number`

It specifies the “flex shrink factor”, which determines how much the flex item will shrink relative to the rest of the flex items in the flex container when there isn’t enough space on the row.
See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexShrink`](ScrollViewProps.md#flexshrink)

---

### flexWrap?

> `readonly` `optional` **flexWrap**: `"nowrap"` \| `"wrap"` \| `"wrap-reverse"`

It defines whether the flex items are forced in a single line or can be flowed into multiple lines. If set to multiple lines, it also defines the cross-axis which determines the direction new lines are stacked in.
See [flex-wrap](https://css-tricks.com/almanac/properties/f/flex-wrap/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexWrap`](ScrollViewProps.md#flexwrap)

---

### gap?

> `readonly` `optional` **gap**: `number`

Size of the gap between an element's columns and rows. A shorthand for `columnGap` and `rowGap`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`gap`](ScrollViewProps.md#gap)

---

### height?

> `readonly` `optional` **height**: `string` \| `number`

Height of the element in lines (rows). You can also set it as a percentage, which will calculate the height based on the height of the parent element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`height`](ScrollViewProps.md#height)

---

### justifyContent?

> `readonly` `optional` **justifyContent**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"space-between"` \| `"space-around"` \| `"space-evenly"`

It defines the alignment along the main axis.
See [justify-content](https://css-tricks.com/almanac/properties/j/justify-content/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`justifyContent`](ScrollViewProps.md#justifycontent)

---

### margin?

> `readonly` `optional` **margin**: `number`

Margin on all sides. Equivalent to setting `marginTop`, `marginBottom`, `marginLeft`, and `marginRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`margin`](ScrollViewProps.md#margin)

---

### marginBottom?

> `readonly` `optional` **marginBottom**: `number`

Bottom margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginBottom`](ScrollViewProps.md#marginbottom)

---

### marginLeft?

> `readonly` `optional` **marginLeft**: `number`

Left margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginLeft`](ScrollViewProps.md#marginleft)

---

### marginRight?

> `readonly` `optional` **marginRight**: `number`

Right margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginRight`](ScrollViewProps.md#marginright)

---

### marginTop?

> `readonly` `optional` **marginTop**: `number`

Top margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginTop`](ScrollViewProps.md#margintop)

---

### marginX?

> `readonly` `optional` **marginX**: `number`

Horizontal margin. Equivalent to setting `marginLeft` and `marginRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginX`](ScrollViewProps.md#marginx)

---

### marginY?

> `readonly` `optional` **marginY**: `number`

Vertical margin. Equivalent to setting `marginTop` and `marginBottom`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginY`](ScrollViewProps.md#marginy)

---

### minHeight?

> `readonly` `optional` **minHeight**: `string` \| `number`

Sets a minimum height of the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`minHeight`](ScrollViewProps.md#minheight)

---

### minWidth?

> `readonly` `optional` **minWidth**: `string` \| `number`

Sets a minimum width of the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`minWidth`](ScrollViewProps.md#minwidth)

---

### onItemLayoutChange()?

> `optional` **onItemLayoutChange**: (`index`, `layout`) => `void`

Callback fired when a child's layout (top, height, bottom) changes.

#### Parameters

##### index

`number`

The index of the item.

##### layout

The new layout of the item.

###### bottom

`number`

###### height

`number`

###### top

`number`

#### Returns

`void`

#### Remarks

This is triggered when an item's height changes. The provided layout
includes the calculated top position based on preceding items.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`onItemLayoutChange`](ScrollViewProps.md#onitemlayoutchange)

---

### onLayout()?

> `optional` **onLayout**: (`layout`) => `void`

Callback fired when the ScrollView layout (viewport) changes.

#### Parameters

##### layout

The new dimensions of the viewport.

###### height

`number`

###### width

`number`

#### Returns

`void`

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`onLayout`](ScrollViewProps.md#onlayout)

---

### onScroll()?

> `optional` **onScroll**: (`scrollOffset`) => `void`

Callback fired when the scroll position changes.

#### Parameters

##### scrollOffset

`number`

The new scroll offset (distance from top).

#### Returns

`void`

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`onScroll`](ScrollViewProps.md#onscroll)

---

### onSelectionChange()?

> `optional` **onSelectionChange**: (`index`) => `void`

Callback fired when the selected index changes internally.

#### Parameters

##### index

`number`

The new selected index.

#### Returns

`void`

#### Remarks

This is called when selection changes due to internal navigation methods
like `selectNext()` or `selectPrevious()`.

---

### overflow?

> `readonly` `optional` **overflow**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in both directions.

#### Default

```ts
"visible";
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`overflow`](ScrollViewProps.md#overflow)

---

### overflowX?

> `readonly` `optional` **overflowX**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in the horizontal direction.

#### Default

```ts
"visible";
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`overflowX`](ScrollViewProps.md#overflowx)

---

### overflowY?

> `readonly` `optional` **overflowY**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in the vertical direction.

#### Default

```ts
"visible";
```

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`overflowY`](ScrollViewProps.md#overflowy)

---

### padding?

> `readonly` `optional` **padding**: `number`

Padding on all sides. Equivalent to setting `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`padding`](ScrollViewProps.md#padding)

---

### paddingBottom?

> `readonly` `optional` **paddingBottom**: `number`

Bottom padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingBottom`](ScrollViewProps.md#paddingbottom)

---

### paddingLeft?

> `readonly` `optional` **paddingLeft**: `number`

Left padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingLeft`](ScrollViewProps.md#paddingleft)

---

### paddingRight?

> `readonly` `optional` **paddingRight**: `number`

Right padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingRight`](ScrollViewProps.md#paddingright)

---

### paddingTop?

> `readonly` `optional` **paddingTop**: `number`

Top padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingTop`](ScrollViewProps.md#paddingtop)

---

### paddingX?

> `readonly` `optional` **paddingX**: `number`

Horizontal padding. Equivalent to setting `paddingLeft` and `paddingRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingX`](ScrollViewProps.md#paddingx)

---

### paddingY?

> `readonly` `optional` **paddingY**: `number`

Vertical padding. Equivalent to setting `paddingTop` and `paddingBottom`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingY`](ScrollViewProps.md#paddingy)

---

### position?

> `readonly` `optional` **position**: `"absolute"` \| `"relative"`

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`position`](ScrollViewProps.md#position)

---

### rowGap?

> `readonly` `optional` **rowGap**: `number`

Size of the gap between an element's rows.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`rowGap`](ScrollViewProps.md#rowgap)

---

### scrollAlignment?

> `optional` **scrollAlignment**: [`ScrollAlignment`](../type-aliases/ScrollAlignment.md)

Alignment mode when scrolling to the selected item.

#### Remarks

- `'auto'`: Minimal scrolling to bring item into view (default).
- `'top'`: Align item to the top of the viewport.
- `'bottom'`: Align item to the bottom of the viewport.
- `'center'`: Align item to the center of the viewport.

#### Default Value

`'auto'`

---

### selectedIndex?

> `optional` **selectedIndex**: `number`

The currently selected item index.

#### Remarks

When this value changes, the component will automatically scroll to ensure
the selected item is visible in the viewport.

---

### width?

> `readonly` `optional` **width**: `string` \| `number`

Width of the element in spaces. You can also set it as a percentage, which will calculate the width based on the width of the parent element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`width`](ScrollViewProps.md#width)
