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
      {user ? null : (
        <span
          style={{ fontSize: 12, opacity: 0.9 }}
          className="tooltip-text bg-white p-3 -mt-6 -ml-24 rounded text-black"
        >
          Login to like
        </span>
      )}
    </div>
  );
};

export default LikeButton;
