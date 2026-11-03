// Type tests: this file plays the role of a consumer of the published
// package. `pnpm test:types` must compile it without errors, which means
// every `@ts-expect-error` below has to match a real error.
import { h } from "vue";
import { Steppy, type SteppyProps, type SteppyTab } from "vue3-steppy";

// --- Accepted ---------------------------------------------------------------

// Every prop is optional, so only `tabs` is enough.
export const onlyTabs: SteppyProps = {
  tabs: [{ title: "One", isValid: true }],
};

// ...and so is an empty props object.
export const noProps: SteppyProps = {};

const richTab: SteppyTab = {
  title: "Account",
  description: "Configure your account",
  iconSuccess: null,
  isValid: false,
};

// Every documented prop, including `linear` and the v-model event.
export const everything: SteppyProps = {
  step: 2,
  tabs: [richTab, { title: "Plain", iconSuccess: "check.svg", isValid: true }],
  finalize: () => {},
  beforeNext: (step: number) => step > 0,
  keepMounted: true,
  compact: "auto",
  backText: "Back",
  nextText: "Next",
  doneText: "Done",
  loading: false,
  linear: false,
  primaryColor1: "orange",
  primaryColor2: "#fff",
  backgroundColor: "#fff",
  circleSize: 68,
  contentMarginTop: 60,
  "onUpdate:step": (step: number) => {
    const next: number = step;
    void next;
  },
};

// Async callbacks, and guards that only return `false` to block.
export const asyncCallbacks: SteppyProps = {
  finalize: async () => 42,
  beforeNext: async (step: number) => step > 0,
};
export const voidGuard: SteppyProps = { beforeNext: () => {} };
export const blockingGuard: SteppyProps = {
  beforeNext: async (step: number) => {
    if (step === 1) return false;
  },
};
export const forcedCompact: SteppyProps = { compact: true };

// The component itself accepts those props.
export const vnode = h(Steppy, {
  step: 1,
  tabs: [{ title: "One", isValid: true }],
  linear: true,
  "onUpdate:step": (step: number) => void step,
});

// --- Rejected ---------------------------------------------------------------

// A tab needs a title.
// @ts-expect-error title is missing
export const noTitle: SteppyProps = { tabs: [{ isValid: true }] };

// A tab needs isValid.
// @ts-expect-error isValid is missing
export const noIsValid: SteppyProps = { tabs: [{ title: "One" }] };

// @ts-expect-error linear must be a boolean
export const badLinear: SteppyProps = { linear: "yes" };

// @ts-expect-error step must be a number
export const badStep: SteppyProps = { step: "one" };

// @ts-expect-error title must be a string
export const badTitle: SteppyTab = { title: 1, isValid: true };

// @ts-expect-error keepMounted must be a boolean
export const badKeepMounted: SteppyProps = { keepMounted: "yes" };

// @ts-expect-error compact is a boolean or "auto"
export const badCompact: SteppyProps = { compact: "always" };

// @ts-expect-error beforeNext must be a function
export const badGuardType: SteppyProps = { beforeNext: true };

// @ts-expect-error a guard resolves to a boolean or nothing
export const badGuardResult: SteppyProps = { beforeNext: async () => "yes" };

const wantsString = (step: string) => void step;

// @ts-expect-error the v-model handler receives a number
export const badHandler: SteppyProps = { "onUpdate:step": wantsString };

// Same checks through the component, which is what a template would hit.
// @ts-expect-error linear must be a boolean
export const badVnodeLinear = h(Steppy, { linear: "yes" });

// @ts-expect-error step must be a number
export const badVnodeStep = h(Steppy, { step: "one" });
