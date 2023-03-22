import { useEffect } from "react";

import { amplitude } from "app/lib/amplitude";

const track = (event: string, properties?: any) => {
  amplitude.track(event, properties);
};

const setUserId = (userId: string) => {
  amplitude.setUserId(userId);
};

const reset = () => {
  amplitude.reset();
};

export const Analytics = { track, setUserId, reset };

export const useTrackPageViewed = ({ name }: { name: string }) => {
  useEffect(() => {
    Analytics.track(EVENTS.PAGE_VIEWED, { page_name: name });
  }, [name]);
};

export const EVENTS = {
  PAGE_VIEWED: "Page Viewed",
  BUTTON_CLICKED: "Button Clicked",
  DROP_SHARED: "Drop Shared",
  DROP_CLAIMED: "Drop Claimed",
  DROP_CLAIMED_WITH_WALLET: "Drop Claimed with Wallet",
  USER_SHARED: "User Shared",
  PHOTO_TAKEN: "Photo Taken",
  USER_LOGGED_OUT: "User Logged Out",
};
