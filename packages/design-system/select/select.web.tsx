import React from "react";
import { Listbox } from "@headlessui/react";
import { View } from "@showtime/universal-ui.view";
import { SelectButton } from "./lib/select-button";
import { SelectItem } from "./lib/select-item";
import { SelectList } from "./lib/select-list.web";
import type { SelectProps } from "./types";

export const Select: React.FC<SelectProps> = ({
  size = "regular",
  value,
  placeholder = "Select item",
  options,
  disabled,
  tw = "",
  onChange,
}) => {
  if (!options) return null;

  return (
    <Listbox value={value} disabled={disabled} onChange={onChange}>
      {({ open }) => (
        <View tw={`${open ? "z-10" : "z-auto"} min-w-min ${tw}`}>
          <Listbox.Button
            as={SelectButton}
            size={size}
            open={open}
            label={
              (value !== undefined &&
                options?.filter((t) => t.value === value)?.[0]?.label) ??
              placeholder
            }
          />
          <Listbox.Options static={true} as={SelectList} open={open}>
            {options.map((item) => (
              <Listbox.Option
                key={item.value}
                as={SelectItem}
                value={item.value}
                label={item.label}
                size={size}
              />
            ))}
          </Listbox.Options>
        </View>
      )}
    </Listbox>
  );
};
