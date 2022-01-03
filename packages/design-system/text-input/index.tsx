import { ComponentProps } from "react";
import { TextInput as DripsyTextInput } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";

type TextInputProps = { tw?: string | string[] } & ComponentProps<typeof DripsyTextInput>;

function TextInput({ tw, ...props }: TextInputProps) {
  return <DripsyTextInput sx={tailwind.style(tw)} {...props} />;
}

export { TextInput };
