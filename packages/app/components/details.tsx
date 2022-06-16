import { Owner } from "app/components/card";
import { Collection } from "app/components/card/rows/collection";
import type { NFT } from "app/types";

import { Text } from "design-system/text";
import { View } from "design-system/view";

function Details({ nft }: { nft: NFT }) {
  return (
    <>
      <View tw="m-4">
        <Text tw="font-space-bold text-lg font-medium text-black dark:text-white">
          {nft?.token_name}
        </Text>
        {nft?.token_description && (
          <>
            <View tw="h-4" />
            <Text tw="text-sm font-medium text-gray-400 dark:text-gray-600">
              {nft?.token_description}
            </Text>
          </>
        )}
      </View>
      <Collection nft={nft} />
      {nft ? (
        <View tw="mx-4 border-b border-gray-100 dark:border-gray-900" />
      ) : null}
      <Owner nft={nft} />
    </>
  );
}

export { Details };
