import type { TW } from "@showtime-xyz/universal.tailwind";

export interface SelectProps<T = string | number> {
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
