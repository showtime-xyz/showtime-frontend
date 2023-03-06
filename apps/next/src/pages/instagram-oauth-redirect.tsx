// Web only component. This component never gets rendered on native. It handles the redirect from magic.link
import { useEffect } from "react";
import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";

const MagicOauthRedirect = () => {
  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
        await WebBrowser.maybeCompleteAuthSession();
      }
    })();
  }, []);

  return null;
};

export default MagicOauthRedirect;
