import { Text, Props as TextProps } from "design-system/text";

export const Label = (props: TextProps) => (
  <Text
    {...props}
    // @ts-ignore
    accessibilityRole="label"
  />
);
