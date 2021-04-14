import React from "react";
import { truncateWithEllipses } from "../lib/utilities";
import { format } from "date-fns";
import FollowButton from "./FollowButton";
import Link from "next/link";

export default function UserTimestampCard({
  timestamp,
  item,
  closeModalCallback,
}) {
  const name = item.owner_name;
  const imageUrl = item.owner_img_url;
  const profileId = item.owner_id;
  return (
    <div className="flex items-center md:w-max max-w-full border-2 border-gray-300 rounded-xl p-4">
      <div className="mr-4">
        <Link
          href="/[profile]"
          as={
            item.owner_username
              ? `/${item.owner_username}`
              : `/${item.owner_address}`
          }
        >
          <a onClick={closeModalCallback}>
            <img
              alt={name}
              src={
                imageUrl
                  ? imageUrl
                  : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
              className="rounded-full"
              style={{ height: 48, width: 48 }}
            />
          </a>
        </Link>
      </div>
      <div className="">
        <div className="flex flex-col md:flex-row md:items-center w-full">
          <div className="text-lg mr-3">
            <Link
              href="/[profile]"
              as={
                item.owner_username
                  ? `/${item.owner_username}`
                  : `/${item.owner_address}`
              }
            >
              <a onClick={closeModalCallback} className="hover:text-stpink">
                {truncateWithEllipses(name, 20)}
              </a>
            </Link>
          </div>
          {profileId && (
            <div className="flex items-center py-2 md:py-1 w-max text-black">
              <FollowButton
                item={{ profile_id: profileId, follower_count: 0 }}
                followerCount={0}
                setFollowerCount={() => {}}
              />
            </div>
          )}
        </div>
        {timestamp && (
          <div className="text-gray-500 text-sm">
            {format(new Date(timestamp), "PPp")}
          </div>
        )}
      </div>
    </div>
  );
}
