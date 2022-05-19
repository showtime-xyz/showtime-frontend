import { View, Text } from "design-system";

const UnlistingTitle = () => {
  return (
    <View tw="mx-4 my-8">
      <Text tw="font-space-bold pb-4 text-lg text-black dark:text-white">
        Are you sure you want to unlist?
      </Text>
      <Text tw="text-base text-black dark:text-white">
        Unlisting an NFT will remove it from Showtime's marketplace.
      </Text>
    </View>
  );
};

export { UnlistingTitle };
