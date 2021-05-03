import React from "react";
import LeaderboardItemV2 from "@/components/LeaderboardItemV2";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faPlus } from "@fortawesome/free-solid-svg-icons";

const TrendingCreators = ({
  shownLeaderboardItems,
  isLoading,
  showAllLeaderboardItems,
  setShowAllLeaderboardItems,
}) => {
  return (
    <>
      <div className="bg-white sm:rounded-lg shadow-md pt-3 ">
        <div className="border-b border-gray-200 flex items-center pb-2 pl-4 pr-2 flex-row">
          <div className="my-2 flex-grow">
            <span className="sm:hidden">Trending </span>Creators
          </div>
          {/*!isLoading && (
            <div>
              <div className="bg-white text-black border border-gray-400 rounded-full py-2 px-4 text-sm flex flex-row hover:opacity-70 transition-all cursor-pointer">
                <div className="mr-1">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div>Follow All</div>
              </div>
            </div>
          )*/}
        </div>

        {isLoading ? (
          <div className="p-6 mx-auto flex flex-row">
            <div className="flex-grow"></div>
            <LoadingSpinner />
            <div className="flex-grow"></div>
          </div>
        ) : (
          shownLeaderboardItems.map((item, index) => (
            <LeaderboardItemV2
              key={item?.profile_id}
              item={item}
              index={index}
            />
          ))
        )}
      </div>

      {!isLoading && (
        <div className="flex flex-row items-center my-2 justify-center pb-10 sm:pb-0">
          {!showAllLeaderboardItems ? (
            <div
              className="bg-white text-center px-6 py-2 mt-2 flex items-center w-max shadow-md rounded-full hover:text-stpink  cursor-pointer"
              onClick={() => {
                setShowAllLeaderboardItems(true);
              }}
            >
              <div className="mr-2 text-sm">Show More</div>
              <div>
                <FontAwesomeIcon style={{ height: 14 }} icon={faArrowDown} />
              </div>
            </div>
          ) : null}
        </div>
      )}
      <div className="sm:hidden mx-4 my-6">Trending Art</div>
    </>
  );
};

export default TrendingCreators;
