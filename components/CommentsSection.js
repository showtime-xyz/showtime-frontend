import React, { useEffect, useState, useContext } from "react";
import AppContext from "../context/app-context";
import backend from "../lib/backend";
import mixpanel from "mixpanel-browser";
import Comment from "./Comment";

export default function CommentsSection({ nftId, closeModal, modalRef }) {
  const context = useContext(AppContext);
  const { user } = context;
  const [loadingComments, setLoadingComments] = useState(true);
  const [comments, setComments] = useState();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshComments = async () => {
    const commentsData = await backend.get(`/v1/getcomments/${nftId}`);
    const {
      data: { data },
    } = commentsData;
    setComments(data);
    setLoadingComments(false);
  };

  useEffect(() => {
    refreshComments();
  }, []);

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
    await refreshComments();
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
    mixpanel.track("Comment deleted");
    // pull new comments
    await refreshComments();
  };

  const handleLoggedOutComment = () => {
    context.setLoginModalOpen(true);
    mixpanel.track("Commented but logged out");
  };

  return (
    <div className="w-full">
      {/* Comments */}
      <div>
        <div className="md:text-lg py-2">Comments</div>
        {loadingComments ? (
          <div className="text-center my-4">
            <div className="loading-card-spinner" />
          </div>
        ) : (
          <div className="py-2 px-4 border-2 border-gray-300 rounded-xl">
            <div className="mb-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    comment={comment}
                    key={comment.comment_id}
                    closeModal={closeModal}
                    modalRef={modalRef}
                    deleteComment={deleteComment}
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
                className="px-4 py-3 bg-black rounded-xl mt-4 md:mt-0 justify-center text-white flex items-center cursor-pointer hover:bg-stpink disabled:bg-gray-700"
              >
                {isSubmitting ? (
                  <div className="loading-card-spinner-small" />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
