import React, { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";

const MiniFollowButton = ({ profileId }) => {
  const context = useContext(AppContext);
  const myFollows = context?.myFollows || [];
  const [isFollowed, setIsFollowed] = useState(false);
  const [newlyFollowed, setNewlyFollowed] = useState(false);
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
    setNewlyFollowed(true);
    setIsFollowed(true);
    // Change myFollows via setMyFollows
    context.setMyFollows([{ profile_id: profileId }, ...context.myFollows]);
    // Post changes to the API
    await fetch(`/api/follow_v2/${profileId}`, {
      method: "post",
    });
    mixpanel.track("Followed profile - Card button");

    setTimeout(function () {
      setNewlyFollowed(false);
    }, 1000);
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

  return !isFollowed ? (
    <div
      onClick={
        context.user
          ? isFollowed
            ? handleUnfollow
            : handleFollow
          : handleLoggedOutFollow
      }
      isFollowed={isFollowed}
      className="text-xs text-stlink opacity-80 hover:opacity-100 cursor-pointer mt-1 "
    >
      Follow
    </div>
  ) : null;

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
      {!isFollowed ? (
        <>
          {/*<PlusIcon>
            <FontAwesomeIcon icon={faPlus} style={{ width: 12, height: 12 }} />
          </PlusIcon>*/}
          <FollowText>Follow</FollowText>
        </>
      ) : null}

      {/*(
        
        <PlusIcon>
          <div className="tooltip">
            <FontAwesomeIcon
              icon={faUserFriends}
              style={{ width: 18, height: 18 }}
            />
            {newlyFollowed ? null : (
              <span
                style={{
                  fontSize: 12,
                  opacity: 0.9,
                  width: 170,
                  lineHeight: 1.75,
                }}
                className="tooltip-text bg-black p-3 mb-9 -ml-48 rounded text-white"
              >
                Following. Click to unfollow.
              </span>
            )}
          </div>
        </PlusIcon> 
      )}*/}
    </Button>
  );
};

export default MiniFollowButton;
