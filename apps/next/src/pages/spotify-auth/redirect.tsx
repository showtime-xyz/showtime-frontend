import { useEffect, useState } from "react";
import { Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { Logger } from "app/lib/logger";
import { createParam } from "app/navigation/use-param";

type Query = {
  error?: string;
  state?: string;
  code?: string;
};

const { useParam } = createParam<Query>();

const SpotifyAuthRedirect = () => {
  const [spotifyError] = useParam("error");
  const [state] = useParam("state");
  const [code] = useParam("code");
  const { saveSpotifyToken } = useSaveSpotifyToken();
  const urlParams = new URLSearchParams(state);
  const contractAddress = urlParams.get("contractAddress");
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (code) {
      (async () => {
        try {
          setFetching(true);
          setError(false);
          //@ts-ignore
          if (typeof window.ReactNativeWebView !== "undefined") {
            //@ts-ignore
            window.ReactNativeWebView.postMessage(JSON.stringify({ code }));
          } else {
            await saveSpotifyToken({ code });
            redirectToClaimDrop(contractAddress);
          }
        } catch (e) {
          setError(e);
          Logger.error("Save spotify token error", e);
        }
      })();
    }
  }, [saveSpotifyToken, code, contractAddress, redirectToClaimDrop]);

  useEffect(() => {
    if (spotifyError) {
      Logger.error("fetch spotify token error", spotifyError);
    }
  }, [spotifyError]);

  if (spotifyError || error) {
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

  if (fetching) {
    return (
      <View tw="h-screen flex-row items-center justify-center">
        <Text tw="light:text-black mr-2 dark:text-white">Loading...</Text>
        <Spinner size="small" />
      </View>
    );
  }

  return (
    <View tw="h-screen items-center justify-center">
      <Text tw="light:text-black text-lg dark:text-white">
        Please wait...You'll be redirected back to the app
      </Text>
    </View>
  );
};

export default SpotifyAuthRedirect;
