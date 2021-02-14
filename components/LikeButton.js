import React, { useContext } from "react";
import { useRouter } from "next/router";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({
  isLiked,
  likeCount,
  handleLike,
  handleLikeArgs,
  handleUnlike,
  handleUnlikeArgs,
  showTooltip,
}) => {
  const context = useContext(AppContext);

  const router = useRouter();

  const handleLoggedOutLike = () => {
    mixpanel.track("Liked but logged out");
    router.push("/login");
  };

  return (
    <div className="tooltip">
      <button
        onClick={() =>
          context.user
            ? isLiked
              ? handleUnlike(handleUnlikeArgs)
              : handleLike(handleLikeArgs)
            : handleLoggedOutLike()
        }
        className={
          isLiked
            ? "showtime-like-button-pink text-sm px-3 py-1 flex flex-row items-center"
            : "showtime-like-button-white text-sm px-3 py-1 flex flex-row items-center"
        }
      >
        <div className="mr-2">
          <FontAwesomeIcon
            style={{ height: 18 }}
            icon={isLiked ? faHeartSolid : faHeartOutline}
          />
        </div>
        <span style={{ whiteSpace: "nowrap" }}>
          {likeCount} like{likeCount === 1 ? null : "s"}{" "}
        </span>
      </button>
      {context.user ? null : showTooltip ? (
        <span
          style={{ fontSize: 12, opacity: 0.9, width: 90 }}
          className="tooltip-text bg-black p-3 -mt-6 -ml-24 rounded text-white"
        >
          Log in to like
        </span>
      ) : null}
    </div>
  );
};

export default LikeButton;
