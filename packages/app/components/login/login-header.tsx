import { Text } from "design-system/text";
import { View } from "design-system/view";

export function LoginHeader() {
  return (
    <View tw="px-4">
      <Text tw="text-center text-sm font-semibold text-gray-900 dark:text-gray-400">
        Sign in to create and collect free drops from your favorite creators.
      </Text>
    </View>
  );
}
