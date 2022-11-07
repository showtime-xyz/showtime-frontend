import { View } from "@showtime-xyz/universal.view";

import type { NFT } from "app/types";

import { Ownership } from "./elements/ownership";

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
        "flex flex-row items-center justify-between bg-white p-4 dark:bg-black",
        tw,
      ]}
    >
      <Ownership nft={nft} />
    </View>
  );
}

export { Owner };
