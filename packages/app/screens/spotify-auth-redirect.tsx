import { useEffect } from "react";
import { Linking } from "react-native";

import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { SPOTIFY_REDIRECT_URI } from "app/hooks/use-spotify-gated-claim";
import { createParam } from "app/navigation/use-param";

import { Button, Text, View } from "design-system";

type Query = {
  error?: string;
  state?: string;
  code?: string;
};

const { useParam } = createParam<Query>();

export const SpotifyAuthRedirect = () => {
  const [error] = useParam("error");
  const [state] = useParam("state");
  const [code] = useParam("code");
  const { saveSpotifyToken } = useSaveSpotifyToken();
  useEffect(() => {
    const urlParams = new URLSearchParams(state);
    const nftId = urlParams.get("nftId");
    const userId = urlParams.get("userId");
    if (nftId && userId && code) {
      saveSpotifyToken({ code, redirectUri: SPOTIFY_REDIRECT_URI });
    }
  }, [state, saveSpotifyToken, code]);
  if (error) {
    return (
      <View>
        <Text>Something went wrong. Please try again</Text>
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
    <View>
      <Text>Success!</Text>
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
};
