import { useEffect } from "react";

import * as WebBrowser from "expo-web-browser";

const SpotifyAuthRedirect = () => {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);
  return null;
};

export default SpotifyAuthRedirect;
