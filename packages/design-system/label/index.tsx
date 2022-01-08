import { Text, Props as TextProps } from "@showtime/universal-ui.text";

export const Label = ({
  htmlFor,
  ...rest
}: TextProps & { htmlFor?: string }) => <Text {...rest} />;
