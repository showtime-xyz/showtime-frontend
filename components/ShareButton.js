import React, { useState } from "react";

const ShareButton = () => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <>
      {/*<button
      className="inline-flex mr-4 px-2 py-2 rounded-md"
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      style={isHovering ? { backgroundColor: "rgba(125,92,255,0.4)" } : null}
    >
      <img
        src={isHovering ? "/icons/share-purple.svg" : "/icons/share-white.svg"}
        alt="share-button"
        className="h-6 w-6 items-center flex"
      />
    </button>*/}
    </>
  );
};

export default ShareButton;
