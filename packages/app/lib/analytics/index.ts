import { useEffect } from "react";

import { amplitude } from "app/lib/amplitude";

const track = (event: string, properties?: any) => {
  amplitude.track(event, properties);
};

export const Analytics = { track };

export const useTrackPageViewed = ({ name }: { name: string }) => {
  useEffect(() => {
    Analytics.track("Page Viewed", { page_name: name });
  }, [name]);
};
