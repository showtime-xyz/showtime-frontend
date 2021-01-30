import React, { useContext, useEffect } from "react";
import Link from "next/link";
import useWindowSize from "../hooks/useWindowSize";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";

const Header = () => {
  const context = useContext(AppContext);

  // Try to log us in if it's not already in state
  useEffect(() => {
    const getUserFromCookies = async () => {
      // login with our own API
      const userRequest = await fetch("/api/user");
      try {
        const user_data = await userRequest.json();
        context.setUser(user_data);

        mixpanel.identify(user_data.publicAddress);
        if (user_data.email) {
          mixpanel.people.set({
            $email: user_data.email, // only reserved properties need the $
            USER_ID: user_data.publicAddress, // use human-readable names
            //"Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
            //"credits": 150    // ...or numbers
          });
        } else {
          mixpanel.people.set({
            //$email: user_data.email, // only reserved properties need the $
            USER_ID: user_data.publicAddress, // use human-readable names
            //"Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
            //"credits": 150    // ...or numbers
          });
        }
      } catch {
        // Not logged in
        // Switch from undefined to null
        context.setUser(null);
      }
    };

    if (!context?.user) {
      getUserFromCookies();
      getMyLikes();
      getMyFollows();
      getMyProfile();
    }
  }, [context?.user]);

  // Keep track of window size
  const windowSize = useWindowSize();
  useEffect(() => {
    context.setWindowSize(windowSize);
  }, [windowSize]);

  const getMyLikes = async () => {
    // get our likes
    const myLikesRequest = await fetch("/api/mylikes");
    try {
      const my_like_data = await myLikesRequest.json();
      context.setMyLikes(my_like_data.data);
    } catch {
      //
    }
  };

  useEffect(() => {
    if (!context?.myLikes) {
      getMyLikes();
    }
  }, [context?.myLikes]);

  const getMyFollows = async () => {
    // get our follows
    const myFollowsRequest = await fetch("/api/myfollows");
    try {
      const my_follows_data = await myFollowsRequest.json();
      context.setMyFollows(my_follows_data.data);
    } catch {
      //
    }
  };

  useEffect(() => {
    if (!context?.myFollows) {
      getMyFollows();
    }
  }, [context?.myFollows]);

  const getMyProfile = async () => {
    // get our follows
    const myProfileRequest = await fetch("/api/myprofile");
    try {
      const my_profile_data = await myProfileRequest.json();
      context.setMyProfile(my_profile_data.data);
    } catch {
      //
    }
  };

  useEffect(() => {
    if (!context?.myProfile) {
      getMyProfile();
    }
  }, [context?.myProfile]);

  return (
    <header style={{ backgroundColor: "#010101" }}>
      <div className="w-10/12 mx-auto py-3 flex flex-col md:flex-row items-center ">
        <Link href="/">
          <a
            className="flex flex-row showtime-header-link mb-4 md:mb-0 items-center text-left mr-auto"
            onClick={() => {
              mixpanel.track("Logo button click");
            }}
          >
            <img
              src="/logo_sm.jpg"
              style={{ height: 48, width: 48, borderRadius: 5 }}
            />
            <div className="mx-4">Showtime</div>
          </a>
        </Link>
        <div className="items-center flex flex-row w-full">
          <div className="flex-grow hidden md:block"></div>
          <div className="flex-shrink">
            <Link href="/#leaderboard">
              <a
                className="showtime-header-link mr-5 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Collections button click");
                }}
              >
                Top Creators
              </a>
            </Link>
            <Link href="/c/superrare">
              <a
                className="showtime-header-link md:mr-5 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Discover button click");
                }}
              >
                Collections
              </a>
            </Link>
          </div>
          <div className="flex-grow md:hidden"></div>
          <div>
            <div>
              {context.user ? (
                <Link href="/p/[slug]" as={`/p/${context.user.publicAddress}`}>
                  <a
                    className="showtime-login-button-outline text-sm px-3 py-2 md:text-base md:px-3 md:py-2 flex flex-row items-center"
                    onClick={() => {
                      mixpanel.track("Profile button click");
                    }}
                  >
                    {context.myProfile === undefined ? null : (
                      <>
                        <div
                          className={
                            context.windowSize
                              ? context.windowSize.width < 350
                                ? "hidden"
                                : null
                              : null
                          }
                        >
                          <img
                            alt="profile pic"
                            src={
                              context.myProfile
                                ? context.myProfile.img_url
                                  ? context.myProfile.img_url
                                  : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            className="rounded-full mr-2"
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <div className="hidden sm:block">
                          {context.myProfile
                            ? context.myProfile.name
                              ? context.myProfile.name
                              : "Profile"
                            : "Profile"}
                        </div>
                      </>
                    )}
                    <div className="block sm:hidden">Profile</div>
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="showtime-login-button-solid text-sm px-3 py-2 md:text-base  md:px-5 md:py-3">
                    {context.windowSize && context.windowSize.width > 500
                      ? "Sign in / Sign up"
                      : "Sign in"}
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
