import { useEffect, useState } from "react";
import { Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { Logger } from "app/lib/logger";
import { redirectUri } from "app/lib/spotify/queryString";
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
  const _redirectUri = urlParams.get("redirectUri");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (code) {
      (async () => {
        try {
          setFetching(true);
          setError(false);
          await saveSpotifyToken({ code, redirectUri: redirectUri });
          router.replace(_redirectUri);
        } catch (e) {
          setError(e);
          Logger.error("Save spotify token error", e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveSpotifyToken, code, redirectUri]);

  useEffect(() => {
    if (spotifyError) {
      Logger.error("fetch spotify token error", spotifyError);
    }
  }, [spotifyError]);

  if (spotifyError || error) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Text tw="pb-4 text-black dark:text-white">Something went wrong</Text>
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

  return (
    <View tw="h-screen flex-row items-center justify-center">
      <Text tw="light:text-black mr-2 text-lg dark:text-white">
        Taking you back to Showtime...
      </Text>
      <Spinner size="small" />
    </View>
  );
};

export default SpotifyAuthRedirect;
