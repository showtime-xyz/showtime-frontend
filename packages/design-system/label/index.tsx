import { Text, Props as TextProps } from "design-system/text";

export const Label = ({
  htmlFor,
  ...rest
}: TextProps & { htmlFor?: string }) => <Text {...{ htmlFor, ...rest }} />;
