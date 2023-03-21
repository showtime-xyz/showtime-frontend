import { Owner } from "app/components/card";
import type { NFT } from "app/types";

import { Text } from "design-system/text";
import { View } from "design-system/view";

function Details({ nft }: { nft?: NFT }) {
  if (!nft) return null;
  return (
    <>
      <View tw="m-4">
        <Text tw="text-lg font-medium text-black dark:text-white">
          {nft?.token_name}
        </Text>
        {nft?.token_description && (
          <>
            <View tw="h-4" />
            <Text tw="text-sm font-medium text-gray-500 dark:text-gray-500">
              {nft?.token_description}
            </Text>
          </>
        )}
      </View>
      {nft ? (
        <View tw="mx-4 border-b border-gray-100 dark:border-gray-900" />
      ) : null}
      <Owner nft={nft} />
    </>
  );
}

export { Details };
