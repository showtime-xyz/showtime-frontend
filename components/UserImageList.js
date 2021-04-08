import Link from "next/link";
import React from "react";

export default function UserImageList({ users }) {
  return (
    <>
      {users.map((user) => (
        <Link
          href="/[profile]"
          as={`/${user?.username || user?.wallet_address}`}
          key={user.wallet_address}
        >
          <a className="mr-1">
            <img
              src={
                user.img_url ||
                "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
              className="h-8 w-8 rounded-full"
            />
          </a>
        </Link>
      ))}
    </>
  );
}
