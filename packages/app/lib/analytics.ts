import { useEffect } from "react";

import { rudder } from "app/lib/rudderstack";

const RUDDERSTACK_WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
const RUDDERSTACK_DATA_PLANE_URL = `https://tryshowtimjtc.dataplane.rudderstack.com`;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function emptyAnalyticsScript() {
  return `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load("${RUDDERSTACK_WRITE_KEY}","${RUDDERSTACK_DATA_PLANE_URL}",{sendAdblockPage:!1,sendAdblockPageOptions:{integrations:{All:!1,Amplitude:!1}},logLevel:"ERROR"}),rudderanalytics.page();`;
}
