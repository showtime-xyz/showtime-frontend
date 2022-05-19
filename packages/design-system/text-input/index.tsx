import { ComponentProps, forwardRef } from "react";
import { TextInput as ReactNativeTextInput } from "react-native";

import { styled } from "tailwindcss-react-native";

import type { TW } from "design-system/tailwind/types";

const StyledTextInput = styled(ReactNativeTextInput);

export type TextInputProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeTextInput
>;

const TextInput = forwardRef<typeof StyledTextInput, TextInputProps>(
  ({ tw, ...props }, ref) => (
    <StyledTextInput
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      ref={ref}
    />
  )
);

TextInput.displayName = "TextInput";

export { TextInput };
