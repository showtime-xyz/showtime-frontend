import { useEffect } from "react";

import * as WebBrowser from "expo-web-browser";

const SpotifyAuthRedirect = () => {
  useEffect(() => {
    (async () => {
      const res = await WebBrowser.maybeCompleteAuthSession();
      console.log("rkrokr ", res);
    })();
  }, []);
  return null;
};

export default SpotifyAuthRedirect;
