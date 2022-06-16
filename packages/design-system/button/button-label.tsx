import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text, Props } from "@showtime-xyz/universal.text";

type ButtonLabelProps = {
  labelTW?: TW;
} & Props;

export function ButtonLabel({ tw, labelTW, ...props }: ButtonLabelProps) {
  return <Text {...props} tw={tw || labelTW} />;
}
