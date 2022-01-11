import { useState, useEffect } from "react";

function useIsMobileWeb() {
  const [userAgent, setUserAgent] = useState("");
  const [isMobileWeb, setIsMobileWeb] = useState(true);

  useEffect(() => {
    const userAgent = window?.navigator?.userAgent;
    setUserAgent(userAgent);
    setIsMobileWeb(
      /android/i.test(userAgent) || /iPad|iPhone|iPod|ios/.test(userAgent)
    );
  }, []);

  return {
    userAgent,
    isMobileWeb,
  };
}

export { useIsMobileWeb };
