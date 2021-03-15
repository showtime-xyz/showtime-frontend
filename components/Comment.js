import React, { useRef } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";

export default function Comment({ comment, closeModal, modalRef }) {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(
    dropdownRef,
    false,
    modalRef
  );
  const toggleDropdown = () => setIsActive(!isActive);
  return (
    <div className="p-2 my-1 flex rounded-xl hover:bg-gray-100 relative">
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
          <Link
            href="/[profile]"
            as={
              comment.username ? `/${comment.username}` : `/${comment.address}`
            }
          >
            <div
              className="hover:text-stpink cursor-pointer"
              onClick={closeModal}
            >
              {comment.username || comment.name || "Unnamed"}
            </div>
          </Link>
          <div className="flex-grow" />
          <div className="text-gray-400 text-sm flex-shink">
            {formatDistanceToNowStrict(new Date(`${comment.added}Z`), {
              addSuffix: true,
            })}
          </div>
          <div className="flex items-center justify-center my-2 md:my-0 relative">
            <div
              onClick={toggleDropdown}
              className="ml-3 mr-1 cursor-pointer text-gray-400 hover:text-gray-600"
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
                className="py-1 px-4 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
                onClick={() => {
                  setIsActive(false);
                }}
              >
                Delete
              </div>
            </div>
          </div>
        </div>
        <div className="text-gray-500 text-sm leading-5">{comment.text}</div>
      </div>
    </div>
  );
}
