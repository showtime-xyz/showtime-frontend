import type { FilePickerResolveValue } from "app/lib/file-picker";

export type DropFileZoneProps = {
  children: JSX.Element;
  onChange: (e: FilePickerResolveValue) => void;
  disabled?: boolean;
};
export const DropFileZone = ({ children }: DropFileZoneProps) => {
  return children;
};
