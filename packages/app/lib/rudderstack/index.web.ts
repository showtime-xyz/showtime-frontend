import { useState, useCallback, useEffect } from "react";

import type RudderClient from "@rudderstack/rudder-sdk-react-native";

import { isServer } from "app/lib/is-server";

import { registerOnRudderLoad } from "./rudder-load-listener";

type WindowAnalytics = {
  rudderanalytics: typeof RudderClient;
};

function useRudder() {
  const [rudder, setRudder] = useState(
    isServer
      ? {}
      : (window as WindowAnalytics & Window & typeof globalThis)
          ?.rudderanalytics
  );

  const initializeRudder = useCallback(() => {
    if (!isServer) {
      const rudderanalytics = (
        window as WindowAnalytics & Window & typeof globalThis
      )?.rudderanalytics;
      const RUDDERSTACK_DATA_PLANE_URL = `https://tryshowtimjtc.dataplane.rudderstack.com`;
      //@ts-ignore
      rudderanalytics.load(
        process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY,
        RUDDERSTACK_DATA_PLANE_URL
      );
      setRudder(rudderanalytics);

      return true;
    }
  }, []);

  useEffect(() => {
    const loaded = initializeRudder();
    let remove: any;
    if (!loaded) {
      remove = registerOnRudderLoad(initializeRudder);
    }
    return () => {
      remove?.();
    };
  }, [initializeRudder]);

  return { rudder };
}

export { useRudder };
