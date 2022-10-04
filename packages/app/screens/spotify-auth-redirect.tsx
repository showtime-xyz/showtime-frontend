import { useEffect } from "react";
import { Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { getNFTURL } from "app/hooks/use-share-nft";
import { SPOTIFY_REDIRECT_URI } from "app/hooks/use-spotify-gated-claim";
import { Logger } from "app/lib/logger";
import { createParam } from "app/navigation/use-param";

type Query = {
  error?: string;
  state?: string;
  code?: string;
};

const { useParam } = createParam<Query>();

export const SpotifyAuthRedirect = () => {
  const [spotifyError] = useParam("error");
  const [state] = useParam("state");
  const [code] = useParam("code");
  const { saveSpotifyToken } = useSaveSpotifyToken();
  const urlParams = new URLSearchParams(state);
  const chainName = urlParams.get("chainName");
  const tokenId = urlParams.get("tokenId");
  const contractAddress = urlParams.get("contractAddress");
  const {
    data,
    isLoading,
    error: nftFetchError,
  } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  console.log("data ", data);
  useEffect(() => {
    if (code) {
      (async () => {
        try {
          await saveSpotifyToken({ code, redirectUri: SPOTIFY_REDIRECT_URI });
        } catch (e) {
          Logger.error("Save spotify token error", e);
        }
      })();
    }
  }, [saveSpotifyToken, code]);

  useEffect(() => {
    if (spotifyError) {
      Logger.error("fetch spotify token error", spotifyError);
    }
  }, [spotifyError]);

  if (spotifyError || nftFetchError) {
    return (
      <View>
        <Text>Something went wrong</Text>
        <Button
          onPress={() =>
            //@ts-ignore
            Linking.openURL("https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN)
          }
        >
          Go back to the app
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View tw="h-screen flex-row items-center justify-center">
        <Text tw="light:text-black mr-2 dark:text-white">Loading...</Text>
        <Spinner size="small" />
      </View>
    );
  }

  console.log("data ", data);

  return (
    <View tw="h-screen items-center justify-center">
      <Text tw="light:text-black text-lg dark:text-white">Success</Text>
      <Button
        tw="mt-4"
        onPress={() => {
          if (data?.data.item) {
            Linking.openURL(getNFTURL(data?.data.item));
          }
        }}
      >
        Go back to the app
      </Button>
    </View>
  );
};
