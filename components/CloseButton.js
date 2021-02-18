import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import mixpanel from "mixpanel-browser";

const CloseButton = ({ setEditModalOpen, isDetailModal }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        cursor: "pointer",
        zIndex: 4,
      }}
      onClick={() => {
        setEditModalOpen(false);
        if (isDetailModal) {
          mixpanel.track("Close NFT modal - x button");
        }
      }}
    >
      <FontAwesomeIcon
        style={{
          height: 24,
          width: 24,
          color: "#ccc",
        }}
        icon={faTimes}
      />
    </div>
  );
};

export default CloseButton;
