[**ink-scroll-view**](../README.md)

---

# Interface: ScrollListProps

Defined in: src/ScrollList.tsx:23

Props for the ScrollList component.

## Remarks

Extends [ScrollViewProps](ScrollViewProps.md) and adds selection state management
with automatic scroll-into-view behavior.

## Extends

- [`ScrollViewProps`](ScrollViewProps.md)

## Properties

### alignItems?

> `readonly` `optional` **alignItems**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"stretch"`

Defined in: node_modules/ink/build/styles.d.ts:105

The align-items property defines the default behavior for how items are laid out along the cross axis (perpendicular to the main axis).
See [align-items](https://css-tricks.com/almanac/properties/a/align-items/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`alignItems`](ScrollViewProps.md#alignitems)

---

### alignSelf?

> `readonly` `optional` **alignSelf**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"auto"`

Defined in: node_modules/ink/build/styles.d.ts:110

It makes possible to override the align-items value for specific flex items.
See [align-self](https://css-tricks.com/almanac/properties/a/align-self/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`alignSelf`](ScrollViewProps.md#alignself)

---

### aria-hidden?

> `readonly` `optional` **aria-hidden**: `boolean`

Defined in: node_modules/ink/build/components/Box.d.ts:13

Hide the element from screen readers.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`aria-hidden`](ScrollViewProps.md#aria-hidden)

---

### aria-label?

> `readonly` `optional` **aria-label**: `string`

Defined in: node_modules/ink/build/components/Box.d.ts:9

A label for the element for screen readers.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`aria-label`](ScrollViewProps.md#aria-label)

---

### aria-role?

> `readonly` `optional` **aria-role**: `"button"` \| `"checkbox"` \| `"combobox"` \| `"list"` \| `"listbox"` \| `"listitem"` \| `"menu"` \| `"menuitem"` \| `"option"` \| `"progressbar"` \| `"radio"` \| `"radiogroup"` \| `"tab"` \| `"tablist"` \| `"table"` \| `"textbox"` \| `"timer"` \| `"toolbar"`

Defined in: node_modules/ink/build/components/Box.d.ts:17

The role of the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`aria-role`](ScrollViewProps.md#aria-role)

---

### aria-state?

> `readonly` `optional` **aria-state**: `object`

Defined in: node_modules/ink/build/components/Box.d.ts:21

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

Defined in: node_modules/ink/build/styles.d.ts:237

Background color for the element.

Accepts the same values as `color` in the `<Text>` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`backgroundColor`](ScrollViewProps.md#backgroundcolor)

---

### borderBottom?

> `readonly` `optional` **borderBottom**: `boolean`

Defined in: node_modules/ink/build/styles.d.ts:151

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

Defined in: node_modules/ink/build/styles.d.ts:175

Change bottom border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderBottomColor`](ScrollViewProps.md#borderbottomcolor)

---

### borderBottomDimColor?

> `readonly` `optional` **borderBottomDimColor**: `boolean`

Defined in: node_modules/ink/build/styles.d.ts:201

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

Defined in: node_modules/ink/build/styles.d.ts:167

Change border color. A shorthand for setting `borderTopColor`, `borderRightColor`, `borderBottomColor`, and `borderLeftColor`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderColor`](ScrollViewProps.md#bordercolor)

---

### borderDimColor?

> `readonly` `optional` **borderDimColor**: `boolean`

Defined in: node_modules/ink/build/styles.d.ts:189

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

Defined in: node_modules/ink/build/styles.d.ts:157

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

Defined in: node_modules/ink/build/styles.d.ts:179

Change left border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderLeftColor`](ScrollViewProps.md#borderleftcolor)

---

### borderLeftDimColor?

> `readonly` `optional` **borderLeftDimColor**: `boolean`

Defined in: node_modules/ink/build/styles.d.ts:207

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

Defined in: node_modules/ink/build/styles.d.ts:163

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

Defined in: node_modules/ink/build/styles.d.ts:183

Change right border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderRightColor`](ScrollViewProps.md#borderrightcolor)

---

### borderRightDimColor?

> `readonly` `optional` **borderRightDimColor**: `boolean`

Defined in: node_modules/ink/build/styles.d.ts:213

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

Defined in: node_modules/ink/build/styles.d.ts:139

Add a border with a specified style. If `borderStyle` is `undefined` (the default), no border will be added.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderStyle`](ScrollViewProps.md#borderstyle)

---

### borderTop?

> `readonly` `optional` **borderTop**: `boolean`

Defined in: node_modules/ink/build/styles.d.ts:145

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

Defined in: node_modules/ink/build/styles.d.ts:171

Change top border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`borderTopColor`](ScrollViewProps.md#bordertopcolor)

---

### borderTopDimColor?

> `readonly` `optional` **borderTopDimColor**: `boolean`

Defined in: node_modules/ink/build/styles.d.ts:195

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

Defined in: src/ScrollView.tsx:34

The content to be scrolled.

#### Remarks

Accepts an array of React elements. Each element should have a unique `key`
prop, which will be preserved during rendering for proper reconciliation.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`children`](ScrollViewProps.md#children)

---

### columnGap?

> `readonly` `optional` **columnGap**: `number`

Defined in: node_modules/ink/build/styles.d.ts:11

Size of the gap between an element's columns.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`columnGap`](ScrollViewProps.md#columngap)

---

### display?

> `readonly` `optional` **display**: `"flex"` \| `"none"`

Defined in: node_modules/ink/build/styles.d.ts:135

Set this property to `none` to hide the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`display`](ScrollViewProps.md#display)

---

### flexBasis?

> `readonly` `optional` **flexBasis**: `string` \| `number`

Defined in: node_modules/ink/build/styles.d.ts:95

It specifies the initial size of the flex item, before any available space is distributed according to the flex factors.
See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexBasis`](ScrollViewProps.md#flexbasis)

---

### flexDirection?

> `readonly` `optional` **flexDirection**: `"row"` \| `"column"` \| `"row-reverse"` \| `"column-reverse"`

Defined in: node_modules/ink/build/styles.d.ts:90

It establishes the main-axis, thus defining the direction flex items are placed in the flex container.
See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexDirection`](ScrollViewProps.md#flexdirection)

---

### flexGrow?

> `readonly` `optional` **flexGrow**: `number`

Defined in: node_modules/ink/build/styles.d.ts:80

This property defines the ability for a flex item to grow if necessary.
See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexGrow`](ScrollViewProps.md#flexgrow)

---

### flexShrink?

> `readonly` `optional` **flexShrink**: `number`

Defined in: node_modules/ink/build/styles.d.ts:85

It specifies the “flex shrink factor”, which determines how much the flex item will shrink relative to the rest of the flex items in the flex container when there isn’t enough space on the row.
See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexShrink`](ScrollViewProps.md#flexshrink)

---

### flexWrap?

> `readonly` `optional` **flexWrap**: `"nowrap"` \| `"wrap"` \| `"wrap-reverse"`

Defined in: node_modules/ink/build/styles.d.ts:100

It defines whether the flex items are forced in a single line or can be flowed into multiple lines. If set to multiple lines, it also defines the cross-axis which determines the direction new lines are stacked in.
See [flex-wrap](https://css-tricks.com/almanac/properties/f/flex-wrap/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`flexWrap`](ScrollViewProps.md#flexwrap)

---

### gap?

> `readonly` `optional` **gap**: `number`

Defined in: node_modules/ink/build/styles.d.ts:19

Size of the gap between an element's columns and rows. A shorthand for `columnGap` and `rowGap`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`gap`](ScrollViewProps.md#gap)

---

### height?

> `readonly` `optional` **height**: `string` \| `number`

Defined in: node_modules/ink/build/styles.d.ts:123

Height of the element in lines (rows). You can also set it as a percentage, which will calculate the height based on the height of the parent element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`height`](ScrollViewProps.md#height)

---

### justifyContent?

> `readonly` `optional` **justifyContent**: `"flex-start"` \| `"center"` \| `"flex-end"` \| `"space-between"` \| `"space-around"` \| `"space-evenly"`

Defined in: node_modules/ink/build/styles.d.ts:115

It defines the alignment along the main axis.
See [justify-content](https://css-tricks.com/almanac/properties/j/justify-content/).

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`justifyContent`](ScrollViewProps.md#justifycontent)

---

### margin?

> `readonly` `optional` **margin**: `number`

Defined in: node_modules/ink/build/styles.d.ts:23

Margin on all sides. Equivalent to setting `marginTop`, `marginBottom`, `marginLeft`, and `marginRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`margin`](ScrollViewProps.md#margin)

---

### marginBottom?

> `readonly` `optional` **marginBottom**: `number`

Defined in: node_modules/ink/build/styles.d.ts:39

Bottom margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginBottom`](ScrollViewProps.md#marginbottom)

---

### marginLeft?

> `readonly` `optional` **marginLeft**: `number`

Defined in: node_modules/ink/build/styles.d.ts:43

Left margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginLeft`](ScrollViewProps.md#marginleft)

---

### marginRight?

> `readonly` `optional` **marginRight**: `number`

Defined in: node_modules/ink/build/styles.d.ts:47

Right margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginRight`](ScrollViewProps.md#marginright)

---

### marginTop?

> `readonly` `optional` **marginTop**: `number`

Defined in: node_modules/ink/build/styles.d.ts:35

Top margin.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginTop`](ScrollViewProps.md#margintop)

---

### marginX?

> `readonly` `optional` **marginX**: `number`

Defined in: node_modules/ink/build/styles.d.ts:27

Horizontal margin. Equivalent to setting `marginLeft` and `marginRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginX`](ScrollViewProps.md#marginx)

---

### marginY?

> `readonly` `optional` **marginY**: `number`

Defined in: node_modules/ink/build/styles.d.ts:31

Vertical margin. Equivalent to setting `marginTop` and `marginBottom`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`marginY`](ScrollViewProps.md#marginy)

---

### minHeight?

> `readonly` `optional` **minHeight**: `string` \| `number`

Defined in: node_modules/ink/build/styles.d.ts:131

Sets a minimum height of the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`minHeight`](ScrollViewProps.md#minheight)

---

### minWidth?

> `readonly` `optional` **minWidth**: `string` \| `number`

Defined in: node_modules/ink/build/styles.d.ts:127

Sets a minimum width of the element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`minWidth`](ScrollViewProps.md#minwidth)

---

### onScroll()?

> `optional` **onScroll**: (`scrollOffset`) => `void`

Defined in: src/ScrollView.tsx:25

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

Defined in: src/ScrollList.tsx:55

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

Defined in: node_modules/ink/build/styles.d.ts:219

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

Defined in: node_modules/ink/build/styles.d.ts:225

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

Defined in: node_modules/ink/build/styles.d.ts:231

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

Defined in: node_modules/ink/build/styles.d.ts:51

Padding on all sides. Equivalent to setting `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`padding`](ScrollViewProps.md#padding)

---

### paddingBottom?

> `readonly` `optional` **paddingBottom**: `number`

Defined in: node_modules/ink/build/styles.d.ts:67

Bottom padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingBottom`](ScrollViewProps.md#paddingbottom)

---

### paddingLeft?

> `readonly` `optional` **paddingLeft**: `number`

Defined in: node_modules/ink/build/styles.d.ts:71

Left padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingLeft`](ScrollViewProps.md#paddingleft)

---

### paddingRight?

> `readonly` `optional` **paddingRight**: `number`

Defined in: node_modules/ink/build/styles.d.ts:75

Right padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingRight`](ScrollViewProps.md#paddingright)

---

### paddingTop?

> `readonly` `optional` **paddingTop**: `number`

Defined in: node_modules/ink/build/styles.d.ts:63

Top padding.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingTop`](ScrollViewProps.md#paddingtop)

---

### paddingX?

> `readonly` `optional` **paddingX**: `number`

Defined in: node_modules/ink/build/styles.d.ts:55

Horizontal padding. Equivalent to setting `paddingLeft` and `paddingRight`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingX`](ScrollViewProps.md#paddingx)

---

### paddingY?

> `readonly` `optional` **paddingY**: `number`

Defined in: node_modules/ink/build/styles.d.ts:59

Vertical padding. Equivalent to setting `paddingTop` and `paddingBottom`.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`paddingY`](ScrollViewProps.md#paddingy)

---

### position?

> `readonly` `optional` **position**: `"absolute"` \| `"relative"`

Defined in: node_modules/ink/build/styles.d.ts:7

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`position`](ScrollViewProps.md#position)

---

### rowGap?

> `readonly` `optional` **rowGap**: `number`

Defined in: node_modules/ink/build/styles.d.ts:15

Size of the gap between an element's rows.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`rowGap`](ScrollViewProps.md#rowgap)

---

### scrollAlignment?

> `optional` **scrollAlignment**: [`ScrollAlignment`](../type-aliases/ScrollAlignment.md)

Defined in: src/ScrollList.tsx:44

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

Defined in: src/ScrollList.tsx:31

The currently selected item index.

#### Remarks

When this value changes, the component will automatically scroll to ensure
the selected item is visible in the viewport.

---

### width?

> `readonly` `optional` **width**: `string` \| `number`

Defined in: node_modules/ink/build/styles.d.ts:119

Width of the element in spaces. You can also set it as a percentage, which will calculate the width based on the width of the parent element.

#### Inherited from

[`ScrollViewProps`](ScrollViewProps.md).[`width`](ScrollViewProps.md#width)
