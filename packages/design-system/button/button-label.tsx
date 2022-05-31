import type { TW } from "@showtime-xyz/universal.tailwind/types";

import { Text, Props } from "../text";

type ButtonLabelProps = {
  labelTW?: TW;
} & Props;

export function ButtonLabel({ tw, labelTW, ...props }: ButtonLabelProps) {
  return <Text {...props} tw={tw || labelTW} />;
}
