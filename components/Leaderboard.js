import React from "react";

const Leaderboard = ({ topCreators }) => {
  return (
    <div id="leaderboard">
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-6xl">
          Top Creators
        </div>
      </div>
      <div className="flex flex-wrap -m-4 mx-auto" style={{ maxWidth: 800 }}>
        {topCreators.map((creator) => {
          return (
            <div
              key={creator.profile_id}
              className="pt-4 pb-4 w-full flex justify-center items-center border-b-2 border-gray-600"
            >
              <img
                alt="artist"
                className="rounded-full w-12 h-12 md:w-24 md:h-24 object-cover object-center flex-grow-0"
                src={creator.image_url}
              />
              <div className="pl-2 md:pl-8 flex-grow-0">
                <h3 className="text-white font-bol text-xl md:text-3xl">
                  {creator.name ? creator.name : "Unnamed"}
                </h3>
              </div>
              <div className="text-right flex-grow ">
                <div className="float-right flex flex-inline">
                  <img
                    style={{ paddingRight: 6, marginTop: 3 }}
                    src={"/icons/heart-white-outline.svg"}
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
