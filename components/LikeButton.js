import React, { useContext } from "react";
//import { useRouter } from "next/router";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({ item, handleLike, handleUnlike, showTooltip }) => {
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
            ? item.liked
              ? handleUnlike(item.nft_id)
              : handleLike(item.nft_id)
            : handleLoggedOutLike()
        }
        className={
          item.liked
            ? "showtime-like-button-pink"
            : "showtime-like-button-white"
        }
      >
        <div className="flex flex-row items-center text-sm px-3 py-1">
          <div className="flex">
            <FontAwesomeIcon
              style={{
                height: 18,
                width: 18,
              }}
              icon={item.liked ? faHeartSolid : faHeartOutline}
            />
          </div>
          <div className="ml-2" style={{ whiteSpace: "nowrap" }}>
            {item.like_count} like{item.like_count === 1 ? null : "s"}{" "}
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
