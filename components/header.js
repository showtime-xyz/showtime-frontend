import React, { useContext } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import SearchBar from "./SearchBar";
import AppContext from "../context/app-context";
import ModalLogin from "./ModalLogin";
import NotificationsBtn from "./NotificationsBtn";
import CappedWidth from "./CappedWidth";

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
      <header
        className="px-2 py-1 sm:py-2 bg-white w-full  shadow-md"
        style={{
          zIndex: 1,
          position: "sticky",
          top: 0,
        }}
      >
        <CappedWidth>
          <div className="flex flex-row items-center px-3">
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
            {!context.isMobile ? (
              <div className="flex-grow" style={{ width: "100%" }}>
                <SearchBar />
              </div>
            ) : (
              <div className="flex-grow"></div>
            )}
            <div
              className="hidden md:flex mr-6 items-center"
              style={{ fontWeight: 400 }}
            >
              <Link href="/c/[collection]" as="/c/spotlights">
                <a
                  className="showtime-header-link ml-6 text-sm md:text-base"
                  onClick={() => {
                    mixpanel.track("Discover button click");
                  }}
                >
                  Discover
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
                <div className="flex-shrink ml-5">
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
                    className="text-base flex flex-row items-center hover:text-stpink"
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
                          style={{ height: 30, width: 30, minWidth: 30 }}
                        />
                      </div>
                      <div
                        className="text-sm sm:text-base"
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: context.gridWidth < 500 ? 100 : 200,
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
                    className="flex text-sm md:text-base text-black cursor-pointer hover:text-stpink hover:border-stpink text-center"
                    onClick={() => {
                      context.setLoginModalOpen(!context.loginModalOpen);
                    }}
                  >
                    Sign&nbsp;in
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Start mobile-only menu */}
          {context.isMobile && (
            <div className="flex md:hidden justify-between items-center pb-1 px-3">
              <div>
                <Link href="/c/[collection]" as="/c/spotlights">
                  <a
                    className="showtime-header-link mr-5 text-sm md:text-base"
                    onClick={() => {
                      mixpanel.track("Discover button click");
                    }}
                  >
                    Discover
                  </a>
                </Link>
                <Link href="/leaderboard">
                  <a
                    className="showtime-header-link mr-5 text-sm md:text-base"
                    onClick={() => {
                      mixpanel.track("Leaderboard button click");
                    }}
                  >
                    Trending
                  </a>
                </Link>
              </div>
              <div className="flex-grow" style={{ width: "100%" }}>
                <SearchBar />
              </div>
              {context.isMobile &&
                context.user &&
                context.myProfile !== undefined && (
                  <div className="flex-shrink ml-4">
                    <NotificationsBtn />
                  </div>
                )}
            </div>
          )}
          {/* End mobile-only menu */}
        </CappedWidth>
      </header>
    </>
  );
};

export default Header;
