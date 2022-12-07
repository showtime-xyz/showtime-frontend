import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import DateTimePickerImpl, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

import { DateTimePickerProps } from "./types";

export const DateTimePicker = (props: DateTimePickerProps) => {
  const { value, type, onChange, maximumDate, minimumDate, open } = props;

  // android is a dialog like picker, iOS is more like html input.
  if (Platform.OS === "android" && open) {
    return <AndroidDateTimePicker {...props} />;

    // iOS picker always remain open
  } else if (Platform.OS === "ios") {
    return (
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
  }
  return null;
};

const AndroidDateTimePicker = (props: DateTimePickerProps) => {
  const opened = useRef(false);
  const propValues = useLatestValueRef(props);

  useEffect(() => {
    if (!opened.current) {
      opened.current = true;

      const { value, onChange, type, maximumDate, minimumDate } =
        propValues.current;

      if (type === "date" || type === "time") {
        DateTimePickerAndroid.open({
          value,
          mode: type,
          maximumDate,
          minimumDate,
          onChange: (event, d) => {
            if (d) {
              onChange(d);
            }
          },
        });
      } else if (type === "datetime") {
        DateTimePickerAndroid.open({
          value,
          mode: "date",
          maximumDate,
          minimumDate,
          onChange: async (event, d) => {
            if (d) {
              if (event.type === "dismissed") {
                onChange(d);
                return;
              }

              await DateTimePickerAndroid.dismiss("date");
              DateTimePickerAndroid.open({
                value: d,
                mode: "time",
                maximumDate,
                minimumDate,
                onChange: async (event, v) => {
                  await DateTimePickerAndroid.dismiss("time");
                  if (v) onChange(v);
                },
              });
            }
          },
        });
      }
    }

    return () => {
      opened.current = false;
      DateTimePickerAndroid.dismiss("date");
      DateTimePickerAndroid.dismiss("time");
    };
  }, [propValues]);

  return null;
};

export const useLatestValueRef = (v: any) => {
  const ref = useRef(v);
  useEffect(() => {
    ref.current = v;
  });

  return ref;
};
