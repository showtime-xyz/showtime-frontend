import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ShareButton = ({ url }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="tooltip">
      <CopyToClipboard text={url} onCopy={() => setIsCopied(true)}>
        <button
          className="inline-flex mr-1 px-2 py-2 rounded-md"
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
              isHovering ? "/icons/share-purple.svg" : "/icons/share-white.svg"
            }
            alt="share-button"
            className="h-6 w-6 items-center flex"
          />
        </button>
      </CopyToClipboard>
      <span
        style={{ fontSize: 12, opacity: 0.9, width: 70 }}
        className="tooltip-text bg-white p-3 -mt-6 -ml-14 rounded text-black"
      >
        {isCopied ? "Copied!" : "Copy link"}
      </span>
    </div>
  );
};

export default ShareButton;
