<h1 align="center">Steppy</h1>

<h4 align="center">A customizable Stepper component for Vue 3</h4>

<p align="center">
  <a href="https://badge.fury.io/js/vue3-steppy"><img src="https://badge.fury.io/js/vue3-steppy.svg" alt="npm version" height="18"></a>
</p>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#dependencies">Dependencies</a> •
  <a href="#changelog">Changelog</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Demo

You can try a live demo [here](https://laximas.github.io/vue3-steppy/)

## Key Features

* Keep track of current step
* Change step content
* Configure finalization
* Show loading spinner
* Step descriptions/subtitles
* Clickable step navigation (linear / non-linear)
* Typescript support
* Customizable
  - Colors
  - Titles
  - Descriptions
  - Icons
  - Button text
  - Circle size
  - Content spacing

## How To Use
Install
```bash
$ npm install vue3-steppy
```
Import
```js
import {Steppy} from 'vue3-steppy'
```

Use it with `v-model:step` and put the content of each step in the slot with that step's number:
```vue
<template>
  <Steppy
    v-model:step="step"
    :tabs="tabs"
    :loading="loading"
    :finalize="finish"
  >
    <template #1>Content of the first step</template>
    <template #2>Content of the second step</template>
    <template #3>Content of the third step</template>
  </Steppy>
</template>

<script setup>
import { ref } from 'vue'
import { Steppy } from 'vue3-steppy'

const step = ref(1)
const loading = ref(false)

const tabs = ref([
  { title: 'Personal Info', description: 'Enter your details', isValid: true },
  { title: 'Account Setup', description: 'Configure your account', isValid: true },
  { title: 'Verification', description: 'Verify your email', isValid: true },
])

const finish = () => {
  loading.value = true
}
</script>
```

For a complete example, see the [App.vue](./src/App.vue) file in the repository.

## Props

| Prop               | Type     | Default                 | Description                                                                                       |
|--------------------|----------|-------------------------|---------------------------------------------------------------------------------------------------|
| `step`             | Number   | `1`                     | The current step number.                                                                          |
| `tabs`             | Array    | Three placeholder steps | Array of step objects with titles, descriptions, and flags for validity and success icons.        |
| `finalize`         | Function | `() => {}`              | Function to call when the final step is completed.                                                |
| `backText`         | String   | `"Back"`                | Text displayed on the back button.                                                                |
| `nextText`         | String   | `"Next"`                | Text displayed on the next button.                                                                |
| `doneText`         | String   | `"Done"`                | Text displayed on the done button.                                                                |
| `loading`          | Boolean  | `false`                 | Indicates whether the final step is in a loading state.                                           |
| `linear`           | Boolean  | `true`                  | When true, only completed steps can be clicked to jump back. When false, any step can be clicked. |
| `primaryColor1`    | String   | `"orange"`              | Primary color for the stepper's theme.                                                            |
| `primaryColor2`    | String   | `"#fff"`                | Secondary color for the stepper's theme.                                                          |
| `backgroundColor`  | String   | `"#fff"`                | Background color for the stepper.                                                                 |
| `circleSize`       | Number   | `68`                    | Size of the circles in the step indicators.                                                       |
| `contentMarginTop` | Number   | `60`                    | Top margin of the content area in pixels. Controls spacing between descriptions and content.      |

## Events

| Event         | Payload  | Description                                                                                                         |
|---------------|----------|---------------------------------------------------------------------------------------------------------------------|
| `update:step` | `number` | Emitted with the new step number when Back, Next or a clickable step circle is used. Bind it with `v-model:step`.   |

## Slots

| Slot            | Description                                                                                                 |
|-----------------|-------------------------------------------------------------------------------------------------------------|
| `#1`, `#2`, ... | One named slot per step, matching the tab's position in `tabs`. Its content is shown while that step is active. |

## Tab Object Structure

Each tab object in the `tabs` array should have the following properties:

| Property      | Type     | Required | Description                                      |
|---------------|----------|----------|--------------------------------------------------|
| `title`       | String   | Yes      | The title of the step.                           |
| `description` | String   | No       | Optional subtitle/description text below title.  |
| `isValid`     | Boolean  | Yes      | Whether the step is valid and can proceed.       |
| `iconSuccess` | String   | No       | Optional custom icon URL for completed steps.    |

### Example Tab Object

```javascript
{
  title: 'Personal Information',
  description: 'Enter your details',
  isValid: true,
  iconSuccess: null
}
```

## Development

```bash
pnpm install
pnpm dev          # run the demo locally
pnpm test         # component tests in a real browser (Vitest browser mode + Playwright)
pnpm test:types   # type-check the public typings
```

The tests run in headless Chromium. Install it once with `pnpm exec playwright install chromium`. Use `pnpm test:watch` while working on the tests.

## Dependencies

This software uses the following open source packages:

- [Vue 3](https://vuejs.org) (3.5+, a peer dependency: install it in your app)

#### Dev Dependencies
- [Vite](https://vitejs.dev)
- [Typescript](https://www.typescriptlang.org/)
- [sass](https://www.npmjs.com/package/sass)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)
- [gh-pages](https://www.npmjs.com/package/gh-pages)
- [Vitest](https://vitest.dev) and [Playwright](https://playwright.dev)
- [CssInjectedByJs](https://www.npmjs.com/package/vite-plugin-css-injected-by-js)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the release history.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md), the [Code of Conduct](./CODE_OF_CONDUCT.md) and [ACCESSIBILITY.md](./ACCESSIBILITY.md) first.
Security issues go through [SECURITY.md](./SECURITY.md), not public issues.

## License

[MIT](https://github.com/Laximas/vue3-steppy/blob/main/LICENSE.md)

---

> GitHub [Laximas](https://github.com/Laximas) &nbsp;&middot;&nbsp;
