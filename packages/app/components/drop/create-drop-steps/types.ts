export type StepProps = {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  file: File | string;
  title: string;
  description: string;
};
