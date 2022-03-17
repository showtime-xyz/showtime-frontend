import { ComponentProps, forwardRef } from "react";

import { TextInput as DripsyTextInput } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

export type TextInputProps = { tw?: TW } & ComponentProps<
  typeof DripsyTextInput
>;

const TextInput = forwardRef<typeof DripsyTextInput, TextInputProps>(
  ({ tw, ...props }, ref) => (
    <DripsyTextInput ref={ref} sx={tailwind.style(tw)} {...props} />
  )
);

export { TextInput };
