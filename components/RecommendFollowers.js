import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faTimes,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/app-context";
import RecommendedFollowItem from "./RecommendedFollowItem";

const Title = styled.h6`
  font-size: 24px;
  font-weight: 500;
  width: 90%;
`;

const GraySeparator = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.11);
`;

const CloseIconWrapper = styled.div`
  cursor: pointer;
  background-color: black;
  padding: 6px;
  border-radius: 18px;
  width: 36px;
  height: 36px;
  opacity: 0.5;
  &:hover {
    opacity: 0.8;
  }
`;

const CloseIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  color: #fff;
`;

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
      await fetch(`/api/finishonboarding`, {
        method: "post",
      });
    }
  };

  const closeRecommendFollowers = () => {
    context.setMyProfile({
      ...context.myProfile,
      has_onboarded: true,
    });
  };

  const handleFollowAll = async () => {
    setFollowAllClicked(true);

    const newProfiles = items.filter(
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
      <div className="p-4 mx-4 rounded-xl bg-white shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <Title>Recommended follows</Title>
          <CloseIconWrapper
            onClick={() => {
              mixpanel.track("Close Recommended Followers modal - x button");
              closeModal();
            }}
          >
            <CloseIcon>
              <FontAwesomeIcon icon={faTimes} />
            </CloseIcon>
          </CloseIconWrapper>
        </div>
        <GraySeparator />

        <div
          className={`text-center text-sm sm:text-base mx-auto px-5 py-1 sm:px-6 sm:py-2 my-4 flex items-center w-max border-2 rounded-full ${
            followAllClicked
              ? "bg-white"
              : "hover:text-stpink text-white border-stpink bg-stpink hover:bg-white transition-all cursor-pointer"
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
            <FontAwesomeIcon
              style={{ height: 14, marginRight: 8 }}
              icon={faPlus}
            />
          ) : null}
          {followAllClicked ? "Following All" : "Follow All"}
        </div>

        {filteredItems.map((item, index) => (
          <RecommendedFollowItem
            key={item.profile_id}
            item={item}
            index={index}
            closeModal={() => {}}
            followCallback={(_) => finishOnboarding()}
          />
        ))}

        <div class="flex justify-between items-center w-full mt-6">
          {!showAllItems && removeAlreadyFollowedItems.length > 3 && (
            <>
              <div
                className="text-center px-6 py-2 lex items-center w-max border-2 rounded-full hover:text-stpink hover:border-stpink transition-all bg-white   cursor-pointer"
                onClick={() => {
                  mixpanel.track(
                    "Clicked Show More on Recommended Followers modal"
                  );
                  setShowAllItems(true);
                }}
              >
                {"Show More"}
                <FontAwesomeIcon
                  style={{ height: 14, marginLeft: 8 }}
                  icon={faArrowDown}
                />
              </div>
            </>
          )}
          <div />
          <div
            className="text-center text-white px-6 py-2 flex items-center w-max border-2 border-black rounded-full hover:text-black hover:border-gray-300 hover:bg-white transition-all bg-black cursor-pointer"
            onClick={() => {
              mixpanel.track("Clicked Close on Recommended Followers modal");
              finishOnboarding();
              closeRecommendFollowers();
            }}
          >
            Close
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default RecommendFollowers;
