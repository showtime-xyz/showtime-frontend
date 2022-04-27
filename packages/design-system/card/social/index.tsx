import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";

import { useMyInfo } from "app/hooks/api-hooks";
import { useRouter } from "app/navigation/use-router";
import { NFT } from "app/types";

import { Button } from "design-system/card/social/button";
import { View } from "design-system/view";

function Social({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  const router = useRouter();

  const { isLiked, like, unlike } = useMyInfo();

  const isLikedNft = useMemo(() => isLiked(nft.nft_id), [isLiked, nft.nft_id]);

  const [likeCount, setLikeCount] = useState(nft.like_count);

  const handleCommentPress = useCallback(() => {
    const as = `/nft/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}/comments`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            commentsModal: true,
            chainName: nft?.chain_name,
            contractAddress: nft?.contract_address,
            tokenId: nft?.token_id,
          },
        },
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [router, nft]);

  return (
    <View tw="px-4 py-2 bg-white dark:bg-black flex-row justify-between">
      <View tw="flex-row">
        <Button
          variant="like"
          count={likeCount}
          active={isLikedNft}
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
        />
        <View tw="ml-2" />
        <Button
          variant="comment"
          count={nft.comment_count}
          onPress={handleCommentPress}
        />
      </View>

      {/* <View>
        <Button variant="boost" count={0} />
      </View> */}
    </View>
  );
}

export { Social };
