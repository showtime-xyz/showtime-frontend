import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import * as Haptics from "expo-haptics";

import { useMyInfo } from "app/hooks/api-hooks";
import { useUser } from "app/hooks/use-user";
import { NFT } from "app/types";

type LikeContextType = {
  isLiked: boolean;
  likeCount: number;
  toggleLike: () => void;
  like: () => void;
};

export const LikeContext = createContext(null as unknown as LikeContextType);

export const LikeContextProvider = ({
  nft,
  children,
}: {
  nft: NFT;
  children: any;
}) => {
  const { isLiked, like, unlike } = useMyInfo();
  const { isAuthenticated } = useUser();

  const isLikedNft = useMemo(() => isLiked(nft.nft_id), [isLiked, nft.nft_id]);

  const [likeCount, setLikeCount] = useState(
    typeof nft.like_count === "number" ? nft.like_count : 0
  );

  const likeImpl = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isLikedNft) {
      if (isAuthenticated) setLikeCount((l) => l + 1);

      const isSuccessfullyLiked = await like(nft.nft_id);
      if (!isSuccessfullyLiked && isAuthenticated) {
        setLikeCount((l) => l - 1);
      }
    }
  }, [isAuthenticated, like, nft, isLikedNft]);

  const toggleLike = useCallback(async () => {
    if (isLikedNft) {
      if (isAuthenticated) setLikeCount((l) => l - 1);

      const isSuccessfullyUnlike = await unlike(nft.nft_id);
      if (!isSuccessfullyUnlike && isAuthenticated) {
        setLikeCount((l) => l + 1);
      }
    } else {
      likeImpl();
    }
  }, [like, isAuthenticated, isLikedNft, unlike, likeImpl, nft]);

  const likeContextValue = useMemo(
    () => ({ isLiked: isLikedNft, likeCount, toggleLike, like: likeImpl }),
    [isLikedNft, likeCount, toggleLike, likeImpl]
  );

  return (
    <LikeContext.Provider value={likeContextValue}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => {
  return useContext(LikeContext);
};
