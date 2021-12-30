export interface SelectProps {
  value?: string,
  placeholder?: string;
  options?: SelectOption[],
  size?: 'small' | 'regular',
  disabled?: boolean,
  tw?: string,
  onChange?: (value: string) => void;
}

export interface SelectOption {
  value: string,
  label: string,
}