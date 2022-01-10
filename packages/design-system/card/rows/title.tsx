import { View } from "design-system/view";
import { Text } from "design-system/text";

function Title({ nft }) {
  if (!nft) return null;

  return (
    <View tw="p-4 bg-white dark:bg-black">
      <Text tw="text-black dark:text-white font-semibold" variant="text-lg">
        {nft.token_name}
      </Text>
    </View>
  );
}

export { Title };
