import React, { useState } from "react";

const LikeButton = ({
  isLiked,
  likeCount,
  handleLike,
  handleLikeArgs,
  handleUnlike,
  handleUnlikeArgs,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      onClick={() =>
        isLiked ? handleUnlike(handleUnlikeArgs) : handleLike(handleLikeArgs)
      }
      className={
        isLiked ? "showtime-pink-button-icon" : "showtime-white-button-icon"
      }
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <img
        style={{ paddingRight: 6, marginTop: 3 }}
        src={
          isLiked
            ? "/icons/heart-white.svg"
            : isHovering
            ? "/icons/heart-pink-outline.svg"
            : "/icons/heart-black-outline.svg"
        }
        alt="heart"
      />
      <span
        className={isLiked ? null : isHovering ? "showtime-text-pink" : null}
      >
        {likeCount} like{likeCount === 1 ? null : "s"}
      </span>
    </button>
  );
};

export default LikeButton;
