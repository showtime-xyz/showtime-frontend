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
  box-sizing: border-box;
  padding: 8px 16px;
  &:hover {
    opacity: 0.7;
  }
  ${(p) =>
    p.notExpandWhenMobile
      ? ""
      : `@media screen and (max-width: 400px) {
    width: 100%;
  }`}
`;

const FollowButton = ({
  item,
  followerCount,
  setFollowerCount,
  hideIfFollowing,
  notExpandWhenMobile,
}) => {
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
      notExpandWhenMobile={notExpandWhenMobile}
      className={
        hideIfFollowing && isFollowed
          ? "hidden border-gray-400 border rounded-full"
          : "border-gray-400 border rounded-full"
      }
      onClick={
        context.user
          ? isFollowed
            ? handleUnfollow
            : handleFollow
          : handleLoggedOutFollow
      }
    >
      {!isFollowed && (
        <div className="mr-1 text-sm">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      )}
      <div className="text-sm">{isFollowed ? "Following" : "Follow"}</div>
    </Button>
  );
};

export default FollowButton;
