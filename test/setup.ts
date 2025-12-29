import { Console } from "node:console";

// Polyfill Console for Ink's patch-console dependency which expects global.console.Console
// to be a constructor, but Vitest might override the global console object.
// @ts-ignore
global.console.Console = Console;
