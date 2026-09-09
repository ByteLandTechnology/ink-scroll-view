import { Writable } from "node:stream";
import { stripVTControlCharacters } from "node:util";
import { createRef, memo, type ReactNode } from "react";
import { Box, Text, render } from "ink";
import { describe, expect, it, vi } from "vitest";
import { ScrollView, type ScrollViewRef } from "../src/ScrollView.js";
import {
  ControlledScrollView,
  type ControlledScrollViewRef,
} from "../src/ControlledScrollView.js";

type Layout = {
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

const initial: Layout = {
  width: 20,
  height: 8,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};
const items = Array.from({ length: 10 }, (_, index) =>
  String(index).repeat(20),
);

// Capture actual Ink frames, including clipping and screen coordinates.
// Renderer debug mode emits whole frames; ScrollView debug remains disabled.
function renderLayout(node: ReactNode) {
  let frame = "";
  const stdout = Object.assign(
    new Writable({
      write(chunk, _encoding, callback) {
        frame = stripVTControlCharacters(chunk.toString());
        callback();
      },
    }),
    { columns: 80, rows: 40, isTTY: true },
  );
  return {
    ...render(node, {
      stdout: stdout as NodeJS.WriteStream,
      debug: true,
      patchConsole: false,
      exitOnCtrlC: false,
    }),
    frame: () => frame,
    lines: () => frame.split("\n"),
  };
}

describe.each(["ScrollView", "ControlledScrollView"] as const)(
  "%s automatic layout and rendered output",
  (kind) => {
    describe.each([0, 3])("at scroll offset %i", (offset) => {
      async function verifyLayouts(layouts: Layout[]) {
        const ref = createRef<ScrollViewRef>();
        const controlledRef = createRef<ControlledScrollViewRef>();
        const onSize = vi.fn();
        const renderSubtree = vi.fn();

        const StableView = memo(function StableView() {
          renderSubtree();
          const children = items.map((item, index) => (
            <Text key={index}>{item}</Text>
          ));
          return kind === "ScrollView" ? (
            <ScrollView ref={ref} flexGrow={1} onViewportSizeChange={onSize}>
              {children}
            </ScrollView>
          ) : (
            <ControlledScrollView
              ref={controlledRef}
              flexGrow={1}
              scrollOffset={offset}
              onViewportSizeChange={onSize}
            >
              {children}
            </ControlledScrollView>
          );
        });
        function Scene({ layout }: { layout: Layout }) {
          return (
            <Box
              width={layout.width}
              height={layout.height}
              flexDirection="column"
            >
              <Box height={layout.top} flexShrink={0}>
                {layout.top > 0 && (
                  <Text>{"H\n".repeat(layout.top).trimEnd()}</Text>
                )}
              </Box>
              <Box flexGrow={1}>
                <Box width={layout.left} flexShrink={0}>
                  {layout.left > 0 && <Text>{"L".repeat(layout.left)}</Text>}
                </Box>
                <StableView />
                <Box width={layout.right} flexShrink={0}>
                  {layout.right > 0 && <Text>{"R".repeat(layout.right)}</Text>}
                </Box>
              </Box>
              <Box height={layout.bottom} flexShrink={0}>
                {layout.bottom > 0 && (
                  <Text>{"F\n".repeat(layout.bottom).trimEnd()}</Text>
                )}
              </Box>
            </Box>
          );
        }
        const app = renderLayout(<Scene layout={layouts[0]!} />);
        const api = () =>
          kind === "ScrollView" ? ref.current! : controlledRef.current!;
        try {
          await vi.waitFor(() =>
            expect(api().getContentHeight()).toBeGreaterThan(0),
          );
          if (kind === "ScrollView") ref.current!.scrollTo(offset);
          let previousSize: { width: number; height: number } | undefined;
          for (const layout of layouts) {
            onSize.mockClear();
            app.rerender(<Scene layout={layout} />);
            const width = layout.width - layout.left - layout.right;
            const height = layout.height - layout.top - layout.bottom;
            const itemHeight = Math.ceil(20 / width);
            const wrapped = items.flatMap((item) =>
              Array.from({ length: itemHeight }, (_, row) =>
                item.slice(row * width, (row + 1) * width),
              ),
            );
            const expected = [
              ...Array.from({ length: layout.top }, () => "H"),
              ...Array.from({ length: height }, (_, row) => {
                const left =
                  row === 0 ? "L".repeat(layout.left) : " ".repeat(layout.left);
                const content = wrapped[offset + row] ?? "";
                const right = row === 0 ? "R".repeat(layout.right) : "";
                return (left + content.padEnd(width) + right).trimEnd();
              }),
              ...Array.from({ length: layout.bottom }, () => "F"),
            ];
            await vi.waitFor(() => {
              expect(api().getViewportHeight()).toBe(height);
              expect(api().getContentHeight()).toBe(items.length * itemHeight);
              expect(api().getBottomOffset()).toBe(
                Math.max(0, wrapped.length - height),
              );
              for (let index = 0; index < items.length; index++) {
                expect(api().getItemHeight(index)).toBe(itemHeight);
                expect(api().getItemPosition(index)).toEqual({
                  top: index * itemHeight,
                  height: itemHeight,
                });
              }
              expect(app.lines()).toEqual(expected);
            });
            if (previousSize) {
              if (
                previousSize.width === width &&
                previousSize.height === height
              ) {
                expect(onSize).not.toHaveBeenCalled();
              } else {
                expect(onSize.mock.calls).toEqual([
                  [{ width, height }, previousSize],
                ]);
              }
            }
            previousSize = { width, height };
            expect(renderSubtree).toHaveBeenCalledTimes(1);
            if (kind === "ScrollView")
              expect(ref.current!.getScrollOffset()).toBe(offset);
          }
        } finally {
          app.unmount();
          app.cleanup();
        }
      }

      it("remeasures and redraws when the parent shrinks and grows", async () => {
        await verifyLayouts([
          initial,
          { ...initial, height: 4 },
          { ...initial, width: 10, height: 4 },
          { ...initial, width: 5, height: 6 },
          initial,
        ]);
      });

      it("remeasures and redraws when siblings move and squeeze the viewport", async () => {
        await verifyLayouts([
          initial,
          { ...initial, top: 2 },
          { ...initial, top: 2, left: 10 },
          { ...initial, top: 4, left: 15 },
          initial,
        ]);
      });

      it("redraws at the new position without a size callback when only position changes", async () => {
        await verifyLayouts([
          { ...initial, bottom: 2, right: 10 },
          { ...initial, top: 2, left: 10 },
          { ...initial, top: 1, bottom: 1, left: 5, right: 5 },
          { ...initial, bottom: 2, right: 10 },
        ]);
      });
    });
  },
);

describe("layout edge cases", () => {
  it.each(["width", "height"] as const)(
    "recovers from zero parent %s without remeasure or remount",
    async (dimension) => {
      const ref = createRef<ScrollViewRef>();

      const subtreeRender = vi.fn();
      const Stable = memo(function Stable() {
        subtreeRender();
        return (
          <ScrollView ref={ref} flexGrow={1}>
            {Array.from({ length: 8 }, (_, index) => (
              <Text key={index}>Item {index}</Text>
            ))}
          </ScrollView>
        );
      });
      function Scene({ hidden }: { hidden: boolean }) {
        return (
          <Box flexDirection="column">
            <Text>BEFORE</Text>
            <Box
              width={hidden && dimension === "width" ? 0 : 10}
              height={hidden && dimension === "height" ? 0 : 4}
            >
              <Stable />
            </Box>
            <Text>AFTER</Text>
          </Box>
        );
      }
      const app = renderLayout(<Scene hidden={false} />);
      try {
        for (let cycle = 0; cycle < 3; cycle++) {
          await vi.waitFor(() => {
            expect(ref.current!.getContentHeight()).toBe(8);
            expect(ref.current!.getViewportHeight()).toBe(4);
            expect(app.frame()).toBe(
              "BEFORE\nItem 0\nItem 1\nItem 2\nItem 3\nAFTER",
            );
          });
          app.rerender(<Scene hidden />);
          await vi.waitFor(() => {
            expect(app.frame()).not.toContain("Item");
            expect(app.frame()).toContain("BEFORE");
            expect(app.frame()).toContain("AFTER");
            if (dimension === "height")
              expect(ref.current!.getViewportHeight()).toBe(0);
          });
          app.rerender(<Scene hidden={false} />);
        }
        await vi.waitFor(() => {
          expect(ref.current!.getItemPosition(7)).toEqual({
            top: 7,
            height: 1,
          });
          expect(ref.current!.getContentHeight()).toBe(8);
          expect(app.frame()).toContain("Item 3\nAFTER");
        });
        expect(subtreeRender).toHaveBeenCalledTimes(1);
      } finally {
        app.unmount();
        app.cleanup();
      }
    },
  );

  it("measures the usable area inside a bordered, padded parent", async () => {
    const ref = createRef<ScrollViewRef>();
    const onSize = vi.fn();

    const Stable = memo(function Stable() {
      return (
        <ScrollView ref={ref} flexGrow={1} onViewportSizeChange={onSize}>
          <Text>{"0123456789".repeat(4)}</Text>
          <Text>END</Text>
        </ScrollView>
      );
    });
    function Scene({ width, height }: { width: number; height: number }) {
      return (
        <Box width={width} height={height} borderStyle="single" padding={1}>
          <Stable />
        </Box>
      );
    }
    const app = renderLayout(<Scene width={24} height={10} />);
    try {
      for (const [width, height] of [
        [24, 10],
        [14, 8],
        [24, 10],
      ]) {
        app.rerender(<Scene width={width!} height={height!} />);
        await vi.waitFor(() => {
          const innerWidth = width! - 4;
          const innerHeight = height! - 4;
          expect(onSize.mock.lastCall?.[0]).toEqual({
            width: innerWidth,
            height: innerHeight,
          });
          expect(ref.current!.getViewportHeight()).toBe(innerHeight);
          expect(ref.current!.getContentHeight()).toBe(40 / innerWidth + 1);
          const rows = app.frame().split("\n");
          expect(rows).toHaveLength(height!);
          expect(rows[0]).toBe("┌" + "─".repeat(width! - 2) + "┐");
          expect(rows.at(-1)).toBe("└" + "─".repeat(width! - 2) + "┘");
          expect(rows[2]).toBe(
            "│ " + "0123456789".repeat(innerWidth / 10) + " │",
          );
          expect(
            rows
              .slice(1, -1)
              .every((row) => row.startsWith("│ ") && row.endsWith(" │")),
          ).toBe(true);
        });
      }
    } finally {
      app.unmount();
      app.cleanup();
    }
  });

  it.each([
    {
      label: "CJK wide characters",
      text: "\u4f60\u597d\u4e16\u754c\u4f60\u597d\u4e16\u754c",
      wide: "\u4f60\u597d\u4e16\u754c\u4f60\u597d\u4e16\u754c",
      narrow: "\u4f60\u597d\u4e16\u754c\n\u4f60\u597d\u4e16\u754c",
    },
    {
      label: "emoji",
      text: "😀😀😀😀😀😀😀😀",
      wide: "😀😀😀😀😀😀😀😀",
      narrow: "😀😀😀😀\n😀😀😀😀",
    },
    {
      label: "combining characters",
      text: "e\u0301".repeat(16),
      wide: "e\u0301".repeat(16),
      narrow: "e\u0301".repeat(8) + "\n" + "e\u0301".repeat(8),
    },
  ])(
    "remeasures terminal cell widths for $label",
    async ({ text, wide, narrow }) => {
      const ref = createRef<ScrollViewRef>();

      const Stable = memo(function Stable() {
        return (
          <ScrollView ref={ref} flexGrow={1}>
            <Text>{text}</Text>
            <Text>END</Text>
          </ScrollView>
        );
      });
      const scene = (width: number) => (
        <Box width={width} height={3}>
          <Stable />
        </Box>
      );
      const app = renderLayout(scene(16));
      try {
        for (const width of [16, 8, 16]) {
          app.rerender(scene(width));
          await vi.waitFor(() => {
            const itemHeight = width === 16 ? 1 : 2;
            expect(ref.current!.getItemHeight(0)).toBe(itemHeight);
            expect(ref.current!.getItemPosition(1)).toEqual({
              top: itemHeight,
              height: 1,
            });
            expect(app.frame().normalize("NFC")).toBe(
              (width === 16 ? wide + "\nEND\n" : narrow + "\nEND").normalize(
                "NFC",
              ),
            );
          });
        }
      } finally {
        app.unmount();
        app.cleanup();
      }
    },
  );
});
