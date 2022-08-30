import { ComponentProps, forwardRef } from "react";
import { Platform, TextInput as ReactNativeTextInput } from "react-native";

import { styled, tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type TextInputProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeTextInput
>;

const StyledTextInput = styled(ReactNativeTextInput);

const TextInput = forwardRef<typeof ReactNativeTextInput, TextInputProps>(
  ({ tw, style, ...props }, ref: any) => (
    <StyledTextInput
      {...props}
      style={Platform.OS === "web" ? style : [tailwind.style(tw), style]}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      ref={ref}
    />
  )
);

TextInput.displayName = "TextInput";

export { TextInput };
