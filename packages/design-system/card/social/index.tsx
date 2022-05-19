import { useCallback } from "react";
import { Platform } from "react-native";

import { useLike } from "app/context/like-context";
import { useRouter } from "app/navigation/use-router";
import { NFT } from "app/types";

import { Button } from "design-system/card/social/button";
import { View } from "design-system/view";

function Social({ nft }: { nft?: NFT }) {
  const router = useRouter();
  const { isLiked, likeCount, toggleLike } = useLike();

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
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [router, nft]);

  if (!nft) return null;

  return (
    <View tw="flex-row justify-between bg-white px-4 py-2 dark:bg-black">
      <View tw="flex-row">
        <Button
          variant="like"
          count={likeCount}
          active={isLiked}
          onPress={toggleLike}
        />
        <View tw="ml-2" />
        <Button
          variant="comment"
          count={nft.comment_count}
          onPress={handleCommentPress}
        />
      </View>
    </View>
  );
}

export { Social };
