import { useContext, useEffect } from "react";
import AppContext from "../context/app-context";

export default function useCheckNetwork() {
  const context = useContext(AppContext);

  useEffect(() => {
    (async function iife() {
      if (context.web3Provider === null) {
        return;
      }
      const network = await context?.web3Provider?.getNetwork();
      if (network?.name !== "rinkeby") {
        alert("Please make sure you are on network rinkeby");
      }
    })();
  }, [context]);
}