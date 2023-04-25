import { useEffect } from "react";

import { amplitude, Types } from "app/lib/amplitude";

const track = (
  event: string,
  properties?: any,
  options?: Types.EventOptions
) => {
  amplitude.track(event, properties, options);
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
    Analytics.track(EVENTS.SCREEN_VIEWED, { screenName: name });
  }, [name]);
};

export const EVENTS = {
  SCREEN_VIEWED: "Screen Viewed",
  BUTTON_CLICKED: "Button Clicked",
  DROP_SHARED: "Drop Shared",
  DROP_COLLECTED: "Drop Collected",
  DROP_CREATED: "Drop Created",
  USER_SHARED_PROFILE: "User Shared Profile",
  USER_LOGGED_OUT: "User Logged Out",
  USER_LOGIN: "User Logged In",
  USER_FINISHED_ONBOARDING: "User Finished Onboarding",
  USER_LIKED_DROP: "User Liked Drop",
  USER_UNLIKED_DROP: "User Unliked Drop",
  USER_LIKED_COMMENT: "User Liked Comment",
  USER_UNLIKED_COMMENT: "User Unliked Comment",
  USER_FOLLOWED_PROFILE: "User Followed Profile",
  USER_UNFOLLOWED_PROFILE: "User Unfollowed Profile",
  PLAY_ON_SPOTIFY_PRESSED: "Play on Spotify Pressed",
  PLAY_ON_APPLE_MUSIC_PRESSED: "Play on Apple Music Pressed",
  SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN: "Spotify Save Pressed Before Login",
  APPLE_MUSIC_SAVE_PRESSED_BEFORE_LOGIN:
    "Apple Music Save Pressed Before Login",
  SPOTIFY_SAVE_SUCCESS_BEFORE_LOGIN: "Spotify Save Success Before Login",
  APPLE_MUSIC_SAVE_SUCCESS_BEFORE_LOGIN:
    "Apple Music Save Success Before Login",
  APPLE_MUSIC_AUTH_FAILED: "Apple Music Auth Failed",
};
