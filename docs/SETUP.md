# Project Setup Guide

This document outlines the steps taken to set up this project, grouped by functionality.

## 1. Project Initialization

Initialize the Node.js project and generate a `.gitignore` file.

```bash
npm init
npx gitignore node
```

- [npm-init](https://docs.npmjs.com/cli/v10/commands/npm-init)
- [gitignore](https://www.npmjs.com/package/gitignore)

## 2. Git Hooks Infrastructure (Husky)

Set up Husky to manage Git hooks. This provides the foundation for running scripts automatically on git events.

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky (creates .husky directory and prepares package.json)
npx husky init
```

- [Husky](https://typicode.github.io/husky/)

## 3. Commit Message Linting (Commitlint)

Enforce conventional commit messages to ensure a clean and standardized commit history. This step configures the linter and hooks it into the `commit-msg` git event.

```bash
# Install Commitlint CLI and the conventional config
npm install -D @commitlint/cli @commitlint/config-conventional

# Create the configuration file
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.ts

# Add a commit-msg hook to run commitlint
echo "npx --no -- commitlint --edit $1" > .husky/commit-msg
```

- [Commitlint](https://commitlint.js.org/guides/local-setup.html)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## 4. Linting Staged Files (Lint-Staged)

Run linters and formatters (like Prettier) only on staged files to keep the codebase clean without re-linting the entire project. This step configures the runner and hooks it into the `pre-commit` git event.

```bash
# Install lint-staged and prettier
npm install --save-dev lint-staged prettier

# Create the configuration file (.lintstagedrc.yaml)
echo "'*.{js,ts,jsx,tsx,json,md,yaml,yml}': 'prettier --write'" > .lintstagedrc.yaml

# Add a pre-commit hook to run lint-staged
echo "npx lint-staged" > .husky/pre-commit
```

- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Prettier](https://prettier.io/)

## 5. TypeScript and Module Configuration

Configure TypeScript for a React-based Ink project, utilizing a shared configuration and defining module entry points.

```bash
# Install TypeScript, type definitions, and the shared tsconfig base
npm install -D typescript @types/node @types/react @sindresorhus/tsconfig
```

### tsconfig.json

The `tsconfig.json` file extends `@sindresorhus/tsconfig` for a robust base, with specific overrides to ensure compatibility with Ink, React (using `react-jsx` transform without source modification), and modern module resolution.

**File: `tsconfig.json`**

```json
{
  "extends": "@sindresorhus/tsconfig",
  "compilerOptions": {
    "outDir": "dist",
    "lib": ["DOM", "DOM.Iterable", "ES2023"],
    "sourceMap": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "module": "es2022",
    "moduleResolution": "bundler",
    "target": "es2022",
    "verbatimModuleSyntax": false,
    "exactOptionalPropertyTypes": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src"],
  "ts-node": {
    "transpileOnly": true,
    "files": true,
    "experimentalResolver": true,
    "experimentalSpecifierResolution": "node"
  }
}
```

- **`extends: "@sindresorhus/tsconfig"`**: Inherits a battle-tested base configuration.
- **`outDir: "dist"`**: Specifies the output directory for compiled JavaScript and type declarations.
- **`lib`, `target`, `module`, `moduleResolution`**: Configured for modern JavaScript environments and compatible with Ink (ESM-based).
- **`jsx: "react-jsx"`**: Enables the modern React JSX transform, not requiring `import React from 'react'` in every file.
- **`verbatimModuleSyntax: false`**: Allows standard `import/export` syntax for types without `import type`.
- **`exactOptionalPropertyTypes: false`**: Relaxes strictness for optional property types to avoid common React typing issues when destructuring props.
- **`include: ["src"]`**: Ensures only files within the `src` directory are compiled.

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [@sindresorhus/tsconfig GitHub](https://github.com/sindresorhus/tsconfig)

## 6. Module Entry Point Configuration

Configure `package.json` to define the main entry points and build script for the project, aligning with a TypeScript source in `src/index.tsx` and compiled output in `dist/`.

```bash
# Update package.json to specify entry points and build script
# These changes should be applied manually or via a text editor
# Ensure 'main', 'types', 'source', 'files', and 'build' script are set as follows:

# ... (inside package.json)
# "main": "dist/index.js",
# "types": "dist/index.d.ts",
# "source": "src/index.tsx",
# "files": [
#   "dist"
# ],
# "scripts": {
#   "build": "tsc",
#   # ... other scripts
# },
# ...
```

- [package.json documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

## 7. Peer Dependencies (Ink & React)

Add `ink` and `react` as `peerDependencies` in `package.json`. This signals to consumers of this library that they need to install these dependencies themselves, rather than bundling them directly into the library. `react` is also added to `devDependencies` to ensure proper type checking and local development without installation issues.

```bash
# Install Ink and React type definitions for development
npm install -D ink react @types/ink

# Add peerDependencies to package.json
# ... (inside package.json)
# "peerDependencies": {
#   "ink": "^4.0.0",
#   "react": "^18.0.0"
# },
# ...
```

- [npm peerDependencies documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies)
- [Ink GitHub Repository](https://github.com/vadimdemedes/ink)
- [React GitHub Repository](https://github.com/facebook/react)

## 8. Documentation Generation (TypeDoc)

Setup `typedoc` to generate API documentation from TypeScript source code comments.

```bash
# Install TypeDoc and the Markdown plugin
npm install -D typedoc typedoc-plugin-markdown

# Create configuration file: typedoc.json
echo '{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["./src/index.tsx"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "name": "ink-scroll-view",
  "readme": "none",
  "hideBreadcrumbs": true,
  "githubPages": false
}' > typedoc.json

# Add "docs" script to package.json
# "scripts": {
#   "docs": "typedoc"
# }
```

- [TypeDoc Documentation](https://typedoc.org/)
- [typedoc-plugin-markdown](https://github.com/tgreyuk/typedoc-plugin-markdown)
