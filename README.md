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
  <a href="#license">License</a>
</p>

## Demo

You can try a live demo [here](https://laximas.github.io/vue3-steppy/)

## Key Features

* Keep track of current step
* Change step content
* Configure finalization
* Show loading spinner
* Typescript support
* Customizable
  - Colors
  - Titles
  - Icons
  - Button text
  - Circle size

## How To Use
Install
```bash
$ npm install vue3-steppy
```
Import
```js
import {Steppy} from 'vue3-steppy'
```

For an implementation example, see the [App.vue](./src/App.vue) file in the repository.

## Props

| Prop              | Type     | Default    | Description                                                                 |
|-------------------|----------|------------|-----------------------------------------------------------------------------|
| `step`            | Number   | `1`        | The current step number.                                                    |
| `tabs`            | Array    | `[]`       | Array of step objects with titles and flags for validity and success icons. |
| `finalize`        | Function | `() => {}` | Function to call when the final step is completed.                          |
| `backText`        | String   | `"Back"`   | Text displayed on the back button.                                          |
| `nextText`        | String   | `"Next"`   | Text displayed on the next button.                                          |
| `doneText`        | String   | `"Done"`   | Text displayed on the done button.                                          |
| `loading`         | Boolean  | `false`    | Indicates whether the final step is in a loading state.                     |
| `primaryColor1`   | String   | `"orange"` | Primary color for the stepper's theme.                                      |
| `primaryColor2`   | String   | `"#fff"`   | Secondary color for the stepper's theme.                                    |
| `backgroundColor` | String   | `"#fff"`   | Background color for the stepper.                                           |
| `circleSize`      | Number   | `68`       | Size of the circles in the step indicators.                                 |


## Dependencies

This software uses the following open source packages:

- [Vue 3](https://vuejs.org)

#### Dev Dependencies
- [Vite](https://vitejs.dev)
- [sass](https://www.npmjs.com/package/sass)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)
- [gh-pages](https://www.npmjs.com/package/gh-pages)
- [CssInjectedByJs](https://www.npmjs.com/package/vite-plugin-css-injected-by-js)

## License

[MIT](https://github.com/Laximas/vue3-steppy/blob/main/LICENSE.md)

---

> GitHub [Laximas](https://github.com/Laximas) &nbsp;&middot;&nbsp;
