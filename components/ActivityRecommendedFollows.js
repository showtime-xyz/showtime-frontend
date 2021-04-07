import React, { useEffect, useState } from "react";
import RecommendedFollowItem from "./RecommendedFollowItem";

export default function ActivityRecommendedFollows() {
  const [recommendedFollows, setRecommendedFollows] = useState(null);
  useEffect(() => {
    const getActivityRecommendedFollows = async () => {
      const result = await fetch(`/api/getactivityrecommendedfollows`, {
        method: "post",
        body: JSON.stringify({}),
      });
      const { data } = await result.json();
      console.log(data);
      setRecommendedFollows(data);
      // recache for next call
      await fetch("/api/getactivityrecommendedfollows", {
        method: "post",
        body: JSON.stringify({
          recache: true,
        }),
      });
    };
    getActivityRecommendedFollows();
  }, []);
  return (
    <div>
      {recommendedFollows &&
        recommendedFollows.map((recFollow) => (
          <RecommendedFollowItem
            item={recFollow}
            liteVersion
            closeModal={() => {}}
          />
        ))}
    </div>
  );
}
