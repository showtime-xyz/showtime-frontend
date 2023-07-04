export type StepProps = {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  file: File | string;
  title: string;
  description: string;
  trigger: any;
  control: any;
  errors: any;
  getValues: (v: string) => any;
};
