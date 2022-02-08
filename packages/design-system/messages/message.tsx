import { Text } from "design-system/text";

function Message({ message }) {
  return <Text tw="text-black dark:text-white">{message.text}</Text>;
}

export { Message };
