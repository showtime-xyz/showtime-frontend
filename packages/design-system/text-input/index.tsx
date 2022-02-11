import { ComponentProps } from "react";

import { TextInput as DripsyTextInput } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

export type TextInputProps = { tw?: TW } & ComponentProps<
  typeof DripsyTextInput
>;

function TextInput({ tw, ...props }: TextInputProps) {
  return <DripsyTextInput sx={tailwind.style(tw)} {...props} />;
}

export { TextInput };
