import { useEffect } from "react";

import { useRudder } from "app/lib/rudderstack";

type PageViewedProps = {
  name: string;
  type?: string;
};

// Page Viewed
export function useTrackPageViewed({ name, type }: PageViewedProps) {
  const { rudder } = useRudder();

  useEffect(() => {
    rudder?.track("Page Viewed", { name, type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rudder]);
}
