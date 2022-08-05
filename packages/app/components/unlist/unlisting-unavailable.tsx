import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

const UnlistingUnavailable = () => {
  return (
    <View tw="mt-8">
      <Text tw="text-black dark:text-white">
        Your current address does not own this NFT!
      </Text>
      <View tw="h-2" />
    </View>
  );
};

export { UnlistingUnavailable };
