import type { NFT } from "app/types";

import { Text } from "design-system/text";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
};

function Title({ nft }: Props) {
  if (!nft) return null;

  return (
    <View tw="px-4 py-2 bg-white dark:bg-black">
      <Text tw="text-black dark:text-white font-semibold" variant="text-lg">
        {nft.token_name}
      </Text>
    </View>
  );
}

export { Title };
