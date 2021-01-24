import React, { useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const LikeButton = ({
  isLiked,
  likeCount,
  handleLike,
  handleLikeArgs,
  handleUnlike,
  handleUnlikeArgs,
  showTooltip,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  return (
    <div className="tooltip">
      <button
        onClick={() =>
          user
            ? isLiked
              ? handleUnlike(handleUnlikeArgs)
              : handleLike(handleLikeArgs)
            : router.push("/login")
        }
        className={
          isLiked
            ? "showtime-like-button-pink text-sm px-3 py-2 md:text-base flex flex-row items-center"
            : "showtime-like-button-white text-sm px-3 py-2 md:text-base flex flex-row items-center"
        }
        onMouseOver={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
      >
        <img
          style={{ paddingRight: 6 }}
          src={
            isLiked
              ? "/icons/heart-white.svg"
              : isHovering
              ? "/icons/heart-pink-outline.svg"
              : "/icons/heart-black-outline.svg"
          }
          alt="heart"
          className="flex"
        />
        <span
          className={
            isLiked ? "flex" : isHovering ? "showtime-text-pink flex" : "flex"
          }
        >
          {likeCount} like{likeCount === 1 ? null : "s"}
        </span>
      </button>
      {user ? null : showTooltip ? (
        <span
          style={{ fontSize: 12, opacity: 0.9, width: 90 }}
          className="tooltip-text bg-white p-3 -mt-6 -ml-24 rounded text-black"
        >
          Log in to like
        </span>
      ) : null}
    </div>
  );
};

export default LikeButton;
