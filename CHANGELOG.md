# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Contributing guide, code of conduct, accessibility statement, issue forms and pull request template.
- This changelog.
- Dependabot version updates.

## [1.7.0] - 2026-10-13

### Added

- `linear` prop (default `true`): completed steps can be clicked to jump back. With `linear: false`, every step except the current one is clickable.
- Step circles that can be navigated to are keyboard accessible (Enter/Space), with `role="button"` and an accessible name. The current step has `aria-current="step"`.
- Exported `SteppyTab` type.
- All `SteppyProps` are now optional.
- `types` condition in the package `exports` map.

### Changed

**Upgrade notes** (these may affect existing users):

- Completed steps are now clickable by default.
- The component no longer injects global `body` styles or the `.tx-default-2` class.
- The typings no longer provide a default export. Use `import { Steppy } from "vue3-steppy"`.
- Step titles and descriptions are positioned below the circle and wrap at 160px.

### Fixed

- The progress bar no longer divides by zero when there is a single tab.

### Security

- Dev tooling only: `esbuild` override to `^0.28.1`.

## [1.6.3] - 2026-07-15

### Security

- Dependency updates.

## [1.6.2] - 2026-05-28

### Fixed

- Demo app styling.

### Security

- Dependency updates.

## [1.6.1] - 2026-04-07

### Security

- Dependency updates.

## [1.6.0] - 2026-03-09

### Added

- `description` field on tabs, shown under the title.
- `contentMarginTop` prop (default `60`).

## [1.5.14] - 2026-03-01

Dependency updates.

### Changed

- The default `tabs` are three placeholder steps.

## [1.5.13] - 2026-02-22

Dependency updates.

## [1.5.12] - 2026-02-10

Dependency updates.

## [1.5.11] - 2026-02-02

Dependency updates.

## [1.5.10] - 2025-12-24

Dependency updates.

## [1.5.9] - 2025-10-27

Dependency updates.

## [1.5.8] - 2025-06-02

Dependency updates.

## [1.5.7] - 2025-06-02

Dependency updates.

## [1.5.6] - 2025-04-16

Dependency updates.

## [1.5.5] - 2025-02-23

Dependency updates.

## [1.5.4] - 2024-12-30

Dependency updates.

## [1.5.3] - 2024-09-24

Dependency updates.

## [1.5.2] - 2024-06-21

Dependency updates.

## [1.5.1] - 2024-04-05

Dependency updates.

## [1.5.0] - 2024-03-24

### Added

- CommonJS build wired into `exports.require`.
- Type declarations shipped in `dist`.

### Changed

- Build tooling moved from Vue CLI to Vite only.
- pnpm is now the package manager.

## [1.4.0] - 2024-03-20

### Added

- TypeScript type definitions (`SteppyProps`, `Steppy`).

## [1.3.2] - 2024-01-20

Dependency updates.

## [1.3.1] - 2024-01-15

Dependency updates (Vue 3.3.11).

## [1.3.0] - 2023-12-07

### Added

- `backgroundColor` prop (default `"#fff"`).

## [1.2.1] - 2023-09-04

### Fixed

- Package metadata.

## [1.2.0] - 2023-09-04

### Added

- `circleSize` prop (default `68`).

## [1.1.1] - 2023-09-03

### Fixed

- Buttons use `type="button"`, so they no longer submit a surrounding form.

## [1.1.0] - 2023-02-12

### Added

- `loading` prop: shows a spinner in the Done button and disables it.

## [1.0.2] - 2023-02-04

### Changed

- Styling improvements.

## [1.0.1] - 2023-01-28

Dependency cleanup.

## [1.0.0] - 2023-01-28

Initial release: stepper with `primaryColor1` / `primaryColor2` props, SVG check mark, and styles injected by JS.

[Unreleased]: https://github.com/Laximas/vue3-steppy/compare/1.7.0...HEAD
[1.7.0]: https://github.com/Laximas/vue3-steppy/compare/1.6.3...1.7.0
[1.6.3]: https://github.com/Laximas/vue3-steppy/compare/1.6.2...1.6.3
[1.6.2]: https://github.com/Laximas/vue3-steppy/compare/1.6.1...1.6.2
[1.6.1]: https://github.com/Laximas/vue3-steppy/compare/1.6.0...1.6.1
[1.6.0]: https://github.com/Laximas/vue3-steppy/compare/1.5.14...1.6.0
[1.5.14]: https://github.com/Laximas/vue3-steppy/compare/1.5.13...1.5.14
[1.5.13]: https://github.com/Laximas/vue3-steppy/compare/1.5.12...1.5.13
[1.5.12]: https://github.com/Laximas/vue3-steppy/compare/1.5.11...1.5.12
[1.5.11]: https://github.com/Laximas/vue3-steppy/compare/1.5.10...1.5.11
[1.5.10]: https://github.com/Laximas/vue3-steppy/compare/1.5.9...1.5.10
[1.5.9]: https://github.com/Laximas/vue3-steppy/compare/1.5.8...1.5.9
[1.5.8]: https://github.com/Laximas/vue3-steppy/compare/1.5.7...1.5.8
[1.5.7]: https://github.com/Laximas/vue3-steppy/compare/1.5.6...1.5.7
[1.5.6]: https://github.com/Laximas/vue3-steppy/compare/1.5.5...1.5.6
[1.5.5]: https://github.com/Laximas/vue3-steppy/compare/1.5.4...1.5.5
[1.5.4]: https://github.com/Laximas/vue3-steppy/compare/1.5.3...1.5.4
[1.5.3]: https://github.com/Laximas/vue3-steppy/compare/1.5.2...1.5.3
[1.5.2]: https://github.com/Laximas/vue3-steppy/compare/1.5.1...1.5.2
[1.5.1]: https://github.com/Laximas/vue3-steppy/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/Laximas/vue3-steppy/compare/1.4.0...1.5.0
[1.4.0]: https://github.com/Laximas/vue3-steppy/compare/1.3.2...1.4.0
[1.3.2]: https://github.com/Laximas/vue3-steppy/compare/1.3.1...1.3.2
[1.3.1]: https://github.com/Laximas/vue3-steppy/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/Laximas/vue3-steppy/compare/1.2.1...1.3.0
[1.2.1]: https://github.com/Laximas/vue3-steppy/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/Laximas/vue3-steppy/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/Laximas/vue3-steppy/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/Laximas/vue3-steppy/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/Laximas/vue3-steppy/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/Laximas/vue3-steppy/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/Laximas/vue3-steppy/releases/tag/1.0.0
