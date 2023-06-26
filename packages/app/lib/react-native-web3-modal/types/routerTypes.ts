export type RouterProps = {
  isPortrait: boolean;
  windowHeight: number;
  windowWidth: number;
  onCopyClipboard?: (value: string) => void;
};
