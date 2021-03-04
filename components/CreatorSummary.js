import React from "react";
import Link from "next/link";

export default function CreatorSummary() {
  return (
    <>
      <Link href="/[profile]" as={`/${item.creator_address}`}>
        <a
          className="flex flex-row items-center showtime-follower-button rounded-full"
          onClick={() => {
            if (setEditModalOpen) {
              setEditModalOpen(false);
            }
          }}
        >
          <div>
            <img
              alt={item.creator_name}
              src={
                item.creator_img_url
                  ? item.creator_img_url
                  : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
              className="rounded-full mr-1"
              style={{ height: 24, width: 24 }}
            />
          </div>
          <div style={{ fontWeight: 400 }}>
            {truncateWithEllipses(item.creator_name, 26)}
          </div>
        </a>
      </Link>
    </>
  );
}
