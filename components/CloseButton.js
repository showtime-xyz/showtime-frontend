import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CloseButton = ({ setEditModalOpen }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        cursor: "pointer",
      }}
      onClick={() => {
        setEditModalOpen(false);
      }}
    >
      <FontAwesomeIcon
        style={{
          height: 20,
          width: 20,
          color: "#ccc",
        }}
        icon={faTimes}
      />
    </div>
  );
};

export default CloseButton;
