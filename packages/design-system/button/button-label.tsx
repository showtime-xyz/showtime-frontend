import { Text, Props } from "../text";
import type { TW } from "design-system/tailwind/types";

type ButtonLabelProps = {
  labelTW?: TW;
} & Props;

export function ButtonLabel({ tw, labelTW, ...props }: ButtonLabelProps) {
  return <Text {...props} tw={tw || labelTW} />;
}
