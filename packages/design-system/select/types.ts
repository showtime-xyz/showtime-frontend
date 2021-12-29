export interface SelectProps {
  value?: string,
  label?: string,
  options?: SelectOption[],
  size?: 'small' | 'regular',
  disabled?: boolean,
  onChange?: (value: string) => void;
}

export interface SelectOption {
  value: string,
  label: string,
}