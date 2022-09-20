import { useRef, useState } from "react";

import * as RadixSelect from "@radix-ui/react-select";

import {
  useIsDarkMode,
  useWebClientRect,
  usePlatformResize,
  useWebScroll,
} from "@showtime-xyz/universal.hooks";

import { SelectButton } from "./lib/select-button";
import { SelectItem } from "./lib/select-item";
import type { SelectProps } from "./types";

const DROPDOWN_LIGHT_SHADOW =
  "0px 12px 16px rgba(0, 0, 0, 0.1), 0px 16px 48px rgba(0, 0, 0, 0.1)";
const DROPDOWN_DRAK_SHADOW =
  "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 16px 48px rgba(255, 255, 255, 0.2)";

export function Select<T extends string>({
  size = "regular",
  value,
  placeholder = "Select item",
  options,
  disabled,
  onChange,
}: SelectProps<T>) {
  const isDark = useIsDarkMode();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const [triggerRect, updateTriggerRect] = useWebClientRect(triggerRef);

  usePlatformResize(updateTriggerRect);
  useWebScroll(triggerRef, updateTriggerRect);

  if (!options) return null;

  return (
    <RadixSelect.Root
      value={value}
      open={open}
      onOpenChange={(open: boolean) => {
        updateTriggerRect();
        setOpen(open);
      }}
      onValueChange={onChange}
    >
      <RadixSelect.Trigger ref={triggerRef} disabled={disabled}>
        <SelectButton
          size={size}
          open={open}
          label={
            value !== undefined
              ? options?.filter((t) => t.value === value)?.[0]?.label ??
                placeholder
              : placeholder
          }
        />
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          style={{
            position: "absolute",
            maxHeight: "50vh",
            backgroundColor: isDark ? "#000" : "#fff",
            borderRadius: 16,
            padding: 4,
            boxShadow: isDark ? DROPDOWN_DRAK_SHADOW : DROPDOWN_LIGHT_SHADOW,
            left: triggerRect?.left ?? 0,
            top:
              (triggerRect?.top ?? 0) +
              (triggerRect?.height ? triggerRect?.height + 8 : 0),
          }}
        >
          {options.map((item) => (
            <RadixSelect.Item key={item.label} value={item.value}>
              <SelectItem
                {...item}
                onClick={() => {
                  onChange(item.value);
                }}
              />
            </RadixSelect.Item>
          ))}
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
