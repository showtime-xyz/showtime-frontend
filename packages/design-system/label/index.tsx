import { Text, Props as TextProps } from "@showtime-xyz/universal.text";

export const Label = ({
  htmlFor,
  ...rest
}: TextProps & { htmlFor?: string }) => <Text {...{ htmlFor, ...rest }} />;
