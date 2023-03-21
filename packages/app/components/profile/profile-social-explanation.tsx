import { Text } from "design-system/text";
import { View } from "design-system/view";

export const ProfileScialExplanation = () => {
  return (
    <View tw="mb-6 justify-center px-4 pt-4">
      <Text tw="text-sm text-black dark:text-white">
        Connecting your Twitter or Instagram account is only required to verify
        it's you. We will not store or use your data in any other way.
      </Text>
    </View>
  );
};
