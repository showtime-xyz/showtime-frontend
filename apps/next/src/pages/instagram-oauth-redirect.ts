// Web only component. This component never gets rendered on native. It handles the redirect from magic.link
import { useEffect } from "react";

import * as WebBrowser from "expo-web-browser";

const InstagramOauthRedirect = () => {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  return null;
};

export default InstagramOauthRedirect;
