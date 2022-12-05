import { DateTimePickerProps } from "./types";

export const DateTimePicker = (props: DateTimePickerProps) => {
  const { value, type, onChange, maximumDate, minimumDate } = props;
  console.log("value ", value.toISOString());

  return (
    <input
      type={
        type === "datetime"
          ? "datetime-local"
          : type === "time"
          ? "time"
          : "date"
      }
      value={
        type === "datetime"
          ? value.toISOString().substring(0, 16)
          : value.toISOString().split("T")[0]
      }
      onChange={(e) => onChange(new Date(e.target.value))}
      min={minimumDate?.toString()}
      max={maximumDate?.toString()}
    />
  );
};
