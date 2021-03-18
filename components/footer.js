import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="text-center mt-12" style={{ backgroundColor: "#000" }}>
      <div className="text-sm my-8 py-4 text-gray-500  text-center">
        <div className="flex flex-row">
          <div className="flex-grow"></div>
          <div className="px-1">
            <a href="mailto:help@tryshowtime.com" target="_blank">
              <FontAwesomeIcon
                style={{ height: 18, width: 18 }}
                icon={faEnvelope}
              />
            </a>
          </div>
          <div className="px-1">
            <a href="https://twitter.com/tryShowtime" target="_blank">
              <FontAwesomeIcon
                style={{ height: 18, width: 18 }}
                icon={faTwitter}
              />
            </a>
          </div>
          <div className="px-1">
            <a href="https://www.instagram.com/tryshowtime/" target="_blank">
              <FontAwesomeIcon
                style={{ height: 18, width: 18 }}
                icon={faInstagram}
              />
            </a>
          </div>

          <div className="flex-grow"></div>
        </div>
        <div className="">
          <a
            href="https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
            target="_blank"
          >
            Terms & Conditions
          </a>
        </div>
        <div>© 2021 Showtime Technologies, Inc.</div>
      </div>
    </footer>
  );
}

export default Footer;
