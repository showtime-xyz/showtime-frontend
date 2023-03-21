import { useEffect } from "react";

import * as WebBrowser from "expo-web-browser";

import { Spinner } from "design-system/spinner";
import { View } from "design-system/view";

const MagicOauthRedirect = () => {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);
  return (
    <View tw="flex-1 items-center justify-center">
      <Spinner size="large" />
    </View>
  );
};

export default MagicOauthRedirect;
