import React, { useRef, useState, useContext } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict, subSeconds } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import AppContext from "../context/app-context";
import reactStringReplace from "react-string-replace";
import { formatAddressShort } from "../lib/utilities";

export default function Comment({
  comment,
  closeModal,
  modalRef,
  deleteComment,
  nftOwnerId,
  nftCreatorId,
}) {
  const context = useContext(AppContext);
  const { myProfile } = context;
  const dropdownRef = useRef(null);
  const commentWithMentions = reactStringReplace(
    comment.text,
    /(@\[.+?\]\(\w+\))/g,
    (match, i, o) => {
      const [_, name, urlParam] = match.match(/@\[(.+?)\]\((\w+)\)/);
      return (
        <Link href="/[profile]" as={`/${urlParam}`} key={match + i}>
          <a className="text-indigo-500 hover:text-indigo-400">{name}</a>
        </Link>
      );
    }
  );
  // console.log(replaced);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActive, setIsActive] = useDetectOutsideClick(
    dropdownRef,
    false,
    modalRef
  );
  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  const userWroteComment =
    myProfile &&
    myProfile.profile_id &&
    myProfile.profile_id === comment.commenter_profile_id;

  const isOwnerOfNFT = nftOwnerId && nftOwnerId === myProfile?.profile_id;
  const isCreatorOfNFT = nftCreatorId && nftCreatorId === myProfile?.profile_id;

  return (
    <div className="p-2 my-1 flex rounded-xl hover:bg-gray-100 transition-all relative">
      <div className="mr-3 mt-1">
        <Link
          href="/[profile]"
          as={comment.username ? `/${comment.username}` : `/${comment.address}`}
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
          <div className="flex flex-col sm:flex-row">
            <Link
              href="/[profile]"
              as={
                comment.username
                  ? `/${comment.username}`
                  : `/${comment.address}`
              }
            >
              <a
                className="hover:text-stpink cursor-pointer text-sm"
                onClick={closeModal}
                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {comment.name || formatAddressShort(comment.address)}
              </a>
            </Link>
            {comment.username && (
              <Link
                href="/[profile]"
                as={
                  comment.username
                    ? `/${comment.username}`
                    : `/${comment.address}`
                }
              >
                <a
                  className="hover:text-stpink cursor-pointer text-xs text-gray-400 sm:ml-1"
                  onClick={closeModal}
                  style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  @{comment.username}
                </a>
              </Link>
            )}
          </div>
          <div className="flex-grow"></div>
          <div className="text-gray-400 text-xs flex-0 mb-6 sm:mb-0 mt-2 sm:mt-0">
            {formatDistanceToNowStrict(
              subSeconds(new Date(`${comment.added}Z`), 1),
              {
                addSuffix: true,
              }
            )}
          </div>
          {(isOwnerOfNFT || userWroteComment || isCreatorOfNFT) && (
            <div className="flex items-center justify-center  relative -mt-4 sm:mt-0">
              <div
                onClick={toggleDropdown}
                className="ml-3 mr-1 cursor-pointer text-gray-400 hover:text-gray-600 transition-all"
              >
                <FontAwesomeIcon
                  style={{
                    height: 14,
                    width: 14,
                  }}
                  icon={faEllipsisH}
                />
              </div>
              <div
                ref={dropdownRef}
                className={`absolute text-center top-6 right-0 bg-white py-2 px-2 shadow-lg rounded-xl transition-all text-sm transform ${
                  isActive
                    ? "visible opacity-1 translate-y-2"
                    : "invisible opacity-0"
                }`}
                style={{ zIndex: 1 }}
              >
                <div
                  className="py-1 px-4 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap"
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteComment(comment.comment_id);
                    setIsActive(false);
                    setIsDeleting(false);
                  }}
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-card-spinner-small" />
                    </div>
                  ) : (
                    "Delete"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="text-gray-500 text-sm leading-5"
          style={{ wordBreak: "break-word" }}
        >
          {commentWithMentions}
        </div>
      </div>
    </div>
  );
}
