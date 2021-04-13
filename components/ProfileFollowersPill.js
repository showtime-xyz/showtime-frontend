import React, { useContext, useRef } from "react";
import AppContext from "../context/app-context";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";

const ProfileFollowersPill = ({
  following,
  followers,
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
    <div className="opacity-100 bg-white rounded-lg shadow-md px-4 py-4 md:py-3 text-center text-gray-900">
      <div className="flex flex-col md:flex-row text-center items-center">
        <div className="flex flex-row items-center">
          <div
            className={`flex-1 ${
              following?.length > 999 ? null : "w-28"
            }  flex flex-col md:flex-row items-center cursor-pointer hover:opacity-80 mb-4 md:mb-0`}
            onClick={() => {
              setShowFollowing(true);
            }}
          >
            <div className="flex-grow"></div>
            <div className="text-lg mr-2">
              {following && following.length !== null
                ? Number(following.length).toLocaleString()
                : null}
            </div>
            <div className="text-sm text-gray-500">Following</div>
            <div className="flex-grow"></div>
          </div>
          {!context.isMobile && (
            <div
              className="border-r border-gray-400 mx-4"
              style={{ width: 2, height: 20 }}
            ></div>
          )}
          <div
            className={`flex-1 ${
              followers?.length > 999 ? null : "w-28"
            }  flex flex-col md:flex-row items-center cursor-pointer hover:opacity-80 mb-4 md:mb-0`}
            onClick={() => {
              setShowFollowers(true);
            }}
          >
            <div className="flex-grow"></div>
            <div className="text-lg mr-2">
              {followers && followers.length !== null
                ? Number(followers.length).toLocaleString()
                : null}
            </div>
            <div className="text-sm text-gray-500">Followers</div>
            <div className="flex-grow"></div>
          </div>
          {!context.isMobile && (
            <div
              className="border-r border-gray-400 mx-4"
              style={{ width: 2, height: 20 }}
            ></div>
          )}
        </div>
        <div className="flex-1 w-36 flex flex-row items-center relative">
          <div className="flex-grow"></div>

          {!isMyProfile ? (
            <div
              className={`w-32 py-2 rounded-full text-sm cursor-pointer hover:opacity-80 transition-all ${
                isFollowed
                  ? "bg-white text-gray-600 border border-gray-500"
                  : "bg-black text-white border border-black"
              }  `}
              onClick={
                context.user
                  ? isFollowed
                    ? handleUnfollow
                    : handleFollow
                  : handleLoggedOutFollow
              }
            >
              {isFollowed
                ? "Following"
                : followingMe
                ? "Follow Back"
                : "Follow"}
            </div>
          ) : (
            <>
              <div
                className="w-32 py-2 rounded-full text-sm cursor-pointer hover:opacity-80 transition-all bg-white text-black border border-black"
                onClick={onEditProfileClick}
              >
                Edit Profile
              </div>

              <div
                ref={dropdownRef}
                className={`absolute text-center top-12 bg-white py-2 px-2 shadow-lg rounded-xl transition-all text-md transform ${
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

          <div className="flex-grow"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFollowersPill;
