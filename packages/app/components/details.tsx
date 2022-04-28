import type { NFT } from "app/types";

import { Owner } from "design-system/card";
import { Collection } from "design-system/card/rows/collection";
import { Text } from "design-system/text";
import { View } from "design-system/view";

function Details({ nft }: { nft: NFT }) {
  return (
    <>
      <View tw="m-4">
        <Text variant="text-lg" tw="font-medium text-black dark:text-white">
          {nft?.token_name}
        </Text>
        {nft?.token_description && (
          <>
            <View tw="h-4" />
            <Text
              variant="text-sm"
              tw="font-medium text-gray-400 dark:text-gray-600"
            >
              {nft?.token_description}
            </Text>
          </>
        )}
      </View>
      <Collection nft={nft} />
      <View tw="mx-4 border-b border-gray-100 dark:border-gray-900" />
      <Owner nft={nft} />
      <View tw="mx-4 border-b border-gray-100 dark:border-gray-900" />
    </>
  );
}

export { Details };
