import { Text, Props as TextProps } from "../text";

export const Label = ({
  htmlFor,
  ...rest
}: TextProps & { htmlFor?: string }) => <Text {...rest} />;
