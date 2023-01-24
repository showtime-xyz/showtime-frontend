import { useEffect, useRef } from "react";

import * as DatePickerIOS from "@showtime-xyz/date-picker";

import { DateTimePickerProps } from "./types";

export const DateTimePicker = (props: DateTimePickerProps) => {
  const opened = useRef(false);
  const propValues = useLatestValueRef(props);
  useEffect(() => {
    async function getDate() {
      if (props.open && !opened.current && !props.disabled) {
        const { value, onChange, type, maximumDate, minimumDate } =
          propValues.current;
        opened.current = true;
        try {
          const v = await DatePickerIOS.open({
            mode: type,
            value,
            maximumDate,
            minimumDate,
          });
          opened.current = true;
          onChange(v);
        } catch (e) {
          opened.current = false;
          onChange(value);
        }
      } else {
        if (opened.current) {
          await DatePickerIOS.dismiss();
          opened.current = false;
        }
      }
    }

    getDate();
  }, [propValues, props.open, props.disabled]);

  useEffect(() => {
    return () => {
      opened.current = false;
      DatePickerIOS.dismiss();
    };
  });

  return null;
};

export const useLatestValueRef = (v: any) => {
  const ref = useRef(v);
  useEffect(() => {
    ref.current = v;
  });

  return ref;
};
