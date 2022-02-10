import type { NFT } from "app/types";

import { Button } from "design-system/button";
import { MoreHorizontal } from "design-system/icon";
import type { TW } from "design-system/tailwind/types";
import { View } from "design-system/view";

import { Creator } from "./elements/creator";
import { Ownership } from "./elements/ownership";
import { Price } from "./elements/price";

type Props = {
  nft?: NFT;
  options?: boolean;
  price?: boolean;
  tw?: TW;
};

function Owner({ options, price, nft, tw = "" }: Props) {
  if (!nft) return null;

  return (
    <View
      tw={[
        "px-4 py-2 flex flex-row items-center justify-between bg-white dark:bg-black",
        tw,
      ]}
    >
      <Creator nft={nft} />
      {options ? (
        <Button variant="tertiary" size="small" iconOnly={true}>
          <MoreHorizontal />
        </Button>
      ) : price ? (
        <Price nft={nft} />
      ) : (
        <Ownership nft={nft} />
      )}
    </View>
  );
}

export { Owner };
