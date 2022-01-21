import { View } from "design-system/view";
import { Button } from "design-system/button";
import { MoreHorizontal } from "design-system/icon";
import { Creator } from "./elements/creator";
import type { NFT } from "app/types";
import { Ownership } from "./elements/ownership";
import { Price } from "./elements/price";

type Props = {
  nft?: NFT;
  options?: boolean;
  price?: boolean;
};

function Owner({ options, price, nft }: Props) {
  if (!nft) return null;

  return (
    <View tw="px-3 py-1 flex flex-row items-center justify-between bg-white dark:bg-black">
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
