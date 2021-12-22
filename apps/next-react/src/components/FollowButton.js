import { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import AppContext from "@/context/app-context";
import _ from "lodash";
import axios from "@/lib/axios";
import Button from "./UI/Buttons/Button";
import useAuth from "@/hooks/useAuth";

const FollowButton = ({
  item,
  followerCount,
  setFollowerCount,
  hideIfFollowing,
  compact,
}) => {
  const { isAuthenticated } = useAuth();
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
    // Change myFollows via setMyFollows
    context.setMyFollows([
      { profile_id: item?.profile_id },
      ...context.myFollows,
    ]);
    // Post changes to the API
    try {
      await axios
        .post(`/api/follow_v2/${item?.profile_id}`)
        .then(() => {
          mixpanel.track("Followed profile");
        })
        .catch((err) => {
          if (err.response.data.code === 429) {
            context.setMyFollows(
              context.myFollows.filter(
                (i) => i?.profile_id !== item?.profile_id
              )
            );
            return context.setThrottleMessage(err.response.data.message);
          }
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    setFollowerCount(followerCount - 1);
    // Change myLikes via setMyLikes
    context.setMyFollows(
      context.myFollows.filter((i) => i?.profile_id !== item?.profile_id)
    );
    // Post changes to the API
    await axios.post(`/api/unfollow_v2/${item?.profile_id}`);
    mixpanel.track("Unfollowed profile");
  };

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out");
    context.setLoginModalOpen(true);
  };

  return (
    <Button
      style={isFollowed ? "tertiary" : "primary"}
      onClick={
        isAuthenticated
          ? isFollowed
            ? handleUnfollow
            : context.disableFollows
            ? null
            : handleFollow
          : handleLoggedOutFollow
      }
      className={`space-x-2 ${isFollowed ? "" : "text-white"} ${
        hideIfFollowing ? "hidden" : ""
      } ${compact ? "py-1 px-2 text-sm" : ""}`}
    >
      {isFollowed ? (
        <span className="font-bold">Following</span>
      ) : (
        <span className="font-bold">Follow</span>
      )}
    </Button>
  );
};

export default FollowButton;
