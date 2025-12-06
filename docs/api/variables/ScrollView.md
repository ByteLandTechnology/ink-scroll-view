[**ink-scroll-view**](../README.md)

---

# Variable: ScrollView

> `const` **ScrollView**: `ForwardRefExoticComponent`\<[`ScrollViewProps`](../interfaces/ScrollViewProps.md) & `RefAttributes`\<[`ScrollViewRef`](../interfaces/ScrollViewRef.md)\>\>

Defined in: src/ScrollView.tsx:314

A ScrollView component for Ink applications.

## Remarks

Allows scrolling through content that exceeds the visible area of the terminal.

**IMPORTANT**:

- This component does NOT handle user input (keyboard/mouse).
  You must control scrolling via the exposed ref methods (e.g., using `useInput`).
- This component does NOT automatically respond to terminal resize events.
  The parent component must call [forceLayout()](../interfaces/ScrollViewRef.md#forcelayout)
  when the terminal resizes or when child content changes dynamically.

## Example

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

// Handle keyboard input
useInput((input, key) => {
  if (key.upArrow) scrollViewRef.current?.scrollBy(-1);
  if (key.downArrow) scrollViewRef.current?.scrollBy(1);
});

return (
  <ScrollView ref={scrollViewRef} height={10}>
    {items.map((item, i) => (
      <Text key={i}>{item}</Text>
    ))}
  </ScrollView>
);
```
