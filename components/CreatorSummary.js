import React from "react";
import Link from "next/link";
import { truncateWithEllipses } from "../lib/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function CreatorSummary({
  name,
  username,
  address,
  imageUrl,
  closeModal,
  bio,
}) {
  return (
    <>
      <div>
        <Link href="/[profile]" as={username ? `/${username}` : `/${address}`}>
          <a onClick={closeModal}>
            <img
              alt={name}
              src={
                imageUrl
                  ? imageUrl
                  : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
              className="rounded-full mr-1 inline-block"
              style={{ height: 64, width: 64 }}
            />
          </a>
        </Link>
      </div>
      <Link href="/[profile]" as={username ? `/${username}` : `/${address}`}>
        <a onClick={closeModal}>
          <p className="text-xl md:text-3xl py-4 inline-block hover:text-stpink">
            {truncateWithEllipses(name, 26)}
          </p>
        </a>
      </Link>
      {bio && <div className="pb-4 text-gray-500">{bio}</div>}
      <Link href="/[profile]" as={username ? `/${username}` : `/${address}`}>
        <a onClick={closeModal}>
          <div className="px-6 py-2 mt-2 border-2 border-gray-300 rounded-xl flex items-center justify-center w-max text-gray-300 hover:border-stpink hover:text-stpink">
            <span className="mr-2 text-black">Artist Profile</span>
            <FontAwesomeIcon
              style={{
                height: 18,
                width: 18,
              }}
              icon={faArrowRight}
              color="inherit"
            />
          </div>
        </a>
      </Link>
    </>
  );
}
