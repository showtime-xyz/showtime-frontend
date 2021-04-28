import React, { useContext } from "react";
//import { useRouter } from "next/router";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({ item }) => {
  const context = useContext(AppContext);
  const { isMobile } = context;

  const handleLike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes([...context.myLikes, nft_id]);

    const likedItem = item;
    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        ((myLikeCounts && myLikeCounts[nft_id]) || likedItem.like_count) + 1,
    });

    // Post changes to the API
    await fetch(`/api/like_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };

  const handleUnlike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === nft_id)));

    const likedItem = item;
    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        ((myLikeCounts && myLikeCounts[nft_id]) || likedItem.like_count) - 1,
    });

    // Post changes to the API
    await fetch(`/api/unlike_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

  const like_count =
    context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id])
      ? context.myLikeCounts[item?.nft_id]
      : item.like_count;
  const liked = context.myLikes?.includes(item.nft_id);

  const handleLoggedOutLike = () => {
    mixpanel.track("Liked but logged out");
    context.setLoginModalOpen(true);
  };

  return (
    <div className="tooltip">
      <button
        onClick={() =>
          context.user
            ? liked
              ? handleUnlike(item.nft_id)
              : handleLike(item.nft_id)
            : handleLoggedOutLike()
        }

        // className={
        //   item.liked
        //     ? "showtime-like-button-pink"
        //     : "showtime-like-button-white"
        // }
      >
        <div className="flex flex-row items-center rounded-md py-1 hover:text-stred">
          <div className="mr-2" style={{ whiteSpace: "nowrap" }}>
            {like_count}
          </div>
          <div
            className={`flex ${liked ? "text-stred" : ""}`}
            style={{ paddingRight: 2 }}
          >
            <FontAwesomeIcon
              style={{
                height: 22,
                width: 22,
              }}
              icon={liked ? faHeartSolid : faHeartOutline}
            />
          </div>
        </div>
      </button>
      {context.user ? null : !isMobile ? (
        <span
          style={{ fontSize: 12, opacity: 0.9, width: 90 }}
          className="tooltip-text bg-black p-3 -mt-6 -ml-16 rounded text-white"
        >
          Sign in to like
        </span>
      ) : null}
    </div>
  );
};

export default LikeButton;
