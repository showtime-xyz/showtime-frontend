import { useEffect } from "react";

import { rudder } from "app/lib/rudderstack";

export function track(
  event: string,
  props?: Record<string, any>,
  options?: Record<string, any>
) {
  rudder.track(event, props, options);
}

type ButtonClickedProps = {
  name: string;
};

// Button Clicked
export function trackButtonClicked({ name }: ButtonClickedProps) {
  track("Button Clicked", {
    name,
  });
}

type PageViewedProps = {
  name: string;
};

// Page Viewed
export function useTrackPageViewed({ name }: PageViewedProps) {
  useEffect(() => {
    track("Page Viewed", { name });
  }, []);
}
