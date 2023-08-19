import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export function LoginHeader() {
  return (
    <View tw="mb-3 px-4">
      <Text tw="text-center text-sm text-gray-900 dark:text-gray-400">
        If you don’t have a wallet, we will create one for you that you fully
        own. You can always add your wallet(s) later.
      </Text>
    </View>
  );
}
