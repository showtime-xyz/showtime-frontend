import { ComponentProps, forwardRef } from "react";
import { TextInput as ReactNativeTextInput } from "react-native";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type TextInputProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeTextInput
>;

const TextInput = forwardRef<typeof ReactNativeTextInput, TextInputProps>(
  ({ tw, style, ...props }, ref: any) => (
    <ReactNativeTextInput
      {...props}
      style={[tailwind.style(tw), style]}
      ref={ref}
    />
  )
);

TextInput.displayName = "TextInput";

export { TextInput };
