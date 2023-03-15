import { useEffect } from "react";
import { Platform } from "react-native";

import { useRudder } from "app/lib/rudderstack";

type PageViewedProps = {
  name: string;
  properties?: Record<string, any>;
};

// Page Viewed
export function useTrackPageViewed({ name, properties }: PageViewedProps) {
  const { rudder } = useRudder();

  useEffect(() => {
    if (Platform.OS === "web") {
      // @ts-expect-error rudderstack-native-sdk does not have a page method but its there in our rudderstack-provider.web.tsx
      rudder?.page(name, properties);
    } else {
      rudder?.screen(name, properties);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rudder]);
}
