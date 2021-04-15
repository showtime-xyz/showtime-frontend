import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/app-context";
import backend from "../lib/backend";
import mixpanel from "mixpanel-browser";
import Comment from "./Comment";

export default function CommentsSection({
  item,
  closeModal,
  modalRef,
  commentCount,
}) {
  const { nft_id: nftId, owner_id: nftOwnerId } = item;
  const context = useContext(AppContext);
  const { user } = context;
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingMoreComments, setLoadingMoreComments] = useState(true);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [comments, setComments] = useState();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshComments = async (showLoading = true) => {
    const commentsData = await backend.get(
      `/v2/comments/${nftId}${hasMoreComments ? "" : "?limit=10"}`
    );
    setComments(commentsData.data.data.comments);
    setHasMoreComments(commentsData.data.data.has_more);
    setLoadingComments(false);
  };

  useEffect(() => {
    setHasMoreComments(false);
    setLoadingComments(true);
    setLoadingMoreComments(false);
    refreshComments();
    return () => setComments(null);
  }, [nftId]);

  const handleGetMoreComments = async () => {
    setLoadingMoreComments(true);
    await refreshComments(nftId);
    setLoadingMoreComments(false);
    setHasMoreComments(false);
  };

  const createComment = async () => {
    setIsSubmitting(true);
    // post new comment
    await fetch(`/api/createcomment`, {
      method: "post",
      body: JSON.stringify({
        nftId,
        message: commentText,
      }),
    });
    mixpanel.track("Comment created");
    // pull new comments
    await refreshComments(false);
    await storeCommentInContext();
    // clear state
    setCommentText("");
    setIsSubmitting(false);
  };

  const deleteComment = async (commentId) => {
    // post new comment
    await fetch(`/api/deletecomment`, {
      method: "post",
      body: JSON.stringify({
        commentId,
      }),
    });
    removeCommentFromContext();
    mixpanel.track("Comment deleted");
    // pull new comments
    await refreshComments(false);
  };

  const handleLoggedOutComment = () => {
    context.setLoginModalOpen(true);
    mixpanel.track("Commented but logged out");
  };

  const storeCommentInContext = async () => {
    const myCommentCounts = context.myCommentCounts;
    const newAmountOfMyComments =
      ((myCommentCounts && myCommentCounts[nftId]) || commentCount) + 1;

    context.setMyCommentCounts({
      ...context.myCommentCounts,
      [nftId]: newAmountOfMyComments,
    });
    if (newAmountOfMyComments === 1) {
      context.setMyComments([...context.myComments, nftId]);
    }
  };

  const removeCommentFromContext = async () => {
    const myCommentCounts = context.myCommentCounts;
    const newAmountOfMyComments =
      ((myCommentCounts && myCommentCounts[nftId]) || commentCount) - 1;
    context.setMyCommentCounts({
      ...context.myCommentCounts,
      [nftId]: newAmountOfMyComments,
    });
    if (newAmountOfMyComments === 0) {
      context.setMyComments(
        context.myComments.filter((item) => !(item === nftId))
      );
    }
  };
  return (
    <div className="w-full">
      {/* Comments */}
      <div>
        <div className="md:text-lg py-4" id="CommentsSectionScroll">
          Comments
        </div>
        {loadingComments ? (
          <div className="text-center my-4">
            <div className="loading-card-spinner" />
          </div>
        ) : (
          <>
            <div className="py-2 px-4 border-2 border-gray-300 rounded-xl">
              {hasMoreComments && (
                <div className="flex flex-row items-center my-2 justify-center">
                  {!loadingMoreComments ? (
                    <div
                      className="text-center px-4 py-1 flex items-center w-max border-2 border-gray-300 rounded-full hover:text-stpink hover:border-stpink cursor-pointer transition-all"
                      onClick={handleGetMoreComments}
                    >
                      <div className="mr-2 text-sm">Show Earlier Comments</div>
                      {/*<div>
                        <FontAwesomeIcon
                          style={{ height: 12 }}
                          icon={faArrowUp}
                        />
                      </div>*/}
                    </div>
                  ) : (
                    <div className="p-1">
                      <div className="loading-card-spinner-small" />
                    </div>
                  )}
                </div>
              )}
              <div className="mb-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment
                      comment={comment}
                      key={comment.comment_id}
                      closeModal={closeModal}
                      modalRef={modalRef}
                      deleteComment={deleteComment}
                      nftOwnerId={nftOwnerId}
                    />
                  ))
                ) : (
                  <div className="my-2 mb-3 p-3 bg-gray-100 rounded-xl">
                    No comments yet.
                  </div>
                )}
              </div>
              {/* New Comment */}
              <div className="my-2 flex items-stretch flex-col md:flex-row">
                <textarea
                  value={commentText}
                  disabled={isSubmitting}
                  className={`border-2 border-gray-300 text-sm md:h-12 flex-grow rounded-xl p-2 px-3 md:mr-2 focus:border-gray-400${
                    isSubmitting ? " bg-gray-100" : ""
                  }`}
                  rows="2"
                  placeholder="Your comment..."
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                  maxLength={240}
                />
                <button
                  onClick={!user ? handleLoggedOutComment : createComment}
                  disabled={
                    isSubmitting ||
                    !commentText ||
                    commentText === "" ||
                    commentText.trim() === ""
                  }
                  className="px-4 py-3 bg-black rounded-xl mt-4 md:mt-0 justify-center text-white flex items-center cursor-pointer hover:bg-stpink transition-all disabled:bg-gray-700"
                >
                  {isSubmitting ? (
                    <div className="loading-card-spinner-small" />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
