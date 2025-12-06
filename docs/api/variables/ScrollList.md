[**ink-scroll-view**](../README.md)

---

# Variable: ScrollList

> `const` **ScrollList**: `ForwardRefExoticComponent`\<[`ScrollListProps`](../interfaces/ScrollListProps.md) & `RefAttributes`\<[`ScrollListRef`](../interfaces/ScrollListRef.md)\>\>

A scrollable list with built-in selection state management.

## Remarks

This component extends [ScrollView](ScrollView.md) to provide:

- Selection state tracking
- Automatic scroll-into-view when selection changes
- Navigation methods (`selectNext`, `selectPrevious`, etc.)

**IMPORTANT**:

- This component does NOT handle user input. Use `useInput` to control selection.
- This component does NOT automatically respond to terminal resize events.
  Call `remeasure()` on resize.

## Example

```tsx
const listRef = useRef<ScrollListRef>(null);
const [selectedIndex, setSelectedIndex] = useState(0);

useInput((input, key) => {
  if (key.downArrow) {
    const newIndex = listRef.current?.selectNext() ?? 0;
    setSelectedIndex(newIndex);
  }
  if (key.upArrow) {
    const newIndex = listRef.current?.selectPrevious() ?? 0;
    setSelectedIndex(newIndex);
  }
});

return (
  <ScrollList
    ref={listRef}
    selectedIndex={selectedIndex}
    scrollAlignment="auto"
    height={10}
  >
    {items.map((item, i) => (
      <Box key={i} borderStyle={i === selectedIndex ? "double" : "single"}>
        <Text>{item}</Text>
      </Box>
    ))}
  </ScrollList>
);
```
