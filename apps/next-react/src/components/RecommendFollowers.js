import { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import AppContext from "@/context/app-context";
import RecommendedFollowItem from "./RecommendedFollowItem";
import axios from "@/lib/axios";

const RecommendFollowersVariants = {
  ONBOARDING: "ONBOARDING",
};

const RecommendFollowers = ({
  variant = RecommendFollowersVariants.ONBOARDING,
  items,
}) => {
  const context = useContext(AppContext);
  const [myFollows, setMyFollows] = useState([]);
  const [showAllItems, setShowAllItems] = useState(false);
  const [followAllClicked, setFollowAllClicked] = useState(false);
  const removeAlreadyFollowedItems = items.filter(
    (item) => !myFollows.includes(item.profile_id)
  );
  const filteredItems = showAllItems
    ? removeAlreadyFollowedItems
    : removeAlreadyFollowedItems.slice(0, 7);

  const finishOnboarding = async () => {
    if (!context.myProfile.has_onboarded) {
      await axios.post("/api/finishonboarding");
    }
  };

  const closeRecommendFollowers = async () => {
    context.setMyProfile({
      ...context.myProfile,
      has_onboarded: true,
    });
    await context.setToggleRefreshFeed(!context.toggleRefreshFeed);
  };

  const handleFollowAll = async () => {
    setFollowAllClicked(true);

    const newProfiles = items.filter(
      (item) =>
        !context.myFollows.map((f) => f.profile_id).includes(item.profile_id) &&
        context.myProfile?.profile_id != item.profile_id
    );

    // UPDATE CONTEXT
    context.setMyFollows([...newProfiles, ...context.myFollows]);

    // Post changes to the API
    await axios.post(
      "/api/bulkfollow",
      newProfiles.map((item) => item.profile_id)
    );

    finishOnboarding();
  };

  useEffect(() => {
    setMyFollows(context?.myFollows?.map((follow) => follow?.profile_id) || []);
  }, []);

  useEffect(() => {
    if (
      items.length > 0 &&
      items.every((item) => myFollows.includes(item.profile_id))
    ) {
      finishOnboarding();
    }
  }, [filteredItems]);
  if (variant === RecommendFollowersVariants.ONBOARDING) {
    return (
      <div className="p-4 mx-4 rounded-xl bg-white dark:bg-gray-900 shadow-lg mb-8 ">
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-2xl font-medium w-11/12 dark:text-gray-300">
            Follow people to start{" "}
            <span className="hidden sm:inline">your feed</span>
          </h6>
        </div>
        <div className="w-full h-px bg-black bg-opacity-10" />

        <div
          className={`text-center text-sm sm:text-base mx-auto px-5 py-1 sm:px-6 sm:py-2 my-4 flex items-center w-max border-2 rounded-full  ${
            followAllClicked
              ? "bg-white dark:bg-gray-800"
              : "hover:text-stpink text-white border-stpink bg-stpink hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer"
          }  `}
          onClick={() => {
            if (!followAllClicked) {
              mixpanel.track(
                "Clicked Follow All on Recommended Followers modal"
              );
              handleFollowAll();
            }
          }}
        >
          {!followAllClicked ? (
            <FontAwesomeIcon className="mr-2 h-3.5 " icon={faPlus} />
          ) : null}
          {followAllClicked ? "Following All" : "Follow All"}
        </div>

        {filteredItems.map((item, index) => (
          <RecommendedFollowItem
            key={item.profile_id}
            item={item}
            index={index}
            closeModal={() => {}}
            followCallback={() => finishOnboarding()}
          />
        ))}

        <div className="flex justify-between items-center w-full mt-6">
          {!showAllItems && removeAlreadyFollowedItems.length > 3 && (
            <>
              <div
                className="text-center px-6 py-2 lex items-center w-max border-2 rounded-full hover:text-stpink hover:border-stpink transition-all bg-white  dark:bg-gray-800 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  mixpanel.track(
                    "Clicked Show More on Recommended Followers modal"
                  );
                  setShowAllItems(true);
                }}
              >
                {"Show More"}
                <FontAwesomeIcon className="h-3.5 ml-2" icon={faArrowDown} />
              </div>
            </>
          )}
          <div />
          <div
            className="text-center text-white px-6 py-2 flex items-center w-max border-2 border-green-500 rounded-full hover:text-green-500 hover:bg-white dark:hover:bg-gray-800 bg-green-500 transition cursor-pointer"
            onClick={() => {
              mixpanel.track("Clicked Close on Recommended Followers modal");
              finishOnboarding();
              closeRecommendFollowers();
            }}
          >
            All Done
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default RecommendFollowers;
