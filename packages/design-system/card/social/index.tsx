import { useCallback, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import Router from "next/router";

import { useRouter } from "app/navigation/use-router";
import { View } from "design-system/view";
import { Button } from "design-system/card/social/button";
import { useMyInfo } from "app/hooks/api-hooks";
import { NFT } from "app/types";
import { NFT_DETAIL_API } from "app/utilities";

function Social({ nft }: { nft?: NFT }) {
  if (!nft) return null;

  const router = useRouter();
  const { mutate } = useSWRConfig();

  const openNFT = useCallback(
    (id: string) => {
      mutate(`${NFT_DETAIL_API}/${nft.nft_id}`, {
        data: nft,
      });
      const as = `/nft/${nft.nft_id}`;

      const href = Router.router
        ? {
            pathname: Router.pathname,
            query: { ...Router.query, id },
          }
        : as;

      router.push(href, as, { shallow: true });
    },
    [router, Router]
  );

  const { isLiked, like, unlike } = useMyInfo();

  const isLikedNft = useMemo(() => isLiked(nft.nft_id), [isLiked, nft.nft_id]);

  const [likeCount, setLikeCount] = useState(nft.like_count);

  return (
    <View tw="px-4 py-2 bg-white dark:bg-black flex-row justify-between">
      <View tw="flex-row">
        <Button
          variant="like"
          count={likeCount}
          active={isLikedNft}
          onPress={useCallback(async () => {
            if (isLikedNft) {
              unlike(nft.nft_id);
              setLikeCount(likeCount - 1);
            } else {
              const isSuccessfullyLiked = await like(nft.nft_id);
              if (isSuccessfullyLiked) {
                setLikeCount(likeCount + 1);
              }
            }
          }, [isLikedNft, like, unlike, likeCount])}
        />
        <View tw="ml-2" />
        {/* <Button
          variant="comment"
          count={nft.comment_count}
          onPress={() => {
            openNFT(nft.nft_id.toString());
          }}
        /> */}
      </View>

      {/* <View>
        <Button variant="boost" count={0} />
      </View> */}
    </View>
  );
}

export { Social };
