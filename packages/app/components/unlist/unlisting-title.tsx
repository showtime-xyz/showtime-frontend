import { View, Text } from "design-system";

const UnlistingTitle = () => {
  return (
    <View tw="mx-4 my-8">
      <Text tw="text-black dark:text-white pb-4" variant="text-lg">
        Are you sure you want to unlist?
      </Text>
      <Text tw="text-black dark:text-white" variant="text-base">
        Unlisting an NFT will remove it from Showtime’s marketplace.
      </Text>
    </View>
  );
};

export { UnlistingTitle };
