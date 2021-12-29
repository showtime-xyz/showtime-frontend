import React from "react";
import { Listbox } from "@headlessui/react";
import { View } from "../view";
import { SelectButton } from "./lib/select-button";
import { SelectItem } from "./lib/select-item";
import { SelectList } from "./lib/select-list";
import type { SelectProps } from "./types";

export const Select: React.FC<SelectProps> = ({
  size = "regular",
  value,
  options,
  disabled,
  onChange,
}) => {
  if (!options) return null;

  return (
    <Listbox value={value} disabled={disabled} onChange={onChange}>
      {({ open }) => (
          <View tw={`${open ? "z-10" : "z-auto"}`}>
            <Listbox.Button
              as={SelectButton}
              size={size}
              open={open}
              label={options?.filter((t) => t.value === value)?.[0]?.label}
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
