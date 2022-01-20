import { View } from "design-system/view";
import { Text } from "design-system/text";

import { NFT } from "app/types";

type Props = {
  nft?: NFT;
  options?: boolean;
};

/**
 * TODO(gorhom): get the actual price from the nft object
 */

export function Price({ nft }: Props) {
  if (!nft) return null;

  return (
    <View>
      <Text
        sx={{ fontSize: 12 }}
        tw="mb-0 text-right text-gray-600 dark:text-gray-400 font-semibold"
      >
        🏷 Price
      </Text>
      <Text
        sx={{ fontSize: 13, lineHeight: 13 }}
        tw="text-right text-gray-900 dark:text-white font-bold"
      >
        1.55 WETH
      </Text>
    </View>
  );
}
