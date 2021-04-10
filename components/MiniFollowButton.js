import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";

const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  border-radius: 41px;
  padding: 4px 10px;
  &:hover {
    opacity: 0.7;
  }
`;

const FollowText = styled.h6`
  font-size: 12px;
  font-weight: 400;
  color: #888;
`;
const PlusIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;
  color: #888;
`;

const MiniFollowButton = ({ profileId }) => {
  const context = useContext(AppContext);
  const myFollows = context?.myFollows || [];
  const [isFollowed, setIsFollowed] = useState(false);
  //console.log(profileId);
  //console.log(myFollows);
  useEffect(() => {
    var it_is_followed = false;
    _.forEach(myFollows, (follow) => {
      if (follow?.profile_id === profileId) {
        it_is_followed = true;
      }
    });
    setIsFollowed(it_is_followed);
  }, [myFollows]);

  const handleFollow = async () => {
    setIsFollowed(true);
    // Change myFollows via setMyFollows
    context.setMyFollows([{ profile_id: profileId }, ...context.myFollows]);
    // Post changes to the API
    await fetch(`/api/follow_v2/${profileId}`, {
      method: "post",
    });
    mixpanel.track("Followed profile - Card button");
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    // Change myLikes via setMyLikes
    context.setMyFollows(
      context.myFollows.filter((i) => i?.profile_id !== profileId)
    );
    // Post changes to the API
    await fetch(`/api/unfollow_v2/${profileId}`, {
      method: "post",
    });
    mixpanel.track("Unfollowed profile - Card button");
  };

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out - Card button");
    context.setLoginModalOpen(true);
  };

  return (
    <Button
      onClick={
        context.user
          ? isFollowed
            ? handleUnfollow
            : handleFollow
          : handleLoggedOutFollow
      }
      isFollowed={isFollowed}
    >
      {!isFollowed && (
        <PlusIcon>
          <FontAwesomeIcon icon={faPlus} style={{ width: 12, height: 12 }} />
        </PlusIcon>
      )}
      <FollowText>{isFollowed ? "Following" : "Follow"}</FollowText>
    </Button>
  );
};

export default MiniFollowButton;
