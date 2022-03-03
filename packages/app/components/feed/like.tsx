import { useCallback, useMemo, useState } from "react";

import { useMyInfo } from "app/hooks/api-hooks";
import { NFT } from "app/types";

import { Text, Pressable } from "design-system";
import { Heart } from "design-system/icon";
import { tw } from "design-system/tailwind";

import { formatNumber } from "../../utilities";

function Like({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  const { isLiked, like, unlike } = useMyInfo();

  const isLikedNft = useMemo(() => isLiked(nft.nft_id), [isLiked, nft.nft_id]);

  const [likeCount, setLikeCount] = useState(nft.like_count);

  return (
    <Pressable
      tw="flex-row items-center"
      onPress={useCallback(async () => {
        if (isLikedNft) {
          const isSuccessfullyUnlike = await unlike(nft.nft_id);
          if (isSuccessfullyUnlike) {
            setLikeCount(likeCount - 1);
          }
        } else {
          const isSuccessfullyLiked = await like(nft.nft_id);
          if (isSuccessfullyLiked) {
            setLikeCount(likeCount + 1);
          }
        }
      }, [isLikedNft, like, unlike, likeCount])}
    >
      <Heart
        height={24}
        width={24}
        //@ts-ignore
        color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
      />
      <Text tw="text-xs text-gray-900 dark:text-white font-bold ml-1 ">
        {nft.like_count > 0 ? formatNumber(nft.like_count) : undefined}
      </Text>
    </Pressable>
  );
}

export { Like };
