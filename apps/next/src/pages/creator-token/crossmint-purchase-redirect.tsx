import { useEffect } from "react";

export default function CrossmintPurchaseRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("p")) {
      const crossmintRes = JSON.parse(url.searchParams.get("p"));
      if (
        crossmintRes &&
        crossmintRes[0] &&
        crossmintRes[0].type === "purchase.succeeded"
      ) {
        window.opener.postMessage(crossmintRes[0]);
        window.close();
      }
    }
  }, []);
  return <div>hi</div>;
}
