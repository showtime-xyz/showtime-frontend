import { useEffect } from "react";

import * as WebBrowser from "expo-web-browser";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

const MagicOauthRedirect = () => {
  useEffect(() => {
    const res = WebBrowser.maybeCompleteAuthSession();
    console.log("efijefjiefjifejfeifei ", res);
  }, []);
  return (
    <View tw="flex-1 items-center justify-center">
      <Spinner size="large" />
    </View>
  );
};

export default MagicOauthRedirect;
