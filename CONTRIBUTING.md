# Contributing to vue3-steppy

Thanks for your interest in improving Steppy! Bug reports, feature ideas, docs fixes and pull requests are all welcome.

By participating in this project you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Reporting bugs and requesting features

- Search the [existing issues](https://github.com/Laximas/vue3-steppy/issues) first to avoid duplicates.
- Open a new issue using the **Bug report** or **Feature request** template and fill in as much as you can. A minimal reproduction (a StackBlitz/CodeSandbox link or a small snippet) makes bugs much faster to fix.
- **Security vulnerabilities** should not be reported in public issues. Follow the [Security Policy](./SECURITY.md) instead.
- Accessibility problems are bugs. See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for how to report them.

## Development setup

You'll need [Node.js](https://nodejs.org) 22+ and [pnpm](https://pnpm.io) 10.

```bash
git clone https://github.com/Laximas/vue3-steppy.git
cd vue3-steppy
pnpm install
pnpm exec playwright install chromium   # once, for the browser tests
pnpm dev                                # run the demo app locally
```

The component lives in [`src/components/Vue3Steppy.vue`](./src/components/Vue3Steppy.vue), its public typings in [`src/vue3-steppy.d.ts`](./src/vue3-steppy.d.ts), and the demo in [`src/App.vue`](./src/App.vue).

### Useful scripts

| Command           | What it does                                              |
|-------------------|-----------------------------------------------------------|
| `pnpm dev`        | Start the demo with hot reload                            |
| `pnpm test`       | Run the component tests in headless Chromium              |
| `pnpm test:watch` | Run the tests in watch mode                               |
| `pnpm test:types` | Type-check the public typings                             |
| `pnpm lint`       | Lint and auto-fix with ESLint + Prettier                  |
| `pnpm build`      | Build the library into `dist/`                            |

## Making a pull request

1. Fork the repository and create a branch from `main` (e.g. `fix/step-click` or `feat/vertical-layout`).
2. Make your change. Keep pull requests focused on one thing.
3. Add or update tests in [`tests/`](./tests) for any behavior change.
4. If you add or change a prop, update the typings in `src/vue3-steppy.d.ts` and the props table in the [README](./README.md).
5. Make sure everything passes locally:
   ```bash
   pnpm lint
   pnpm test
   pnpm test:types
   pnpm build
   ```
6. Open a pull request against `main` and fill in the template. CI runs the same checks.

### Guidelines

- **Accessibility:** keep the stepper usable with a keyboard and screen reader. Interactive elements need a focus style, a keyboard handler and an accessible name.
- **Backwards compatibility:** avoid breaking changes to existing props, slots and events. If one is unavoidable, call it out clearly in the PR.
- **Dependencies:** Steppy only depends on Vue. Please discuss before adding a new runtime dependency.
- **Style:** code is formatted with Prettier and linted with ESLint, so run `pnpm lint` before committing.
- **Commits:** write short, imperative commit messages (e.g. "Add vertical layout option").

## Releases

Releases are handled by the maintainer. You don't need to bump the version in `package.json` in your pull request.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE.md).
