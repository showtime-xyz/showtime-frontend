import React, { useEffect, useState, useContext } from "react";
import AppContext from "../context/app-context";
import RecommendedFollowItem from "./RecommendedFollowItem";
import mixpanel from "mixpanel-browser";

export default function ActivityRecommendedFollows() {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [recommendedFollows, setRecommendedFollows] = useState([]);
  const removeRecommendation = async (recommendation) => {
    const newRecommendedFollows = recommendedFollows.filter(
      (recFollow) => recFollow.profile_id !== recommendation.profile_id
    );
    setRecommendedFollows(newRecommendedFollows);
    await fetch("/api/declinefollowsuggestion", {
      method: "post",
      body: JSON.stringify({ profileId: recommendation.profile_id }),
    });
    mixpanel.track("Remove follow recommendation");
  };
  const filterNewRecs = (newRecs, oldRecs, alreadyFollowed) => {
    // let filteredData = [];
    // await data.forEach((newItem) => {
    //   if (!activity.find((actItem) => actItem.id === newItem.id)) {
    //     filteredData.push(newItem);
    //   }
    // });
    return newRecs;
  };

  const [recQueue, setRecQueue] = useState([]);

  // update recommendedFollows when the RecQueue is updated
  useEffect(() => {
    setRecommendedFollows([...recommendedFollows, ...recQueue]);
  }, [recQueue]);

  const getActivityRecommendedFollows = async () => {
    setLoading(true);
    const result = await fetch(`/api/getactivityrecommendedfollows`, {
      method: "post",
      body: JSON.stringify({}),
    });
    const { data } = await result.json();
    setRecQueue(data);

    //get recond result
    const secondResult = await fetch("/api/getactivityrecommendedfollows", {
      method: "post",
      body: JSON.stringify({
        recache: true,
      }),
    });
    const { data: secondData } = await secondResult.json();
    setRecQueue(secondData);
    setLoading(false);
  };

  const getActivityRecommendedFollowsRecache = async () => {
    setLoading(true);
    const secondResult = await fetch("/api/getactivityrecommendedfollows", {
      method: "post",
      body: JSON.stringify({
        recache: true,
      }),
    });
    const { data } = await secondResult.json();
    setRecQueue(data);
    setLoading(false);
  };

  // get recs on init
  useEffect(() => {
    if (
      typeof context.user !== "undefined" &&
      recommendedFollows.length === 0
    ) {
      getActivityRecommendedFollows();
    }
  }, [context.user]);

  //get more recs when we're at 3 recs
  useEffect(() => {
    if (
      typeof context.user !== "undefined" &&
      !loading &&
      recommendedFollows.length < 4
    ) {
      getActivityRecommendedFollowsRecache();
    }
  }, [recommendedFollows, context.user]);

  // const [followAllClicked, setFollowAllClicked] = useState(false);
  // const handleFollowAll = async () => {
  //   if (context.user && context.myProfile !== undefined) {
  //     setFollowAllClicked(true);

  //     const newProfiles = recommendedFollows.filter(
  //       (item) =>
  //         !context.myFollows.map((f) => f.profile_id).includes(item.profile_id)
  //     );

  //     // UPDATE CONTEXT
  //     context.setMyFollows([...newProfiles, ...context.myFollows]);

  //     // Post changes to the API
  //     await fetch(`/api/bulkfollow`, {
  //       method: "post",
  //       body: JSON.stringify(newProfiles.map((item) => item.profile_id)),
  //     });
  //   } else {
  //     mixpanel.track("Follow but logged out");
  //     context.setLoginModalOpen(true);
  //   }
  // };

  const followCallback = (recommendation) => {
    setTimeout(() => {
      const newRecommendedFollows = recommendedFollows.filter(
        (recFollow) => recFollow.profile_id !== recommendation.profile_id
      );
      setRecommendedFollows(newRecommendedFollows);
    }, 300);
  };

  return (
    <div>
      <div className="flex items-center pb-2 px-4">
        <div className="m-2 flex-grow">Suggested for You</div>

        {/*!loading && (
          <div>
            <div
              onClick={followAllClicked ? () => {} : handleFollowAll}
              className={`px-4 py-1 text-sm rounded-full border w-max flex items-center justify-center hover:opacity-80  transition-all cursor-pointer ${
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
              )*/}
      </div>
      {recommendedFollows &&
        recommendedFollows
          .slice(0, 3)
          .map((recFollow) => (
            <RecommendedFollowItem
              item={recFollow}
              liteVersion
              removeRecommendation={removeRecommendation}
              followCallback={followCallback}
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
      {loading && recommendedFollows.length < 3 && (
        <div className="flex justify-center items-center w-full py-4 border-t border-gray-200">
          <div className="loading-card-spinner" />
        </div>
      )}
    </div>
  );
}
