import DateTimePickerImpl from "@react-native-community/datetimepicker";

import { DateTimePickerProps } from "./types";

export const DateTimePicker = (props: DateTimePickerProps) => {
  const { value, type, onChange, maximumDate, minimumDate, open } = props;

  return open ? (
    <DateTimePickerImpl
      value={value}
      mode={type}
      onChange={(event, date) => (date ? onChange(date) : null)}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  ) : null;
};
