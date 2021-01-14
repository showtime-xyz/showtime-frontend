import React from "react";
import Link from "next/link";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="">
      <div className="w-10/12 mx-auto flex flex-wrap py-5 flex-col md:flex-row items-center ">
        <Link href="/">
          <a className="flex items-center showtime-header-link mb-4 md:mb-0 uppercase">
            Showtime
          </a>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/discover?collection=superrare">
            <a className="showtime-header-link mr-5">Discover</a>
          </Link>
          <Link href="/#leaderboard">
            <a className="showtime-header-link mr-5">Top Creators</a>
          </Link>
        </nav>
        {user ? (
          <Link href={`/p/${user.publicAddress}`}>
            <button type="button" className="showtime-white-button-outline">
              Profile
            </button>
          </Link>
        ) : (
          <Link href="/#auth">
            <button type="button" className="showtime-white-button">
              Sign in / Sign up
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
