import * as React from "react";
import { createContext, useState, useContext } from "react";

import type RudderClient from "@rudderstack/rudder-sdk-react-native";
import Script from "next/script";

type WindowAnalytics = {
  rudderanalytics: typeof RudderClient;
};

export const RudderStackContext = createContext({
  rudder: null as typeof RudderClient | null,
});

export const RudderStackProvider = ({ children }: any) => {
  const [rudder, setRudder] = useState<typeof RudderClient | null>(null);

  const onRudderLoad = () => {
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
  };

  return (
    <RudderStackContext.Provider
      value={{
        rudder,
      }}
    >
      <Script
        src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js"
        strategy="lazyOnload"
        onLoad={onRudderLoad}
      />
      {children}
    </RudderStackContext.Provider>
  );
};

export const useRudder = () => {
  return useContext(RudderStackContext);
};
