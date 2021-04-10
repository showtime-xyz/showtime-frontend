import React, { useEffect, useState, useContext } from "react";
import AppContext from "../context/app-context";
import RecommendedFollowItem from "./RecommendedFollowItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ActivityRecommendedFollows() {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [recommendedFollows, setRecommendedFollows] = useState(null);
  const removeRecommendation = async (recommendation) => {
    const newRecommendedFollows = recommendedFollows.filter(
      (recFollow) => recFollow.profile_id !== recommendation.profile_id
    );
    setRecommendedFollows(newRecommendedFollows);
    await fetch("/api/declinefollowsuggestion", {
      method: "post",
      body: JSON.stringify({ profileId: recommendation.profile_id }),
    });
  };

  const getActivityRecommendedFollows = async () => {
    setLoading(true);
    const result = await fetch(`/api/getactivityrecommendedfollows`, {
      method: "post",
      body: JSON.stringify({}),
    });
    const { data } = await result.json();
    setRecommendedFollows(data);
    setLoading(false);
    // recache for next call
    await fetch("/api/getactivityrecommendedfollows", {
      method: "post",
      body: JSON.stringify({
        recache: true,
      }),
    });
  };
  useEffect(() => {
    getActivityRecommendedFollows();
  }, []);

  // get more recs when we reject all recs
  useEffect(() => {
    if (recommendedFollows?.length === 0) {
      getActivityRecommendedFollows();
    }
  }, [recommendedFollows?.length]);

  const [followAllClicked, setFollowAllClicked] = useState(false);
  const handleFollowAll = async () => {
    setFollowAllClicked(true);

    const newProfiles = recommendedFollows.filter(
      (item) =>
        !context.myFollows.map((f) => f.profile_id).includes(item.profile_id)
    );

    // UPDATE CONTEXT
    context.setMyFollows([...newProfiles, ...context.myFollows]);

    // Post changes to the API
    await fetch(`/api/bulkfollow`, {
      method: "post",
      body: JSON.stringify(newProfiles.map((item) => item.profile_id)),
    });
  };

  return (
    <div>
      <div className="border-b border-gray-200 flex items-center pb-2 px-4">
        <div className="m-2 flex-grow">Suggested for You</div>
        <div />
        {!loading && (
          <div>
            <div
              onClick={followAllClicked ? () => {} : handleFollowAll}
              className={`px-4 py-1 text-sm rounded-full border w-max flex items-center justify-center hover:opacity-80 cursor-pointer ${
                followAllClicked
                  ? "border-gray-300 text-black"
                  : "border-stpink bg-stpink text-white"
              }`}
            >
              {followAllClicked ? (
                "Followed All"
              ) : (
                <div>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Follow All
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {!loading &&
        recommendedFollows &&
        recommendedFollows.map((recFollow) => (
          <RecommendedFollowItem
            item={recFollow}
            liteVersion
            removeRecommendation={removeRecommendation}
            closeModal={() => {}}
            key={recFollow?.profile_id}
          />
        ))}
      {!loading && recommendedFollows && recommendedFollows.length === 0 && (
        <div className="flex flex-col items-center justify-center my-8">
          <div className="text-gray-400">No more recommendations.</div>
          <div className="text-gray-400">(Refresh for more!)</div>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center w-full my-8">
          <div className="loading-card-spinner" />
        </div>
      )}
    </div>
  );
}
