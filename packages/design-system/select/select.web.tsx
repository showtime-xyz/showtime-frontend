import React from "react";

import { Listbox } from "@headlessui/react";

// import * as RadixSelect from "@radix-ui/react-select";
import { View } from "../view";
import { SelectButton } from "./lib/select-button";
import { SelectItem } from "./lib/select-item";
import { SelectList } from "./lib/select-list.web";
import type { SelectProps } from "./types";

export function Select<T>({
  size = "regular",
  value,
  placeholder = "Select item",
  options,
  disabled,
  tw = "",
  onChange,
}: SelectProps<T>) {
  if (!options) return null;
  // Todo: use radix-ui's Select replace this, but radix-ui's Select use fixed postion, has weird problem.
  // return (
  //   <RadixSelect.Root open>
  //     <RadixSelect.Trigger>{placeholder}</RadixSelect.Trigger>
  //     <RadixSelect.Content>
  //       <RadixSelect.ScrollUpButton />
  //       <RadixSelect.Viewport>
  //         {options.map((item) => (
  //           <RadixSelect.Item key={item.value} value={`${item.value}`}>
  //             <RadixSelect.ItemText>{item.label}</RadixSelect.ItemText>
  //           </RadixSelect.Item>
  //         ))}
  //         <RadixSelect.Separator />
  //       </RadixSelect.Viewport>
  //       <RadixSelect.ScrollDownButton />
  //     </RadixSelect.Content>
  //   </RadixSelect.Root>
  // );
  console.log(value);

  return (
    <Listbox value={value} disabled={disabled} onChange={onChange}>
      {({ open }) => (
        <View tw={`${open ? "z-10" : "z-auto"} min-w-min ${tw}`}>
          <Listbox.Button
            as={SelectButton}
            size={size}
            open={open}
            label={
              value !== undefined
                ? options?.filter((t) => t.value === value)?.[0]?.label ??
                  placeholder
                : placeholder
            }
          />
          <Listbox.Options static={true} as={SelectList} open={open}>
            {options.map((item) => (
              <Listbox.Option
                key={`Option-${item.value}`}
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
}
