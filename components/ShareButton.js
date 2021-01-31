import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import mixpanel from "mixpanel-browser";

const ShareButton = ({ url, type }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="tooltip">
      <CopyToClipboard
        text={url}
        onCopy={() => {
          setIsCopied(true);
          mixpanel.track("Copy link click", { type: type });
        }}
      >
        <button
          className="inline-flex px-1 py-1 ml-1 rounded-md"
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => {
            setIsHovering(false);
            setTimeout(function () {
              setIsCopied(false);
            }, 3000);
          }}
          style={
            isHovering
              ? {
                  /* backgroundColor: "rgba(125,92,255,0.4)" */
                }
              : null
          }
        >
          <img
            src={
              isHovering ? "/icons/share-pink.svg" : "/icons/share-black.svg"
            }
            alt="share-button"
            className="h-6 w-6 items-center flex"
          />
        </button>
      </CopyToClipboard>
      <span
        style={{ fontSize: 12, opacity: 0.9, width: 70 }}
        className="tooltip-text bg-black p-3 -mt-6 -ml-14 rounded text-white"
      >
        {isCopied ? "Copied!" : "Copy link"}
      </span>
    </div>
  );
};

export default ShareButton;
