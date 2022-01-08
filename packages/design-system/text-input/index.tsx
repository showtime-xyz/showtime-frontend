import { ComponentProps } from "react";
import { TextInput as DripsyTextInput } from "dripsy";

import { tw as tailwind } from "@showtime/universal-ui.tailwind";
import type { TW } from "@showtime/universal-ui.tailwind";

type TextInputProps = { tw?: TW } & ComponentProps<typeof DripsyTextInput>;

function TextInput({ tw, ...props }: TextInputProps) {
  return <DripsyTextInput sx={tailwind.style(tw)} {...props} />;
}

export { TextInput };
