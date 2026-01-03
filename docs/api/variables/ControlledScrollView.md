[**ink-scroll-view**](../README.md)

---

# Variable: ControlledScrollView

> `const` **ControlledScrollView**: `ForwardRefExoticComponent`\<[`ControlledScrollViewProps`](../interfaces/ControlledScrollViewProps.md) & `RefAttributes`\<[`ControlledScrollViewRef`](../interfaces/ControlledScrollViewRef.md)\>\>

A ControlledScrollView component for Ink applications.

## Remarks

This is a lower-level component that handles the complex logic of:

1. Rendering children within a virtual viewport.
2. Continuously measuring child heights.
3. Calculating total content height.
4. Managing viewport wrapping adjustments (`marginTop`).

It is "controlled" because it does not maintain its own scroll state; it purely renders
based on the provided `scrollOffset` prop. This allows for flexible parent-controlled behavior.
