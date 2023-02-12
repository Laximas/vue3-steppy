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
* Customizable
  - Colors
  - Titles
  - Icons
  - Button text

## How To Use
Install
```bash
$ npm install vue3-steppy
```
Import
```js
import {Steppy} from 'vue3-steppy'
```
Template
```html
<Steppy v-model:step="step">
  <template #1><!-- Step 1 Content --></template>
  <template #2><!-- Step 2 Content --></template>
  <template #3><!-- Step 3 Content --></template>
</Steppy>
```
API Props
```js
/**
 * Contains the current step. Very similar to a
 * `value` attribute on an input. In most cases, you'll want
 * to set this as a two-way binding, using the `v-model` directive.
 * @type {Number}
 */
step: {
  type: Number,
  default: 1
},

/**
 * Contains the steps with custom titles and icons.
 * @type {Array}
 * 
 * @param {Image} iconSuccess - You can point to an imported icon from you assets like:
 * import CheckMark from '../assets/check-mark.png'
 * If you set it to null, a default SVG will be used with primary color 1.
 * 
 * @param {boolean} isValid - Used to determine if the user can move to the next step.
 */
tabs: {
  type: Array,
  default: reactive([
    {
      title: 'Step 1',
      iconSuccess: null,
      isValid: true
    },
    {
      title: 'Step 2',
      iconSuccess: null,
      isValid: true
    },
    {
      title: 'Step 3',
      iconSuccess: null,
      isValid: true
    }
  ])
},

/**
 * Function that will run after all steps are completed (done button is clicked).
 * @type {Function}
 */
finalize: {
  type: Function,
  default: function () {
    return {}
  }
},

/**
 * Text for back button.
 * @type {String}
 */
backText: {
  type: String,
  default: 'Back'
},

/**
 * Text for next button.
 * @type {String}
 */
nextText: {
  type: String,
  default: 'Next'
},

/**
 * Text for done button.
 * @type {String}
 */
doneText: {
  type: String,
  default: 'Done'
},

/**
 * Show loading spinner on done button
 * @type {Boolean}
 */
loading: {
  type: Boolean,
  default: false
},

/**
 * Primary Color 1
 * @type {String}
 */
,
primaryColor1: {
  type: String,
  default: 'orange'
},

/**
 * Primary Color 2
 * @type {String}
 */
,
primaryColor2: {
  type: String,
  default: '#fff'
}
```

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

## Support

<a href="https://www.buymeacoffee.com/laximas" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## License

[MIT](https://github.com/Laximas/vue3-steppy/blob/main/LICENSE.md)

---

> GitHub [Laximas](https://github.com/Laximas) &nbsp;&middot;&nbsp;
> LinkedIn [Mike Konstantakos](https://www.linkedin.com/in/mike-konstantakos/)