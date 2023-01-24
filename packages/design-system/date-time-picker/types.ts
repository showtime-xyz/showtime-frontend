export type DateTimePickerProps = {
  open: boolean;
  onChange: (date: Date) => void;
  value: Date;
  disabled?: boolean;
  type?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
};
