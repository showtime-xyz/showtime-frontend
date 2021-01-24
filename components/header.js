import React from "react";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import useWindowSize from "../hooks/useWindowSize";

const Header = () => {
  const { user } = useAuth();
  const size = useWindowSize();

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
            {user ? (
              <Link href="/p/[slug]" as={`/p/${user.publicAddress}`}>
                <button
                  type="button"
                  className="showtime-login-button-outline text-sm px-3 py-2 md:text-base md:px-5 md:py-3"
                >
                  Profile
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <a className="showtime-login-button-solid text-sm px-3 py-2 md:text-base  md:px-5 md:py-3">
                  {size && size.width > 500 ? "Sign in / Sign up" : "Sign in"}
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
