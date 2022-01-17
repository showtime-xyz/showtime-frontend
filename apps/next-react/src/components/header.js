import AppContext from "@/context/app-context";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/useProfile";
import Tippy from "@tippyjs/react";
import mixpanel from "mixpanel-browser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import HeaderDropdown from "./HeaderDropdown";
import { CompassIconOutline, CompassIconSolid } from "./Icons/CompassIcon";
import { FireIconOutline, FireIconSolid } from "./Icons/FireIcon";
import { HomeIconOutline, HomeIconSolid } from "./Icons/HomeIcon";
import PlusIcon from "./Icons/PlusIcon";
import ShowtimeIcon from "./Icons/ShowtimeIcon";
import WalletIcon from "./Icons/WalletIcon";
import MintingBanner from "./MintingBanner";
import ModalLogin from "./ModalLogin";
import NotificationsBtn from "./NotificationsBtn";
import SearchBar from "./SearchBar";
import Button from "./UI/Buttons/Button";
import MintModal from "./UI/Modals/MintModal";

const Header = () => {
  const { asPath } = useRouter();
  const context = useContext(AppContext);
  const { isAuthenticated } = useAuth();
  const { myProfile } = useProfile();
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  const renderModalLogin = typeof document !== "undefined";
  const renderMintModal = typeof document !== "undefined" && isAuthenticated;

  return (
    <>
      {renderModalLogin ? (
        <ModalLogin
          isOpen={context.loginModalOpen}
          setEditModalOpen={context.setLoginModalOpen}
        />
      ) : null}
      {renderMintModal ? (
        <MintModal
          open={mintModalOpen}
          onClose={() => setMintModalOpen(false)}
        />
      ) : null}
      <MintingBanner openMintModal={() => setMintModalOpen(true)} />
      <header className="px-4 pt-3 sm:py-3 bg-white dark:bg-black w-full border-b border-gray-200 dark:border-gray-800 sticky top-0 z-1">
        <div className="max-w-screen-2xl 2xl:max-w-none sm:px-3 mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center space-x-4">
              <Link href="/">
                <a
                  className="flex flex-shrink-0 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                  onClick={async () => {
                    mixpanel.track("Logo button click");
                    await context.setToggleRefreshFeed(
                      !context.toggleRefreshFeed
                    );
                  }}
                >
                  <ShowtimeIcon className="rounded-lg overflow-hidden w-5 h-5 fill-black dark:fill-white" />
                </a>
              </Link>
              <SearchBar propagateSearchState={setSearchBarOpen} />
            </div>
            {/* Start desktop-only menu */}
            <div className="hidden flex-1 md:flex md:items-center md:justify-center mr-6 md:mr-0 items-center font-normal space-x-4">
              <Tippy content="Feed">
                <div>
                  <Link href="/">
                    <a
                      className={`text-sm md:text-base flex items-center space-x-2 ${
                        asPath == "/"
                          ? "bg-gradient-to-bl from-violet-900 via-violet-500 to-violet-300 text-white"
                          : "text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                      } rounded-full py-3 -my-2 px-3 -mx-1 transition`}
                      onClick={() => mixpanel.track("Feed button click")}
                    >
                      {asPath == "/" ? (
                        <HomeIconSolid className="w-5 h-5" />
                      ) : (
                        <HomeIconOutline className="w-5 h-5" />
                      )}
                    </a>
                  </Link>
                </div>
              </Tippy>
              <Tippy content="Discover">
                <div>
                  <Link href="/c/showtime-marketplace">
                    <a
                      className={`text-sm md:text-base flex items-center space-x-2 ${
                        asPath == "/c/showtime-marketplace"
                          ? "bg-gradient-to-bl from-violet-900 via-violet-500 to-violet-300 text-white"
                          : "text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                      } rounded-full py-3 -my-2 px-3 -mx-1 transition`}
                      onClick={() => mixpanel.track("Discover button click")}
                    >
                      {asPath == "/c/showtime-marketplace" ? (
                        <CompassIconSolid className="w-5 h-5" />
                      ) : (
                        <CompassIconOutline className="w-5 h-5" />
                      )}
                    </a>
                  </Link>
                </div>
              </Tippy>
              <Tippy content="Trending">
                <div>
                  <Link href="/trending">
                    <a
                      className={`text-sm md:text-base flex items-center space-x-2 ${
                        asPath == "/trending"
                          ? "bg-gradient-to-bl from-violet-900 via-violet-500 to-violet-300 text-white"
                          : "text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                      } rounded-full py-3 -my-2 px-3 -mx-1 transition`}
                      onClick={() => mixpanel.track("Trending button click")}
                    >
                      {asPath == "/trending" ? (
                        <FireIconSolid className="w-5 h-5" />
                      ) : (
                        <FireIconOutline className="w-5 h-5" />
                      )}
                    </a>
                  </Link>
                </div>
              </Tippy>
            </div>
            {/* End desktop-only menu */}

            <div
              className={`flex-1 flex items-center justify-end ${
                isSearchBarOpen ? "hidden" : ""
              }`}
            >
              {isAuthenticated && myProfile && (
                <div className="flex-shrink ml-5">
                  <NotificationsBtn />
                </div>
              )}
              {isAuthenticated && myProfile ? (
                <>
                  <div className={"ml-5"}>
                    <Button
                      onClick={() => setMintModalOpen(true)}
                      style="primary"
                      className="!p-2.5 md:!px-3.5 md:!py-1.5 !rounded-full"
                    >
                      <span className="hidden md:inline">Create</span>
                      <PlusIcon className="w-4 h-4 md:hidden" />
                    </Button>
                  </div>
                  <HeaderDropdown />
                </>
              ) : (
                <Button
                  style="primary"
                  className="space-x-2 !rounded-full"
                  onClick={() =>
                    context.setLoginModalOpen(!context.loginModalOpen)
                  }
                >
                  <WalletIcon className="w-5 h-5" />
                  <span className="font-bold text-sm">Sign&nbsp;in</span>
                </Button>
              )}
            </div>
          </div>

          {/* Start mobile-only menu */}
          <div className="overflow-hidden">
            <div className="-mx-4 mt-4 md:hidden">
              <div className="flex-1 flex justify-around font-normal -mx-2">
                <Link href="/">
                  <a
                    className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 border-b-2 pb-3 px-2 -mx-2 group ${
                      asPath == "/"
                        ? "border-gray-800"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    onClick={() => mixpanel.track("Feed button click")}
                  >
                    <div
                      className={`${
                        asPath == "/"
                          ? "bg-gray-100 dark:bg-gray-900"
                          : "group-hover:bg-gray-100 dark:group-hover:bg-gray-900"
                      } p-2 -m-2 rounded-full transition`}
                    >
                      {asPath == "/" ? (
                        <HomeIconSolid className="w-5 h-5" />
                      ) : (
                        <HomeIconOutline className="w-5 h-5" />
                      )}
                    </div>
                  </a>
                </Link>
                <Link href="/c/showtime-marketplace">
                  <a
                    className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 border-b-2 pb-3 px-2 -mx-2 group ${
                      asPath == "/c/showtime"
                        ? "border-gray-800"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    onClick={() => mixpanel.track("Discover button click")}
                  >
                    <div
                      className={`${
                        asPath == "/c/showtime-marketplace"
                          ? "bg-gray-100 dark:bg-gray-900"
                          : "group-hover:bg-gray-100 dark:group-hover:bg-gray-900"
                      } p-2 -m-2 rounded-full transition`}
                    >
                      {asPath == "/c/showtime-marketplace" ? (
                        <CompassIconSolid className="w-5 h-5" />
                      ) : (
                        <CompassIconOutline className="w-5 h-5" />
                      )}
                    </div>
                  </a>
                </Link>
                <Link href="/trending">
                  <a
                    className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 border-b-2 pb-3 px-2 -mx-2 group ${
                      asPath == "/trending"
                        ? "border-gray-800"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    onClick={() => mixpanel.track("Trending button click")}
                  >
                    <div
                      className={`${
                        asPath == "/trending"
                          ? "bg-gray-100 dark:bg-gray-900"
                          : "group-hover:bg-gray-100 dark:group-hover:bg-gray-900"
                      } p-2 -m-2 rounded-full transition`}
                    >
                      {asPath == "/trending" ? (
                        <FireIconSolid className="w-5 h-5" />
                      ) : (
                        <FireIconOutline className="w-5 h-5" />
                      )}
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          {/* End mobile-only menu */}
        </div>
      </header>
    </>
  );
};

export default Header;
