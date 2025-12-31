"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Text } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";
import TerminalFrame from "./TerminalFrameProps";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

// --- Types ---
type DynamicCommand =
  | { type: "addTop" }
  | { type: "addBottom" }
  | { type: "removeTop" }
  | { type: "clear" };

// --- Ink Component ---
const DynamicInkApp = ({ command }: { command: DynamicCommand | null }) => {
  const scrollRef = useRef<ScrollViewRef>(null);
  const [items, setItems] = useState<string[]>([
    "Initial Item 1",
    "Initial Item 2",
    "Initial Item 3",
  ]);

  useEffect(() => {
    if (!command) return;
    switch (command.type) {
      case "addTop":
        setItems((prev) => [
          `New Item ${Date.now().toString().slice(-4)}`,
          ...prev,
        ]);
        break;
      case "addBottom":
        setItems((prev) => [
          ...prev,
          `New Item ${Date.now().toString().slice(-4)}`,
        ]);
        break;
      case "removeTop":
        setItems((prev) => prev.slice(1));
        break;
      case "clear":
        setItems([]);
        break;
    }
  }, [command]);

  return (
    <Box flexDirection="column" height="100%" width="100%">
      <Box
        borderStyle="single"
        borderColor="magenta"
        paddingX={1}
        marginBottom={1}
      >
        <Text color="magenta" bold>
          Dynamic Content
        </Text>
        <Box marginLeft={1}>
          <Text color="gray">({items.length} items)</Text>
        </Box>
      </Box>
      <Box borderStyle="round" borderColor="gray" flexGrow={1} paddingX={1}>
        {items.length === 0 ? (
          <Box alignItems="center" justifyContent="center" height="100%">
            <Text color="gray">List is empty</Text>
          </Box>
        ) : (
          <ScrollView ref={scrollRef}>
            {items.map((item, i) => (
              <Box key={i}>
                <Text color={i % 2 === 0 ? "cyan" : "white"}>• {item}</Text>
              </Box>
            ))}
          </ScrollView>
        )}
      </Box>
    </Box>
  );
};

// --- Main Interactive Component ---
export default function DynamicListDemo() {
  const [command, setCommand] = useState<{
    cmd: DynamicCommand;
    id: number;
  } | null>(null);

  const send = (c: DynamicCommand) => setCommand({ cmd: c, id: Date.now() });

  const Controls = (
    <div className="space-y-4">
      <button
        onClick={() => send({ type: "addTop" })}
        className="w-full p-3 bg-green-600 hover:bg-green-500 rounded flex items-center justify-center text-white"
      >
        <FaPlus className="mr-2" /> Add to Top
      </button>
      <button
        onClick={() => send({ type: "addBottom" })}
        className="w-full p-3 bg-green-600 hover:bg-green-500 rounded flex items-center justify-center text-white"
      >
        <FaPlus className="mr-2" /> Add to Bottom
      </button>
      <div className="h-px bg-slate-700 my-2"></div>
      <button
        onClick={() => send({ type: "removeTop" })}
        className="w-full p-3 bg-red-600 hover:bg-red-500 rounded flex items-center justify-center text-white"
      >
        <FaMinus className="mr-2" /> Remove Top
      </button>
      <button
        onClick={() => send({ type: "clear" })}
        className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white"
      >
        <FaTrash className="mr-2" /> Clear List
      </button>
    </div>
  );

  return (
    <TerminalFrame
      title="Dynamic Content"
      description="Add or remove items on the fly. ScrollView automatically adjusts to content changes while maintaining user scroll position where possible."
      inkContent={<DynamicInkApp command={command?.cmd || null} />}
      controls={Controls}
    />
  );
}
