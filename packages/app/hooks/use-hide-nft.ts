import { useCallback } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useMatchMutate } from "app/hooks/use-match-mutate";
import { axios } from "app/lib/axios";

export const useHideNFT = () => {
  const matchMutate = useMatchMutate();
  const router = useRouter();

  const hideNFT = useCallback(
    async (nftId: number | undefined) => {
      if (nftId) {
        try {
          await axios({
            url: `/v2/profile-tabs/hide-nft/${nftId}`,
            method: "POST",
            data: {},
          });

          matchMutate((key: string) => key.includes("profile-tabs/nfts"));

          if (router.pathname.includes("list") && Platform.OS !== "web") {
            router.pop();
          }

          if (router.pathname.includes("/nft/") && Platform.OS === "web") {
            router.pop();
          }
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    [matchMutate, router]
  );

  const unhideNFT = useCallback(
    async (nftId: number | undefined) => {
      if (nftId) {
        try {
          await axios({
            url: `/v2/profile-tabs/unhide-nft/${nftId}`,
            method: "POST",
            data: {},
          });

          matchMutate((key: string) => key.includes("profile-tabs/nfts"));

          if (router.pathname.includes("list") && Platform.OS !== "web") {
            router.pop();
          }

          if (router.pathname.includes("/nft/") && Platform.OS === "web") {
            router.pop();
          }
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    [matchMutate, router]
  );

  return { hideNFT, unhideNFT };
};
