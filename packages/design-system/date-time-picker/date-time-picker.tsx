import { useState } from "react";
import { Platform } from "react-native";

import DateTimePickerImpl from "@react-native-community/datetimepicker";

import { DateTimePickerProps } from "./types";

export const DateTimePicker = (props: DateTimePickerProps) => {
  const { value, type, onChange, maximumDate, minimumDate, open } = props;

  // android doesn't support "datetime" picker, so we need to use date and time picker
  if (Platform.OS === "android" && props.type === "datetime" && open) {
    return <AndroidDateTimePicker {...props} />;
  }

  const component = (
    <DateTimePickerImpl
      value={value}
      mode={type}
      onChange={(event, date) => {
        date ? onChange(date) : null;
      }}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );

  if (Platform.OS === "android") {
    return open ? component : null;
  } else {
    return component;
  }
};

const AndroidDateTimePicker = (props: DateTimePickerProps) => {
  const { value, onChange, maximumDate, minimumDate } = props;
  const [mode, setMode] = useState<"date" | "time">("date");
  const [date, setDate] = useState(value);

  const handleChange = (event: any, selectedDate: Date | undefined) => {
    if (mode === "date" && selectedDate) {
      setDate(selectedDate);
      setMode("time");
    }

    if (mode === "time" && selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate);
    }
  };

  return (
    <DateTimePickerImpl
      value={date}
      mode={mode}
      onChange={handleChange}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
};
