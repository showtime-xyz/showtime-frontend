import { useEffect } from "react";

import * as WebBrowser from "expo-web-browser";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

const SpotifyAuthRedirect = () => {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);
  return (
    <View tw="flex-1 items-center justify-center">
      <Spinner size="large" />
    </View>
  );
};

SpotifyAuthRedirect.getLayout = function getLayout(page) {
  return page.children;
};

export default SpotifyAuthRedirect;
