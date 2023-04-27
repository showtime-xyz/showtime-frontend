import { useEffect } from "react";

import { useGetAppleMusicToken } from "app/hooks/use-connect-apple-music/use-get-apple-music-token";

export default function AppleMusicAuth() {
  const { getAppleMusicToken } = useGetAppleMusicToken();
  useEffect(() => {
    function newOpen(url) {
      window.location.href = url;
    }

    //@ts-ignore
    window.open = newOpen;

    (async function getToken() {
      const token = await getAppleMusicToken();
      //@ts-ignore
      window.ReactNativeWebView.postMessage(token);
    })();
  }, [getAppleMusicToken]);

  return null;
}

AppleMusicAuth.hideHeader = true;
