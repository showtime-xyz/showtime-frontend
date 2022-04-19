import type { NFT } from "app/types";

import { View } from "design-system/view";

import { Ownership } from "./elements/ownership";
import { Price } from "./elements/price";

type Props = {
  nft?: NFT;
  price?: boolean;
  tw?: string;
};

function Owner({ price, nft, tw = "" }: Props) {
  if (!nft) return null;

  return (
    <View
      tw={[
        "px-4 py-2 flex flex-row items-center justify-between bg-white dark:bg-black",
        tw,
      ]}
    >
      <Ownership nft={nft} />

      {price ? <Price nft={nft} /> : null}
    </View>
  );
}

export { Owner };
