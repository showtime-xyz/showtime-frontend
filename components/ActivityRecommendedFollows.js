import React, { useEffect, useState } from "react";
import RecommendedFollowItem from "./RecommendedFollowItem";

export default function ActivityRecommendedFollows() {
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

  return (
    <div>
      <div className="mt-5 py-2 text-gray-500 text-lg border-b items-center border-gray-300 flex">
        <div>Recommended for You</div>
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
