import type { TW } from "@showtime/universal-ui.tailwind";

export interface SelectProps {
  value?: string | number;
  placeholder?: string;
  options?: SelectOption[];
  size?: "small" | "regular";
  disabled?: boolean;
  tw?: TW;
  onChange?: (value: string | number) => void;
}

export interface SelectOption {
  value: string | number;
  label: string;
}
