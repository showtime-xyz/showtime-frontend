import type { TW } from "design-system/tailwind";
import { Text, Props } from "design-system/text";

type ButtonLabelProps = {
  labelTW?: TW;
} & Props;

export function ButtonLabel({ tw, labelTW, ...props }: ButtonLabelProps) {
  return <Text {...props} tw={tw || labelTW} />;
}
