import React, { useContext, useRef } from "react";
import AppContext from "../context/app-context";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";

const ProfileFollowersPill = ({
  following,
  following_count,
  followers,
  followers_count,
  isFollowed,
  isMyProfile,
  followingMe,
  handleUnfollow,
  handleFollow,
  handleLoggedOutFollow,
  hasEmailAddress,
  setShowFollowers,
  setShowFollowing,
  editAccount,
  editPhoto,
  addWallet,
  addEmail,
  logout,
}) => {
  const context = useContext(AppContext);
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);

  const onEditProfileClick = () => setIsActive(!isActive);

  return (
    <div className="text-center text-gray-900 ">
      <div className="flex-1 flex flex-row items-center relative">
        {!isMyProfile ? (
          <div
            className={`w-32 py-2 rounded-full text-sm cursor-pointer shadow-md md:shadow-none  transition-all ${
              isFollowed
                ? "bg-white text-gray-600 border md:border-gray-500"
                : "bg-black text-white border border-white md:border-black"
            }  `}
            onClick={
              context.user
                ? isFollowed
                  ? handleUnfollow
                  : handleFollow
                : handleLoggedOutFollow
            }
          >
            {isFollowed ? "Following" : followingMe ? "Follow Back" : "Follow"}
          </div>
        ) : (
          <>
            <div
              className="w-32 py-2 rounded-full text-sm cursor-pointer shadow-md md:shadow-none transition-all bg-white text-black border border-white md:border-black"
              onClick={onEditProfileClick}
            >
              Edit Profile
            </div>

            <div
              ref={dropdownRef}
              className={`absolute text-center top-12 -right-1 md:right-0 bg-white py-2 px-2 shadow-lg rounded-xl transition-all text-md transform ${
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileFollowersPill;
