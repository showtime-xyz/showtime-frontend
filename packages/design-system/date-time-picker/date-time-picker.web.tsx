import DatePicker from "react-datepicker";

import "./date-time-picker.css";
import { DateTimePickerProps } from "./types";

const TimeInput = ({ value, onChange }: any) => {
  return (
    <input
      value={value}
      type="time"
      onChange={(e) => {
        if (e.target.value) {
          onChange(e.target.value);
        }
      }}
    />
  );
};
export const DateTimePicker = (props: DateTimePickerProps) => {
  const { value, type, onChange, maximumDate, minimumDate, disabled } = props;
  return (
    <DatePicker
      selected={value}
      disabled={disabled}
      onChange={(date: any) => onChange(date)}
      showTimeSelectOnly={type === "time"}
      maxDate={maximumDate}
      minDate={minimumDate}
      customTimeInput={<TimeInput />}
      showTimeInput
      dateFormat={
        type === "datetime"
          ? "MMMM d, yyyy h:mm aa"
          : type === "time"
          ? "h:mm aa"
          : "MMMM d, yyyy"
      }
      wrapperClassName="w-full"
    />
  );
};
