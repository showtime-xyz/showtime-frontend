import React, { useState, useRef, useContext } from "react";
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

  const { editAccount, editPhoto, addWallet, logout } = profileActions;

  return (
    <div
      className={`p-6 rounded-xl  bg-white md:w-max flex flex-col md:flex-row justify-center items-center md:items-stretch mt-8 mb-4 ${
        context.isMobile ? null : "hover:shadow-xl"
      }`}
      style={{
        // boxShadow: "0px 4px 10px 6px rgba(34, 48, 67, 3%)",
        border: "1px solid #ddd",
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      <div
        className={`w-14 h-14 md:w-12 md:h-12 flex items-center justify-center rounded-full my-2 md:my-0 ${
          isMyProfile ? "cursor-pointer hover:opacity-60 transition" : ""
        }`}
        onClick={isMyProfile ? onClickPhoto : null}
      >
        <img
          src={profileImageUrl}
          className="w-full h-full overflow-hidden rounded-full"
        />
      </div>
      <GraySeparator />
      <div
        className="flex flex-col justify-center my-2 md:my-0 items-center md:items-start cursor-pointer hover:opacity-60 transition"
        onClick={showFollowing}
      >
        <div className="text-sm text-gray-500">Following</div>
        <div className="text-xl">{cleanNumFollowing}</div>
      </div>
      <ClearSeparator />
      <div
        className={
          "flex flex-col justify-center my-2 md:my-0 items-center md:items-start cursor-pointer hover:opacity-60 transition"
        }
        onClick={showFollowers}
      >
        <div className="text-sm text-gray-500">Followers</div>
        <div className="text-xl">{cleanNumFollowers}</div>
      </div>
      {!isMyProfile ? (
        <>
          <GraySeparator />
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
          <GraySeparator />
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
                className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
                onClick={() => {
                  setIsActive(false);
                  editAccount();
                }}
              >
                Edit Info
              </div>
              <div
                className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
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
                className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
                onClick={() => {
                  setIsActive(false);
                  addWallet();
                }}
              >
                Add Wallet
              </div>
              <div
                className="py-2 px-8 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
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
      )}
    </div>
  );
}
