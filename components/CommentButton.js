import React, { useContext } from "react";
//import { useRouter } from "next/router";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment as faCommentOutline } from "@fortawesome/free-regular-svg-icons";
import { faComment as faCommentSolid } from "@fortawesome/free-solid-svg-icons";

const CommentButton = ({ item, handleComment }) => {
  const context = useContext(AppContext);
  const { isMobile } = context;
  const comment_count =
    (context.myCommentCounts && context.myCommentCounts[item?.nft_id]) ||
    item.comment_count;
  const commented = context.myComments?.includes(item.nft_id);

  const handleLoggedOutComment = () => {
    mixpanel.track("Commented but logged out");
    context.setLoginModalOpen(true);
  };

  return (
    <div className="tooltip">
      <button onClick={context.user ? handleComment : handleLoggedOutComment}>
        <div className="flex flex-row items-center rounded-lg py-1 hover:text-stpink">
          <div className="mr-2" style={{ whiteSpace: "nowrap" }}>
            {comment_count}
          </div>
          <div className="flex" style={{ paddingRight: 2 }}>
            <FontAwesomeIcon
              style={{
                height: 22,
                width: 22,
              }}
              icon={commented ? faCommentSolid : faCommentOutline}
              color={commented ? "#e45cff" : "inherit"}
            />
          </div>
        </div>
      </button>
      {context.user ? null : !isMobile ? (
        <span
          style={{ fontSize: 12, opacity: 0.9, width: 125 }}
          className="tooltip-text bg-black p-3 -mt-6 -ml-16 rounded text-white"
        >
          Sign in to comment
        </span>
      ) : null}
    </div>
  );
};

export default CommentButton;
