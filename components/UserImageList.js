import Link from "next/link";
import React from "react";
import mixpanel from "mixpanel-browser";

export default function UserImageList({ users }) {
  return (
    <>
      {users.map((user) => (
        <Link
          href="/[profile]"
          as={`/${user?.username || user?.wallet_address}`}
          key={user.wallet_address}
        >
          <a
            className="mr-2"
            onClick={() => {
              mixpanel.track("Activity - Click on followed user");
            }}
          >
            <img
              src={
                user.img_url ||
                "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
              className="h-12 w-12 rounded-full"
            />
          </a>
        </Link>
      ))}
    </>
  );
}
