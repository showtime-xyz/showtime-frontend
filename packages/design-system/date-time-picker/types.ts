export type DateTimePickerProps = {
  open: boolean;
  onChange: (date: Date) => void;
  value: Date;
  type?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
};
