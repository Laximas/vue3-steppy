declare module '@/components/Vue3Steppy.vue' {
  import { DefineComponent } from 'vue';

  export interface SteppyProps {
    step: number;
    tabs: Array<{ title: string; iconSuccess?: string; isValid: boolean; }>;
    finalize: () => void;
    backText: string;
    nextText: string;
    doneText: string;
    loading: boolean;
    primaryColor1: string;
    primaryColor2: string;
    backgroundColor: string;
    circleSize: number;
  }

  const Steppy: DefineComponent<SteppyProps>;

  export default Steppy;
}
