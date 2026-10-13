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
  finalize?: () => void;
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
