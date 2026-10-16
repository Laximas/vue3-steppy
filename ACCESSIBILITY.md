# Accessibility

Steppy aims to be usable by everyone, including people who navigate with a keyboard, use a screen reader or rely on high contrast. Our target is [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA for the component's own markup and default styles.

## What Steppy does today

- **Native buttons:** the Back, Next and Done controls are real `<button type="button">` elements, so they are focusable and announced correctly. They are `disabled` while the current step is invalid or loading.
- **Current step:** the active step is marked with `aria-current="step"`.
- **Clickable step indicators:** when a step can be jumped to (see the `linear` prop), its circle gets `role="button"`, `tabindex="0"` and an accessible name like "Go to step 2: Shipping" (with "(completed)" added for finished steps), and can be activated with <kbd>Enter</kbd> or <kbd>Space</kbd>. Steps that can't be navigated to are not focusable.
- **Decorative check marks:** the completed-step check marks are hidden from assistive technology (`aria-hidden`), so they aren't announced on every step. Completion is conveyed by "(completed)" in the step indicator's accessible name instead.
- **Accessible loading state:** while `loading` is true, the Done button keeps its text as its accessible name (visually hidden behind the spinner), the spinner is hidden from assistive technology, and the button has `aria-busy="true"`.
- **Clear focus outline:** clickable step indicators show a 2px solid outline in the primary color on `:focus-visible`.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, transitions are turned off and the loading spinner turns more slowly.
- **Your content stays yours:** each step's content is rendered through a slot, so the forms and text inside the steps keep whatever accessibility you build into them.

## Known limitations

These are areas we know need work. Contributions are very welcome:

- The step indicators are not wrapped in a list (`<ol>`), so screen readers don't announce "step 2 of 4".
- The progress bar is purely visual and has no `role="progressbar"` or value attributes.
- Step changes aren't announced, and focus isn't moved to the new step's content.

## Your responsibilities as an integrator

- **Color contrast:** `primaryColor1`, `primaryColor2` and `backgroundColor` are fully customizable. Check that the colors you choose give text and controls enough contrast (4.5:1 for text, 3:1 for UI components).
- **Step titles:** give every tab a meaningful `title`. It is used in the accessible name of the step indicators.
- **Button text:** if you customize `backText`, `nextText` or `doneText`, keep the labels descriptive.
- **Custom icons:** if you pass an `iconSuccess` image, make sure it works as a decorative image.
- **Slot content:** label your form fields, surface validation errors to assistive technology and manage focus inside your step content.

## Reporting an accessibility issue

If something in Steppy is hard or impossible to use with assistive technology, please [open a bug report](https://github.com/Laximas/vue3-steppy/issues/new?template=bug_report.yml) and answer "Yes" to *Is this an accessibility issue?*. It helps to include:

- what you were trying to do and what happened instead
- the assistive technology, browser and OS you used (e.g. VoiceOver on Safari 18, NVDA on Firefox)
- your Steppy configuration or a minimal reproduction

Accessibility bugs are treated as bugs, not feature requests.
