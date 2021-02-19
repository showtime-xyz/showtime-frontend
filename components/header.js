import React, { useContext } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";
import ModalLogin from "./ModalLogin";

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
                <div className="mx-2" style={{ fontWeight: 600 }}>
                  Showtime
                </div>
              </a>
            </Link>
          </div>
          {/* Start desktop-only menu */}
          <div className="hidden md:block ml-8" style={{ fontWeight: 400 }}>
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
                    <div className="">
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
                <a
                  className="showtime-login-button-solid text-sm px-3 py-2 md:text-base  md:px-3 md:py-2"
                  onClick={() => {
                    context.setLoginModalOpen(!context.loginModalOpen);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {context.windowSize && context.windowSize.width > 500
                    ? "Sign in / Sign up"
                    : "Sign in"}
                </a>
              </>
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
