import type { TW } from "design-system/tailwind/types";

export interface SelectProps<T> {
  value?: T;
  placeholder?: string;
  options?: SelectOption<T>[];
  size?: "small" | "regular";
  disabled?: boolean;
  tw?: TW;
  onChange: (value: T) => void;
}

export interface SelectOption<T> {
  value: T;
  label: string;
}
