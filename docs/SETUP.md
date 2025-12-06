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
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
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
