# Contributing to ink-scroll-view

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions.

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
- [Development Workflow](#development-workflow)
  - [Scripts](#scripts)
  - [Commit Messages](#commit-messages)

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://github.com/ByteLandTechnology/ink-scroll-view#readme).

Before you ask a question, it is best to search for existing [Issues](https://github.com/ByteLandTechnology/ink-scroll-view/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/ByteLandTechnology/ink-scroll-view/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

### Reporting Bugs

Specifying valid information will help us to improve this project.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the steps to reproduce the exact steps which reproduce the issue** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Explain why this enhancement would be useful** to most users.

### Your First Code Contribution

1. Fork the project.
2. Clone your fork locally.
3. Create a new branch for your changes.
4. Make your changes.
5. Run tests to ensure nothing is broken.
6. Commit your changes ensuring you follow the commit message convention.
7. Push your changes to your fork.
8. Open a Pull Request.

## Development Workflow

### Setup

```bash
# Install dependencies
npm install
```

### Scripts

- `npm run build`: Build the project using `tsup`.
- `npm test`: Run tests using `vitest`.
- `npm run docs`: Generate documentation using `typedoc`.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and enforces them using `commitlint` and `husky`.

Allowed types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

Example:

```
feat: add support for horizontal scrolling
```

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
