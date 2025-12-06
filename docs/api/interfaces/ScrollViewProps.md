[**ink-scroll-view**](../README.md)

---

# Interface: ScrollViewProps

Props for the ScrollView component.

## Remarks

Extends standard BoxProps from Ink.

## Extends

- `Props`

## Properties

### alignItems?

> `readonly` `optional` **alignItems**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"stretch"`

The align-items property defines the default behavior for how items are laid out along the cross axis (perpendicular to the main axis).
See [align-items](https://css-tricks.com/almanac/properties/a/align-items/).

#### Inherited from

`BoxProps.alignItems`

---

### alignSelf?

> `readonly` `optional` **alignSelf**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"auto"`

It makes possible to override the align-items value for specific flex items.
See [align-self](https://css-tricks.com/almanac/properties/a/align-self/).

#### Inherited from

`BoxProps.alignSelf`

---

### aria-hidden?

> `readonly` `optional` **aria-hidden**: `boolean`

Hide the element from screen readers.

#### Inherited from

`BoxProps.aria-hidden`

---

### aria-label?

> `readonly` `optional` **aria-label**: `string`

A label for the element for screen readers.

#### Inherited from

`BoxProps.aria-label`

---

### aria-role?

> `readonly` `optional` **aria-role**: `"button"` \| `"checkbox"` \| `"combobox"` \| `"list"` \| `"listbox"` \| `"listitem"` \| `"menu"` \| `"menuitem"` \| `"option"` \| `"progressbar"` \| `"radio"` \| `"radiogroup"` \| `"tab"` \| `"tablist"` \| `"table"` \| `"textbox"` \| `"timer"` \| `"toolbar"`

The role of the element.

#### Inherited from

`BoxProps.aria-role`

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

`BoxProps.aria-state`

---

### backgroundColor?

> `readonly` `optional` **backgroundColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Background color for the element.

Accepts the same values as `color` in the `<Text>` component.

#### Inherited from

`BoxProps.backgroundColor`

---

### borderBottom?

> `readonly` `optional` **borderBottom**: `boolean`

Determines whether bottom border is visible.

#### Default

```ts
true;
```

#### Inherited from

`BoxProps.borderBottom`

---

### borderBottomColor?

> `readonly` `optional` **borderBottomColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change bottom border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`BoxProps.borderBottomColor`

---

### borderBottomDimColor?

> `readonly` `optional` **borderBottomDimColor**: `boolean`

Dim the bottom border color.

#### Default

```ts
false;
```

#### Inherited from

`BoxProps.borderBottomDimColor`

---

### borderColor?

> `readonly` `optional` **borderColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change border color. A shorthand for setting `borderTopColor`, `borderRightColor`, `borderBottomColor`, and `borderLeftColor`.

#### Inherited from

`BoxProps.borderColor`

---

### borderDimColor?

> `readonly` `optional` **borderDimColor**: `boolean`

Dim the border color. A shorthand for setting `borderTopDimColor`, `borderBottomDimColor`, `borderLeftDimColor`, and `borderRightDimColor`.

#### Default

```ts
false;
```

#### Inherited from

`BoxProps.borderDimColor`

---

### borderLeft?

> `readonly` `optional` **borderLeft**: `boolean`

Determines whether left border is visible.

#### Default

```ts
true;
```

#### Inherited from

`BoxProps.borderLeft`

---

### borderLeftColor?

> `readonly` `optional` **borderLeftColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change left border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`BoxProps.borderLeftColor`

---

### borderLeftDimColor?

> `readonly` `optional` **borderLeftDimColor**: `boolean`

Dim the left border color.

#### Default

```ts
false;
```

#### Inherited from

`BoxProps.borderLeftDimColor`

---

### borderRight?

> `readonly` `optional` **borderRight**: `boolean`

Determines whether right border is visible.

#### Default

```ts
true;
```

#### Inherited from

`BoxProps.borderRight`

---

### borderRightColor?

> `readonly` `optional` **borderRightColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change right border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`BoxProps.borderRightColor`

---

### borderRightDimColor?

> `readonly` `optional` **borderRightDimColor**: `boolean`

Dim the right border color.

#### Default

```ts
false;
```

#### Inherited from

`BoxProps.borderRightDimColor`

---

### borderStyle?

> `readonly` `optional` **borderStyle**: keyof Boxes \| `BoxStyle`

Add a border with a specified style. If `borderStyle` is `undefined` (the default), no border will be added.

#### Inherited from

`BoxProps.borderStyle`

---

### borderTop?

> `readonly` `optional` **borderTop**: `boolean`

Determines whether top border is visible.

#### Default

```ts
true;
```

#### Inherited from

`BoxProps.borderTop`

---

### borderTopColor?

> `readonly` `optional` **borderTopColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change top border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`BoxProps.borderTopColor`

---

### borderTopDimColor?

> `readonly` `optional` **borderTopDimColor**: `boolean`

Dim the top border color.

#### Default

```ts
false;
```

#### Inherited from

`BoxProps.borderTopDimColor`

---

### children

> **children**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

The content to be scrolled.

#### Remarks

Accepts an array of React elements. Each element should have a unique `key`
prop, which will be preserved during rendering for proper reconciliation.

---

### columnGap?

> `readonly` `optional` **columnGap**: `number`

Size of the gap between an element's columns.

#### Inherited from

`BoxProps.columnGap`

---

### display?

> `readonly` `optional` **display**: `"flex"` \| `"none"`

Set this property to `none` to hide the element.

#### Inherited from

`BoxProps.display`

---

### flexBasis?

> `readonly` `optional` **flexBasis**: `string` \| `number`

It specifies the initial size of the flex item, before any available space is distributed according to the flex factors.
See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).

#### Inherited from

`BoxProps.flexBasis`

---

### flexDirection?

> `readonly` `optional` **flexDirection**: `"row"` \| `"column"` \| `"row-reverse"` \| `"column-reverse"`

It establishes the main-axis, thus defining the direction flex items are placed in the flex container.
See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).

#### Inherited from

`BoxProps.flexDirection`

---

### flexGrow?

> `readonly` `optional` **flexGrow**: `number`

This property defines the ability for a flex item to grow if necessary.
See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).

#### Inherited from

`BoxProps.flexGrow`

---

### flexShrink?

> `readonly` `optional` **flexShrink**: `number`

It specifies the “flex shrink factor”, which determines how much the flex item will shrink relative to the rest of the flex items in the flex container when there isn’t enough space on the row.
See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).

#### Inherited from

`BoxProps.flexShrink`

---

### flexWrap?

> `readonly` `optional` **flexWrap**: `"nowrap"` \| `"wrap"` \| `"wrap-reverse"`

It defines whether the flex items are forced in a single line or can be flowed into multiple lines. If set to multiple lines, it also defines the cross-axis which determines the direction new lines are stacked in.
See [flex-wrap](https://css-tricks.com/almanac/properties/f/flex-wrap/).

#### Inherited from

`BoxProps.flexWrap`

---

### gap?

> `readonly` `optional` **gap**: `number`

Size of the gap between an element's columns and rows. A shorthand for `columnGap` and `rowGap`.

#### Inherited from

`BoxProps.gap`

---

### height?

> `readonly` `optional` **height**: `string` \| `number`

Height of the element in lines (rows). You can also set it as a percentage, which will calculate the height based on the height of the parent element.

#### Inherited from

`BoxProps.height`

---

### justifyContent?

> `readonly` `optional` **justifyContent**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"space-between"` \| `"space-around"` \| `"space-evenly"`

It defines the alignment along the main axis.
See [justify-content](https://css-tricks.com/almanac/properties/j/justify-content/).

#### Inherited from

`BoxProps.justifyContent`

---

### margin?

> `readonly` `optional` **margin**: `number`

Margin on all sides. Equivalent to setting `marginTop`, `marginBottom`, `marginLeft`, and `marginRight`.

#### Inherited from

`BoxProps.margin`

---

### marginBottom?

> `readonly` `optional` **marginBottom**: `number`

Bottom margin.

#### Inherited from

`BoxProps.marginBottom`

---

### marginLeft?

> `readonly` `optional` **marginLeft**: `number`

Left margin.

#### Inherited from

`BoxProps.marginLeft`

---

### marginRight?

> `readonly` `optional` **marginRight**: `number`

Right margin.

#### Inherited from

`BoxProps.marginRight`

---

### marginTop?

> `readonly` `optional` **marginTop**: `number`

Top margin.

#### Inherited from

`BoxProps.marginTop`

---

### marginX?

> `readonly` `optional` **marginX**: `number`

Horizontal margin. Equivalent to setting `marginLeft` and `marginRight`.

#### Inherited from

`BoxProps.marginX`

---

### marginY?

> `readonly` `optional` **marginY**: `number`

Vertical margin. Equivalent to setting `marginTop` and `marginBottom`.

#### Inherited from

`BoxProps.marginY`

---

### minHeight?

> `readonly` `optional` **minHeight**: `string` \| `number`

Sets a minimum height of the element.

#### Inherited from

`BoxProps.minHeight`

---

### minWidth?

> `readonly` `optional` **minWidth**: `string` \| `number`

Sets a minimum width of the element.

#### Inherited from

`BoxProps.minWidth`

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

---

### overflow?

> `readonly` `optional` **overflow**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in both directions.

#### Default

```ts
"visible";
```

#### Inherited from

`BoxProps.overflow`

---

### overflowX?

> `readonly` `optional` **overflowX**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in the horizontal direction.

#### Default

```ts
"visible";
```

#### Inherited from

`BoxProps.overflowX`

---

### overflowY?

> `readonly` `optional` **overflowY**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in the vertical direction.

#### Default

```ts
"visible";
```

#### Inherited from

`BoxProps.overflowY`

---

### padding?

> `readonly` `optional` **padding**: `number`

Padding on all sides. Equivalent to setting `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`.

#### Inherited from

`BoxProps.padding`

---

### paddingBottom?

> `readonly` `optional` **paddingBottom**: `number`

Bottom padding.

#### Inherited from

`BoxProps.paddingBottom`

---

### paddingLeft?

> `readonly` `optional` **paddingLeft**: `number`

Left padding.

#### Inherited from

`BoxProps.paddingLeft`

---

### paddingRight?

> `readonly` `optional` **paddingRight**: `number`

Right padding.

#### Inherited from

`BoxProps.paddingRight`

---

### paddingTop?

> `readonly` `optional` **paddingTop**: `number`

Top padding.

#### Inherited from

`BoxProps.paddingTop`

---

### paddingX?

> `readonly` `optional` **paddingX**: `number`

Horizontal padding. Equivalent to setting `paddingLeft` and `paddingRight`.

#### Inherited from

`BoxProps.paddingX`

---

### paddingY?

> `readonly` `optional` **paddingY**: `number`

Vertical padding. Equivalent to setting `paddingTop` and `paddingBottom`.

#### Inherited from

`BoxProps.paddingY`

---

### position?

> `readonly` `optional` **position**: `"absolute"` \| `"relative"`

#### Inherited from

`BoxProps.position`

---

### rowGap?

> `readonly` `optional` **rowGap**: `number`

Size of the gap between an element's rows.

#### Inherited from

`BoxProps.rowGap`

---

### width?

> `readonly` `optional` **width**: `string` \| `number`

Width of the element in spaces. You can also set it as a percentage, which will calculate the width based on the width of the parent element.

#### Inherited from

`BoxProps.width`
