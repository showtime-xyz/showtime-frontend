import React from "react";
import Link from "next/link";

const Leaderboard = ({ topCreators }) => {
  return (
    <div id="leaderboard">
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mb-8">
          Top Creators
        </div>
      </div>
      <div className="flex flex-wrap -m-4 mx-auto" style={{ maxWidth: 800 }}>
        {topCreators.map((creator) => {
          return (
            <div
              key={creator.profile_id}
              className="pt-4 pb-4 w-full flex justify-center items-center border-b-2 border-gray-200"
            >
              <Link href="/p/[slug]" as={`/p/${creator.address}`}>
                <a className="flex flex-row items-center flex-grow">
                  <img
                    alt="artist"
                    className="rounded-full w-12 h-12 md:w-24 md:h-24 object-cover object-center flex-grow-0"
                    src={
                      creator.image_url
                        ? creator.image_url
                        : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                    }
                  />
                  <div className="pl-2 md:pl-8 flex-grow-0">
                    <h3 className="md:text-3xl">
                      <div className="showtime-link">
                        {creator.name ? creator.name : "Unnamed"}
                      </div>
                    </h3>
                  </div>
                </a>
              </Link>
              <div className="text-right flex-shrink text-right">
                <div
                  className="float-right flex flex-inline text-right text-sm"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <img
                    style={{ paddingRight: 6, marginTop: 3 }}
                    src={"/icons/heart-black-outline.svg"}
                    alt="heart"
                  />
                  {creator.like_count}{" "}
                  {creator.like_count > 1 ? "likes" : "like"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
