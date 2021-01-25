import React, { useContext, useEffect } from "react";
import Link from "next/link";
import useWindowSize from "../hooks/useWindowSize";
import AppContext from "../context/app-context";

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
      } catch {
        // Not logged in
      }
    };

    if (!context?.user) {
      getUserFromCookies();
      getMyLikes();
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

  return (
    <header>
      <div className="w-10/12 mx-auto py-5 flex flex-col md:flex-row items-center ">
        <Link href="/">
          <a className="flex flex-row showtime-header-link mb-4 md:mb-0 uppercase items-center text-left mr-auto">
            <img
              src="/logo_sm.jpg"
              style={{ height: 48, width: 48, borderRadius: 5 }}
            />
            <div className="mx-4">Showtime</div>
          </a>
        </Link>
        <div className="flex-grow items-center text-right">
          <nav className="text-base">
            <Link href="/c/superrare">
              <a className="showtime-header-link mr-5 text-sm md:text-base">
                Discover
              </a>
            </Link>
            <Link href="/#leaderboard">
              <a className="showtime-header-link mr-5 text-sm md:text-base">
                Top Creators
              </a>
            </Link>
            {context.user ? (
              <Link href="/p/[slug]" as={`/p/${context.user.publicAddress}`}>
                <a className="showtime-login-button-outline text-sm px-3 py-2 md:text-base md:px-5 md:py-3">
                  Profile
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
