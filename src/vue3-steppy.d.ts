import type { DefineComponent } from "vue";

export interface SteppyTab {
  title: string;
  description?: string;
  iconSuccess?: string | null;
  isValid: boolean;
}

export interface SteppyProps {
  step?: number;
  tabs?: SteppyTab[];
  /** Called by Done. If it returns a promise, the stepper stays locked until it settles. */
  finalize?: () => unknown;
  /**
   * Called with the current step before moving forward. Return (or resolve to)
   * `false` to stay on the step. The stepper stays locked while a promise is pending.
   */
  beforeNext?: (step: number) => boolean | void | Promise<boolean | void>;
  /** Keep every step mounted and hide the inactive ones, so their state survives navigation. */
  keepMounted?: boolean;
  /** `"auto"` turns the compact layout on at 640px wide and below. */
  compact?: boolean | "auto";
  backText?: string;
  nextText?: string;
  doneText?: string;
  loading?: boolean;
  linear?: boolean;
  primaryColor1?: string;
  primaryColor2?: string;
  backgroundColor?: string;
  circleSize?: number;
  contentMarginTop?: number;
  "onUpdate:step"?: (step: number) => void;
}

export declare const Steppy: DefineComponent<SteppyProps>;
