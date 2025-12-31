/**
 * @file mdx-components.tsx
 * @description MDX components configuration for Nextra
 *
 * This file is required by Nextra to define how MDX content is rendered.
 * It exports a function that returns the component mappings for MDX elements.
 *
 * The components from nextra-theme-docs provide styled versions of:
 * - Headings (h1, h2, h3, etc.)
 * - Code blocks with syntax highlighting
 * - Tables, lists, and other Markdown elements
 */

import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";

/**
 * Get the default theme components from Nextra
 */
const themeComponents = getThemeComponents();

/**
 * Export the MDX components function
 *
 * This function is called by Next.js/Nextra to get the component mappings.
 * It merges the theme's default components with any custom overrides.
 *
 * @param components - Custom component overrides passed from pages
 * @returns Merged component mappings
 */
export function useMDXComponents(components: Record<string, unknown>) {
  return {
    ...themeComponents,
    ...components,
  };
}
