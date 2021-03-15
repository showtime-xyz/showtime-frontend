import React, { useEffect, useState, useContext } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import AppContext from "../context/app-context";
import backend from "../lib/backend";
import Link from "next/link";
import mixpanel from "mixpanel-browser";

export default function CommentsSection({ nftId, closeModal }) {
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
    // pull new comments
    await refreshComments();
    // clear state
    setCommentText("");
    setIsSubmitting(false);
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
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="p-2 my-1 flex rounded-xl hover:bg-gray-100"
                  >
                    <div className="mr-3 mt-1">
                      <Link
                        href="/[profile]"
                        as={
                          comment.username
                            ? `/${comment.username}`
                            : `/${comment.address}`
                        }
                      >
                        <img
                          alt={comment.username || comment.name || "Unnamed"}
                          src={
                            comment.img_url
                              ? comment.img_url
                              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          className="rounded-full cursor-pointer"
                          style={{ height: 32, width: 32 }}
                          onClick={closeModal}
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href="/[profile]"
                          as={
                            comment.username
                              ? `/${comment.username}`
                              : `/${comment.address}`
                          }
                        >
                          <div
                            className="hover:text-stpink cursor-pointer"
                            onClick={closeModal}
                          >
                            {comment.username || comment.name || "Unnamed"}
                          </div>
                        </Link>
                        <div className="text-gray-400 text-sm">
                          {formatDistanceToNowStrict(new Date(comment.added), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm leading-5">
                        {comment.text}
                      </div>
                    </div>
                  </div>
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
                className={`border-2 border-gray-300 text-sm flex-grow rounded-xl p-2 px-3 md:mr-2 focus:border-gray-400${
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
