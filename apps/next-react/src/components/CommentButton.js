import { useContext } from "react";

import AppContext from "@/context/app-context";
import useAuth from "@/hooks/useAuth";
import Tippy from "@tippyjs/react";
import mixpanel from "mixpanel-browser";

import CommentIcon, { CommentIconSolid } from "./Icons/CommentIcon";

const CommentButton = ({ item, handleComment }) => {
  const { isAuthenticated } = useAuth();
  const context = useContext(AppContext);
  const comment_count =
    (context.myCommentCounts && context.myCommentCounts[item?.nft_id]) ||
    item.comment_count;
  const commented = context.myComments?.includes(item.nft_id);

  const handleLoggedOutComment = () => {
    mixpanel.track("Commented but logged out");
    context.setLoginModalOpen(true);
  };

  return (
    <Tippy
      content="Sign in to comment"
      disabled={isAuthenticated || context.isMobile}
    >
      <button
        className="focus:outline-none hover:bg-blue-50 dark:hover:bg-blue-900 focus:bg-blue-50 dark:focus:bg-blue-900 px-2 -mx-2 rounded-xl group"
        disabled={context.disableComments}
        onClick={isAuthenticated ? handleComment : handleLoggedOutComment}
      >
        <div
          className={`flex flex-row items-center rounded-lg py-1 dark:text-gray-300 ${
            commented
              ? "text-blue-500 dark:text-blue-600"
              : "group-hover:text-blue-400 dark:group-hover:text-blue-400"
          } ${
            context.disableComments ? "hover:text-gray-500 text-gray-500" : ""
          }`}
        >
          <div className={"flex"}>
            {commented ? (
              <CommentIconSolid className="w-5 h-5" />
            ) : (
              <CommentIcon className="w-5 h-5" />
            )}
          </div>
          <div className="ml-1 whitespace-nowrap">{comment_count}</div>
        </div>
      </button>
    </Tippy>
  );
};

export default CommentButton;
