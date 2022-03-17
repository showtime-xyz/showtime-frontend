import { useMemo } from "react";

import { useNFTListings } from "app/hooks/api/use-nft-listings";
import { NFT } from "app/types";

import { useIsDarkMode } from "design-system/hooks";
import { Skeleton } from "design-system/skeleton";
import { Text } from "design-system/text";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
  options?: boolean;
};

export function Price({ nft }: Props) {
  //#region hooks
  const isDarkMode = useIsDarkMode();
  const { data, loading, error } = useNFTListings(nft?.nft_id);
  //#endregion

  //#region variables
  const price = useMemo(() => {
    const index = (data?.card_summary.length ?? 0) - 1;
    if (index === -1) {
      return "";
    }
    return `${data?.card_summary[index].listing?.min_price} ${data?.card_summary[index].listing?.currency}`;
  }, [data]);
  //#endregion

  if (
    !nft ||
    !data ||
    (!loading && data.card_summary.length > 0 && !data.card_summary[0].listing)
  )
    return null;

  return (
    <View tw="flex justify-end">
      <Text
        sx={{ fontSize: 12 }}
        tw="mb-1 text-right text-gray-600 dark:text-gray-400 font-semibold"
      >
        🏷 Price
      </Text>
      <Skeleton
        show={loading}
        height={13}
        colorMode={isDarkMode ? "dark" : "light"}
      >
        <Text
          sx={{ fontSize: 13, lineHeight: 14 }}
          tw="text-right text-gray-900 dark:text-white font-bold uppercase"
          children={price}
        />
      </Skeleton>
    </View>
  );
}
