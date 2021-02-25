import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

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
}) {
  const cleanNumFollowers = numFollowers
    ? Number(numFollowers).toLocaleString()
    : 0;
  const cleanNumFollowing = numFollowing
    ? Number(numFollowing).toLocaleString()
    : 0;

  return (
    <div>
      <div className="p-6 rounded-xl bg-white m-4 md:m-0 md:w-max flex flex-col md:flex-row justify-center items-center md:items-stretch">
        <div className="w-14 h-14 md:w-12 md:h-12 flex items-center justify-center rounded-full my-2 md:my-0">
          <img
            src={profileImageUrl}
            className="w-full h-full overflow-hidden rounded-full"
          />
        </div>
        <GraySeparator />
        <div
          className="flex flex-col justify-center my-2 md:my-0 items-center md:items-start cursor-pointer"
          onClick={showFollowing}
        >
          <div className="text-sm text-gray-500">Following</div>
          <div className="text-xl">{cleanNumFollowing}</div>
        </div>
        <ClearSeparator />
        <div
          className="flex flex-col justify-center my-2 md:my-0 items-center md:items-start cursor-pointer"
          onClick={showFollowers}
        >
          <div className="text-sm text-gray-500">Followers</div>
          <div className="text-xl">{cleanNumFollowers}</div>
        </div>
        {!isMyProfile && (
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
                {!isFollowed && <span className="pr-3 text-lg">＋</span>}
                <span className="text-lg">
                  {isFollowed ? "Following" : "Follow"}
                </span>
              </div>
            </div>
          </>
        )}
        {/* <div className="flex flex-col justify-center items-center w-max h-max md:ml-6 my-2 md:my-0">
          <FontAwesomeIcon size="lg" icon={faEllipsisH} color="#bbb" />
        </div> */}
      </div>
    </div>
  );
}
