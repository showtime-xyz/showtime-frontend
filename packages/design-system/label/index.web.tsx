import { Text, Props as TextProps } from "@showtime-xyz/universal.text";

export const Label = (props: TextProps) => (
  <Text
    {...props}
    // @ts-ignore
    accessibilityRole="label"
  />
);
