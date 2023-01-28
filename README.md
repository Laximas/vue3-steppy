
<!--suppress ALL -->

<h1 align="center">Vue 3 Stepper</h1>

<h4 align="center">A simple Stepper component for Vue 3</h4>

<p align="center">
  <a href="">
    <img src=""
         alt="npm">
  </a>
</p>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Demo

You can try a live demo [here](https://laximas.github.io/vue3-stepper/)

## Key Features

* Keep track of current step
* Change step content
* Configure finalization
* Customizable
    - Colors
    - Titles
    - Icons
    - Button text

## How To Use
Install
```bash
$ npm install vue3-stepper
```
Import
```js
import Stepper from 'vue3-stepper'
```
Template
```html
<Stepper v-model:step="step">
  <template #1><!-- Step 1 Content --></template>
  <template #2><!-- Step 2 Content --></template>
  <template #3><!-- Step 3 Content --></template>
</Stepper>
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
 * @param {Image} iconSuccess - import CheckMark from '../assets/check-mark.png'
 * @param {boolean} isValid - Used to determine if the user can move to the next step.
 * @type {Array}
 */
tabs: {
  type: Array,
  default: reactive([
    {
      title: 'Step 1',
      iconSuccess: CheckMark,
      isValid: true
    },
    {
      title: 'Step 2',
      iconSuccess: CheckMark,
      isValid: true
    },
    {
      title: 'Step 3',
      iconSuccess: CheckMark,
      isValid: true
    }
  ])
},

/**
 * Method that will run after all steps are completed (done button is clicked).
 * @type {Object}
 */
finalize: {
  type: Object,
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
```

## Credits

This software uses the following open source packages:

- [Vue 3](https://vuejs.org)
- [Vite](https://vitejs.dev)
- [core-js](https://www.npmjs.com/package/core-js)
- [sass](https://www.npmjs.com/package/sass)
- [sass-loader](https://www.npmjs.com/package/sass-loader)
- [node-sass](https://www.npmjs.com/package/node-sass)
- [gh-pages](https://www.npmjs.com/package/gh-pages)

## Support

<a href="https://www.buymeacoffee.com/laximas" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## License

[MIT](https://github.com/Laximas/vue3-stepper/blob/main/LICENSE.md)

---

> GitHub [Laximas](https://github.com/Laximas) &nbsp;&middot;&nbsp;
> LinkedIn [Mike Konstantakos](https://www.linkedin.com/in/mike-konstantakos/)