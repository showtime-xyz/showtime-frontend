import React, { useContext } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import SearchBar from "./SearchBar";
import AppContext from "../context/app-context";
import ModalLogin from "./ModalLogin";
import NotificationsBtn from "./NotificationsBtn";

const Header = () => {
  const context = useContext(AppContext);

  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalLogin
            isOpen={context.loginModalOpen}
            setEditModalOpen={context.setLoginModalOpen}
          />
        </>
      ) : null}
      <header className="p-4 fixed bg-white w-full z-10  shadow-md">
        <div className="flex flex-row items-center max-w-screen-2xl mx-auto sm:px-16 ">
          <div>
            <Link href="/">
              <a
                className="flex flex-row showtime-header-link items-center text-left mr-auto"
                onClick={() => {
                  mixpanel.track("Logo button click");
                }}
              >
                {/* <img
                  src="/logo_sm.jpg"
                  style={{ height: 44, width: 44, borderRadius: 5 }}
                /> */}
                <div
                  className="text-2xl py-2"
                  style={{ fontWeight: 400, fontFamily: "Afronaut" }}
                >
                  {"SHOWTIME"}
                </div>
              </a>
            </Link>
          </div>
          {/* Start desktop-only menu */}
          <div className="flex-grow" style={{ width: "100%" }}>
            <SearchBar />
          </div>
          <div
            className="hidden md:flex mr-6 items-center"
            style={{ fontWeight: 400 }}
          >
            {/*<Link href="/">
              <a
                className="showtime-header-link ml-6 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Home button click");
                }}
              >
                Home
              </a>
              </Link>*/}

            {/*context.myProfile && (
              <div className="relative">
                <Link href="/activity">
                  <a
                    className="showtime-header-link ml-6 text-sm md:text-base"
                    onClick={() => {
                      mixpanel.track("Activity button click");
                    }}
                  >
                    Activity
                  </a>
                </Link>
                <div
                  className="absolute -top-2 -right-3 bg-stpink rounded text-white flex items-center"
                  style={{ fontSize: 9, padding: "0px 2px" }}
                >
                  New!
                </div>
              </div>
                  )*/}
            <Link href="/c/[collection]" as="/c/all">
              <a
                className="showtime-header-link ml-6 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Explore button click");
                }}
              >
                Explore
              </a>
            </Link>
            <Link href="/leaderboard">
              <a
                className="showtime-header-link ml-6 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Leaderboard button click");
                }}
              >
                Trending
              </a>
            </Link>
            {context.user && context.myProfile !== undefined && (
              <div className="flex-shrink ml-6">
                <NotificationsBtn />
              </div>
            )}
          </div>

          {/* End desktop-only menu */}
          <div>
            {context.user && context.myProfile !== undefined ? (
              <Link
                href="/[profile]"
                as={`/${
                  context.myProfile.username || context.user.publicAddress
                }`}
              >
                <a
                  className="showtime-login-button-outline text-sm px-2 py-1 md:px-3 md:py-2 md:text-base flex flex-row items-center rounded-full "
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
                        style={{ height: 24, width: 24, minWidth: 24 }}
                      />
                    </div>
                    <div
                      className=""
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: context.gridWidth < 500 ? 76 : 200,
                      }}
                    >
                      {context.myProfile
                        ? context.myProfile.name
                          ? context.myProfile.name
                          : "Profile"
                        : "Profile"}
                    </div>
                  </>
                </a>
              </Link>
            ) : (
              <>
                <div
                  className="text-black border-black rounded-full px-5 py-1 cursor-pointer border-2 hover:text-stpink hover:border-stpink transition-all text-center"
                  onClick={() => {
                    context.setLoginModalOpen(!context.loginModalOpen);
                  }}
                  style={{ minWidth: 96 }}
                >
                  <span className="text-sm md:text-base">Sign in</span>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Start mobile-only menu */}
        <div
          className={`flex md:hidden justify-between items-center pt-3 ${
            !context.gridWidth ? "invisible" : ""
          }`}
        >
          <div>
            {/*<Link href="/">
              <a
                className="showtime-header-link mr-5 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Most liked button click");
                }}
              >
                Home
              </a>
              </Link>*/}
            {context.myProfile && (
              <span className="relative">
                <Link href="/activity">
                  <a
                    className="showtime-header-link mr-5 text-sm md:text-base"
                    onClick={() => {
                      mixpanel.track("Activity button click");
                    }}
                  >
                    Activity
                  </a>
                </Link>
                <div
                  className="absolute -top-1 right-2 bg-stpink rounded text-white flex items-center"
                  style={{ fontSize: 7, padding: "0px 2px" }}
                >
                  New!
                </div>
              </span>
            )}
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
            <Link href="/leaderboard">
              <a
                className="showtime-header-link mr-5 text-sm md:text-base"
                onClick={() => {
                  mixpanel.track("Leaderboard button click");
                }}
              >
                Leaderboard
              </a>
            </Link>
          </div>
          {context.isMobile && context.user && context.myProfile !== undefined && (
            <div className="flex-shrink">
              <NotificationsBtn />
            </div>
          )}
        </div>
        {/* End mobile-only menu */}
      </header>
    </>
  );
};

export default Header;
