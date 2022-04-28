import type { NFT } from "app/types";

import { Text } from "design-system/text";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
};

function Title({ nft }: Props) {
  if (!nft) return null;

  return (
    <View tw="bg-white px-4 py-2 dark:bg-black">
      <Text tw="font-semibold text-black dark:text-white" variant="text-lg">
        {nft.token_name}
      </Text>
    </View>
  );
}

export { Title };
