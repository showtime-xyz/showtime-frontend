export type RootProps = {
  value?: string;
  onValueChange?: (newValue: string) => void;
  children?: any;
};

export type ItemProps = {
  disabled?: boolean;
  value: string;
  children?: any;
};

export type TriggerProps = {
  children?: React.ReactElement;
};

export type ContentProps = {
  children?: React.ReactElement;
};
