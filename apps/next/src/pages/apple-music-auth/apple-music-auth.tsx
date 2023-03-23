import { useEffect } from "react";

import { useAppleMusicToken } from "app/hooks/use-apple-music-token";

export default function AppleMusicAuth() {
  const { getUserToken } = useAppleMusicToken();
  useEffect(() => {
    function newOpen(url) {
      window.location.href = url;
    }

    //@ts-ignore
    window.open = newOpen;

    (async function getToken() {
      const token = await getUserToken();
      //@ts-ignore
      window.ReactNativeWebView.postMessage(token);
    })();
  }, [getUserToken]);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 10000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "white",
      }}
    />
  );
}
