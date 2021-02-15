import React, { useContext } from "react";
//import { useRouter } from "next/router";
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

  //const router = useRouter();

  const handleLoggedOutLike = () => {
    mixpanel.track("Liked but logged out");
    //router.push("/login");
    context.setLoginModalOpen(true);
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
          isLiked ? "showtime-like-button-pink" : "showtime-like-button-white"
        }
      >
        <div className="flex flex-row items-center text-sm px-3 py-1">
          <div className="flex">
            <FontAwesomeIcon
              style={{
                height: 18,
                width: 18,
              }}
              icon={isLiked ? faHeartSolid : faHeartOutline}
            />
          </div>
          <div className="ml-2" style={{ whiteSpace: "nowrap" }}>
            {likeCount} like{likeCount === 1 ? null : "s"}{" "}
          </div>
        </div>
      </button>
      {context.user ? null : showTooltip ? (
        <span
          style={{ fontSize: 12, opacity: 0.9, width: 90 }}
          className="tooltip-text bg-black p-3 -mt-6 -ml-24 rounded text-white"
        >
          Sign in to like
        </span>
      ) : null}
    </div>
  );
};

export default LikeButton;
