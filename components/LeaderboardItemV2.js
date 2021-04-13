import React, { useState } from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";

const LeaderboardItemV2 = ({ item, index }) => {
  const [followerCount, setFollowerCount] = useState();
  return (
    <div key={item.profile_id} className="border-b p-6 ">
      <div className="flex flex-row items-center">
        <div className="relative  mr-4">
          <Link href="/[profile]" as={`/${item?.username || item.address}`}>
            <div className="cursor-pointer">
              <img
                src={
                  item?.img_url
                    ? item?.img_url
                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                }
                className="rounded-full h-16 w-16 hover:opacity-90"
              />
            </div>
          </Link>
          <div
            className="absolute rounded-full bg-white text-center self-center"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.16)",
              fontSize: 13,
              fontWeight: 500,
              paddingTop: 1,
              height: 24,
              width: 24,
              color: "#010101",
              bottom: 0,
              right: 0,
            }}
          >
            {index + 1}
          </div>
        </div>
        <div className="flex flex-grow flex-row">
          <div className="flex flex-col">
            <div>
              <Link href="/[profile]" as={`/${item?.username || item.address}`}>
                <div className="hover:text-stpink cursor-pointer mb-2">
                  {item?.name || formatAddressShort(item.address) || "Unnamed"}
                </div>
              </Link>
            </div>
            <div>follows likes</div>
          </div>
          <div className="flex-grow"></div>
          <div className="flex">
            <FollowButton
              item={item}
              followerCount={followerCount}
              setFollowerCount={setFollowerCount}
              black
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItemV2;
