import { useEffect, useRef } from "react";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { DateTimePickerProps } from "./types";

export const DateTimePicker = (props: DateTimePickerProps) => {
  const opened = useRef(false);
  const propValues = useLatestValueRef(props);

  useEffect(() => {
    if (!opened.current && props.open && !props.disabled) {
      const { value, onChange, type, maximumDate, minimumDate } =
        propValues.current;
      opened.current = true;

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
    } else {
      if (opened.current) {
        DateTimePickerAndroid.dismiss("date");
        DateTimePickerAndroid.dismiss("time");
        opened.current = false;
      }
    }
  }, [propValues, props.open, props.disabled]);

  useEffect(() => {
    return () => {
      opened.current = false;
      DateTimePickerAndroid.dismiss("date");
      DateTimePickerAndroid.dismiss("time");
    };
  }, []);

  return null;
};

export const useLatestValueRef = <V extends any>(v: V) => {
  const ref = useRef(v);
  useEffect(() => {
    ref.current = v;
  });

  return ref;
};
