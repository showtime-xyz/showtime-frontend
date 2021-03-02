import React from "react";
import _ from "lodash";
import Link from "next/link";

const FollowGrid = ({ people }) => {
  return (
    <div className="mb-8 flex flex-row flex-wrap">
      {people.map((profile) => {
        return (
          <div key={profile.wallet_address} className="mr-2 mb-1">
            <Link href="/[profile]" as={`/${profile.wallet_address}`}>
              <a className="flex flex-row items-center showtime-follower-button rounded-full">
                <div>
                  <img
                    alt={profile.name}
                    src={
                      profile.img_url
                        ? profile.img_url
                        : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                    }
                    className="rounded-full mr-1"
                    style={{ height: 24, width: 24 }}
                  />
                </div>
                <div style={{ fontWeight: 400 }}>
                  {profile.name ? profile.name : "Unnamed"}
                </div>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default FollowGrid;
