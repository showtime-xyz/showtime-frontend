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
  padding: 8px 16px;
  &:hover {
    opacity: 0.7;
  }
  @media screen and (max-width: 400px) {
    width: 100%;
  }
`;

const PlusIcon = styled.div`
  display: flex;
  margin-bottom: 3px;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  //color: #adadad;
`;

const FollowText = styled.h6`
  font-size: 13px;
  font-weight: 400;
`;

const FollowButton = ({ item, followerCount, setFollowerCount, black }) => {
  const context = useContext(AppContext);
  const myFollows = context?.myFollows || [];
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    setFollowerCount(parseInt(item.follower_count));
  }, [item]);

  useEffect(() => {
    var it_is_followed = false;
    _.forEach(myFollows, (follow) => {
      if (follow?.profile_id === item?.profile_id) {
        it_is_followed = true;
      }
    });
    setIsFollowed(it_is_followed);
  }, [myFollows]);

  const handleFollow = async () => {
    setIsFollowed(true);
    setFollowerCount(followerCount + 1);
    // Change myFollows via setMyFollows
    context.setMyFollows([
      { profile_id: item?.profile_id },
      ...context.myFollows,
    ]);
    // Post changes to the API
    await fetch(`/api/follow_v2/${item?.profile_id}`, {
      method: "post",
    });
    mixpanel.track("Followed profile");
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    setFollowerCount(followerCount - 1);
    // Change myLikes via setMyLikes
    context.setMyFollows(
      context.myFollows.filter((i) => i?.profile_id !== item?.profile_id)
    );
    // Post changes to the API
    await fetch(`/api/unfollow_v2/${item?.profile_id}`, {
      method: "post",
    });
    mixpanel.track("Unfollowed profile");
  };

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out");
    context.setLoginModalOpen(true);
  };

  return (
    <Button
      className={
        black
          ? !isFollowed
            ? "bg-black text-white w-24 py-2"
            : "w-24  py-2"
          : null
      }
      onClick={
        context.user
          ? isFollowed
            ? handleUnfollow
            : handleFollow
          : handleLoggedOutFollow
      }
    >
      {!isFollowed && !black && (
        <PlusIcon>
          <FontAwesomeIcon icon={faPlus} />
        </PlusIcon>
      )}
      <FollowText>{isFollowed ? "Following" : "Follow"}</FollowText>
    </Button>
  );
};

export default FollowButton;
