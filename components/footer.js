import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faInstagram,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import ModalFeedback from "./ModalFeedback";
import AppContext from "../context/app-context";
function Footer() {
  const { user, setLoginModalOpen } = useContext(AppContext);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalFeedback
            isOpen={isFeedbackModalOpen}
            closeModal={() => setIsFeedbackModalOpen(false)}
          />
        </>
      ) : null}
      <footer className="text-center mt-12" style={{ backgroundColor: "#000" }}>
        <div
          className="text-sm my-8 py-4 text-center"
          style={{ color: "#999" }}
        >
          <div className="flex flex-row">
            <div className="flex-grow"></div>
            <div className="px-1">
              <a
                href="mailto:help@tryshowtime.com"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FontAwesomeIcon
                  style={{ height: 18, width: 18 }}
                  icon={faEnvelope}
                />
              </a>
            </div>
            <div className="px-1">
              <a
                href="https://twitter.com/tryShowtime"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FontAwesomeIcon
                  style={{ height: 18, width: 18 }}
                  icon={faTwitter}
                />
              </a>
            </div>
            <div className="px-1">
              <a
                href="https://www.instagram.com/tryshowtime/"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FontAwesomeIcon
                  style={{ height: 18, width: 18 }}
                  icon={faInstagram}
                />
              </a>
            </div>
            <div className="px-1">
              <a
                href="https://discord.gg/FBSxXrcnsm"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FontAwesomeIcon
                  style={{ height: 18, width: 18 }}
                  icon={faDiscord}
                />
              </a>
            </div>

            <div className="flex-grow"></div>
          </div>
          <div>
            <a
              href="https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
              target="_blank"
              className="hover:text-gray-300"
            >
              Terms & Conditions
            </a>
            {"  ·  "}
            <span
              className="cursor-pointer hover:text-gray-300"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              Feedback
            </span>
          </div>
          <div>© 2021 Showtime Technologies, Inc.</div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
