import React from "react";
import ScrollUpButton from "react-scroll-up-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function ScrollUp() {
  return (
    <ScrollUpButton
      ContainerClassName="scrollUpButton"
      TransitionClassName="scrollUpButtonTransition"
    >
      <FontAwesomeIcon
        style={{
          height: 32,
          width: 32,
          color: "#fff",
        }}
        icon={faChevronUp}
      />
    </ScrollUpButton>
  );
}
