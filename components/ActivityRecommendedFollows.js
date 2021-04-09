import React, { useEffect, useState, useContext } from "react";
import AppContext from "../context/app-context";
import RecommendedFollowItem from "./RecommendedFollowItem";

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
      <div className="mt-1 py-3 text-gray-600 border-b border-gray-300 flex justify-between align-start">
        <div className="py-2">Recommended for You</div>
        <div />
        {!loading && (
          <div
            onClick={followAllClicked ? () => {} : handleFollowAll}
            className={`px-4 py-1 text-sm rounded-full border w-max flex items-center justify-center hover:opacity-80 cursor-pointer ${
              followAllClicked
                ? "border-gray-300 text-black"
                : "border-stpink bg-stpink text-white"
            }`}
          >
            {followAllClicked ? "Followed All" : "Follow All"}
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
