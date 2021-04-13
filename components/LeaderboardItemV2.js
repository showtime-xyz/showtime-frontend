import React, { useState } from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";

const LeaderboardItemV2 = ({ item, index }) => {
  const [followerCount, setFollowerCount] = useState();
  return (
    <div key={item.profile_id} className="border-b px-6 py-4">
      <div className="flex flex-row items-center">
        <div className="relative mr-2 w-16">
          <Link href="/[profile]" as={`/${item?.username || item.address}`}>
            <div className="cursor-pointer">
              <img
                src={
                  item?.img_url
                    ? item?.img_url
                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                }
                className="rounded-full h-12 w-12 hover:opacity-90"
              />
            </div>
          </Link>
          <div
            className="absolute rounded-full bg-white text-center self-center h-6 w-6"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.16)",
              fontSize: 13,
              fontWeight: 500,
              paddingTop: 1,

              color: "#010101",
              bottom: 0,
              right: 0,
            }}
          >
            {index + 1}
          </div>
        </div>
        <div className="flex flex-grow">
          <Link href="/[profile]" as={`/${item?.username || item.address}`}>
            <div className="hover:text-stpink cursor-pointer">
              {item?.name || formatAddressShort(item.address) || "Unnamed"}
            </div>
          </Link>
        </div>
        <div className="flex">
          <FollowButton
            item={item}
            followerCount={followerCount}
            setFollowerCount={setFollowerCount}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItemV2;
