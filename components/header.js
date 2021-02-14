import React, { useContext, useEffect } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import useWindowSize from "../hooks/useWindowSize";
import AppContext from "../context/app-context";

const Header = () => {
  const context = useContext(AppContext);

  // Try to log us in if it's not already in state
  useEffect(() => {
    const getUserFromCookies = async () => {
      // log in with our own API
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
      getMyInfo();
    }
  }, [context?.user]);

  // Keep track of window size
  const windowSize = useWindowSize();
  useEffect(() => {
    context.setWindowSize(windowSize);
  }, [windowSize]);

  const getMyInfo = async () => {
    // get our likes
    const myInfoRequest = await fetch("/api/myinfo");
    try {
      const my_info_data = await myInfoRequest.json();

      context.setMyLikes(my_info_data.data.likes);
      context.setMyFollows(my_info_data.data.follows);
      context.setMyProfile(my_info_data.data.profile);
    } catch {}
  };

  return (
    <>
      <header
        className="p-4 bg-white md:px-16"
        style={{ boxShadow: "0px 4px 10px 6px rgba(34, 48, 67, 3%)" }}
      >
        <div className="flex flex-row items-center ">
          <div>
            <Link href="/">
              <a
                className="flex flex-row showtime-header-link items-center text-left mr-auto"
                onClick={() => {
                  mixpanel.track("Logo button click");
                }}
              >
                <img
                  src="/logo_sm.jpg"
                  style={{ height: 44, width: 44, borderRadius: 5 }}
                />
                <div className="mx-2" style={{ fontWeight: 700 }}>
                  Showtime
                </div>
              </a>
            </Link>
          </div>
          {/* Start desktop-only menu */}
          <div className="hidden md:block ml-8">
            <Link href="/">
              <a
                className="showtime-header-link mr-5 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Home button click");
                }}
              >
                Home
              </a>
            </Link>
            <Link href="/c/[collection]" as="/c/all">
              <a
                className="showtime-header-link mr-5 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Explore button click");
                }}
              >
                Explore
              </a>
            </Link>
          </div>
          {/* End desktop-only menu */}
          <div className="flex-grow"></div>
          <div>
            {context.user && context.myProfile !== undefined ? (
              <Link href="/p/[slug]" as={`/p/${context.user.publicAddress}`}>
                <a
                  className="showtime-login-button-outline text-sm px-2 py-2 md:text-base flex flex-row items-center"
                  onClick={() => {
                    mixpanel.track("Profile button click");
                  }}
                >
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
                  <div className="block sm:hidden">Profile</div>
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="showtime-login-button-solid text-sm px-3 py-2 md:text-base  md:px-3 md:py-2">
                  {context.windowSize && context.windowSize.width > 500
                    ? "Sign in / Sign up"
                    : "Sign in"}
                </a>
              </Link>
            )}
          </div>
        </div>
        {/* Start mobile-only menu */}
        <div
          className="block md:hidden pt-4"
          style={{
            backgroundColor: "white",
          }}
        >
          <Link href="/">
            <a
              className="showtime-header-link mr-5 text-sm md:text-base"
              onClick={() => {
                mixpanel.track("Most liked button click");
              }}
            >
              Home
            </a>
          </Link>
          <Link href="/c/[collection]" as="/c/all">
            <a
              className="showtime-header-link mr-5 text-sm md:text-base"
              onClick={() => {
                mixpanel.track("Explore button click");
              }}
            >
              Explore
            </a>
          </Link>
        </div>
        {/* End mobile-only menu */}
      </header>
    </>
  );
};

export default Header;
