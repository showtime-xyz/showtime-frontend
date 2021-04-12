import React, { useRef, useContext } from "react";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import AppContext from "../context/app-context";

const GraySeparator = () => <div className="w-0.5 bg-gray-200 mx-6"></div>;
const ClearSeparator = () => <div className="w-0.5 mx-4"></div>;

export default function ProfileInfoPill({
  numFollowers,
  numFollowing,
  profileImageUrl,
  isMyProfile,
  isFollowed,
  onClickFollow,
  showFollowers,
  showFollowing,
  onClickPhoto,
  profileActions,
  hasEmailAddress,
}) {
  const context = useContext(AppContext);
  const cleanNumFollowers = numFollowers
    ? Number(numFollowers).toLocaleString()
    : 0;
  const cleanNumFollowing = numFollowing
    ? Number(numFollowing).toLocaleString()
    : 0;
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  const {
    editAccount,
    editPhoto,
    addWallet,
    addEmail,
    logout,
  } = profileActions;

  const actionButton = () => {
    return !isMyProfile ? (
      <>
        <div className="flex items-center justify-center my-2 md:my-0">
          <div
            className={`${
              isFollowed
                ? "bg-white text-black border-gray-300"
                : "bg-black text-white border-black"
            } rounded-full px-6 py-2 cursor-pointer border-2 hover:opacity-70 transition-all`}
            onClick={onClickFollow}
          >
            {!isFollowed && <span className="pr-2 text-md">＋</span>}
            <span className="text-base">
              {isFollowed ? "Following" : "Follow"}
            </span>
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="flex items-center justify-center my-2 md:my-0 relative">
          <div
            className="bg-white text-black border-black rounded-full px-6 py-2 cursor-pointer border-2 hover:opacity-70 transition-all"
            onClick={onClick}
          >
            <span className="text-base">Edit Profile</span>
          </div>
          <div
            ref={dropdownRef}
            className={`absolute text-center top-20 bg-white py-2 px-2 shadow-lg rounded-xl transition-all text-md transform ${
              isActive
                ? "visible opacity-1 translate-y-2"
                : "invisible opacity-0"
            }`}
            style={{ zIndex: 1 }}
          >
            <div
              className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
              onClick={() => {
                setIsActive(false);
                editAccount();
              }}
            >
              Edit Info
            </div>
            <div
              className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
              onClick={() => {
                setIsActive(false);
                editPhoto();
              }}
            >
              {context.myProfile &&
              context.myProfile.img_url &&
              !context.myProfile.img_url.includes("opensea-profile")
                ? "Edit Photo"
                : "Add Photo"}
            </div>
            <div
              className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
              onClick={() => {
                setIsActive(false);
                addWallet();
              }}
            >
              Add Wallet
            </div>
            {hasEmailAddress ? null : (
              <div
                className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
                onClick={() => {
                  setIsActive(false);
                  addEmail();
                }}
              >
                Add Email
              </div>
            )}
            <div
              className="py-2 px-8 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
              onClick={() => {
                setIsActive(false);
                logout();
              }}
            >
              Log Out
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="pt-4 flex sm:hidden justify-center">{actionButton()}</div>
      <div
        className={` shadow-lg px-6 relative py-4 rounded-xl  bg-white md:w-max flex flex-row justify-center items-center sm:items-stretch mt-8 mb-4`}
      >
        <div
          className="flex flex-col justify-center my-2 md:my-0 items-center md:items-start cursor-pointer hover:opacity-60  transition-all"
          onClick={showFollowing}
        >
          <div className="text-sm text-gray-500">Following</div>
          <div className="text-xl">{cleanNumFollowing}</div>
        </div>
        <ClearSeparator />
        <div
          className={
            "flex flex-col justify-center my-2 md:my-0 items-center md:items-start cursor-pointer hover:opacity-60  transition-all"
          }
          onClick={showFollowers}
        >
          <div className="text-sm text-gray-500">Followers</div>
          <div className="text-xl">{cleanNumFollowers}</div>
        </div>
        <div className="hidden sm:flex">
          <GraySeparator />
          {actionButton()}
        </div>
      </div>
    </>
  );
}
