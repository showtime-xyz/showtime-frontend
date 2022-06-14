import { ComponentProps, forwardRef } from "react";
import { TextInput as ReactNativeTextInput } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type TextInputProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeTextInput
>;

const StyledTextInput = styled(ReactNativeTextInput);

const TextInput = forwardRef<typeof ReactNativeTextInput, TextInputProps>(
  ({ tw, ...props }, ref: any) => (
    <StyledTextInput
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      ref={ref}
    />
  )
);

TextInput.displayName = "TextInput";

export { TextInput };
