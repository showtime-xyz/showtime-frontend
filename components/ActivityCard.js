import React, { useContext } from "react";
import { ACTIVITY_TYPES } from "../lib/constants";
import {
  Like,
  Comment,
  Sell,
  Buy,
  Create,
  Follow,
  Transfer,
} from "./ActivityTypes";
import { activityIconObjects } from "../lib/constants";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import AppContext from "../context/app-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LikeButton from "./LikeButton";

export default function ActivityCard({ act }) {
  const { isMobile } = useContext(AppContext);
  const {
    nfts,
    actor_img_url,
    actor_name,
    actor_username,
    actor_wallet_address,
  } = act;
  const actor = {
    profile_img_url: actor_img_url,
    name: actor_name,
    username: actor_username,
    wallet_address: actor_wallet_address,
  };
  const single = act.nfts?.length === 1;
  let content = null;

  const { type } = act;
  switch (type) {
    case ACTIVITY_TYPES.LIKE:
      content = <Like act={act} />;
      break;
    case ACTIVITY_TYPES.COMMENT:
      content = <Comment act={act} />;
      break;
    case ACTIVITY_TYPES.SELL:
      content = <Sell act={act} />;
      break;
    case ACTIVITY_TYPES.BUY:
      content = <Buy act={act} />;
      break;
    case ACTIVITY_TYPES.CREATE:
      content = <Create act={act} />;
      break;
    case ACTIVITY_TYPES.FOLLOW:
      content = <Follow act={act} />;
      break;
    case ACTIVITY_TYPES.SEND:
    case ACTIVITY_TYPES.RECEIVE:
      content = <Transfer act={act} />;

    default:
      break;
  }
  return (
    <div
      className="flex flex-col flex-1 px-4 py-6 border-b border-gray-200 hover:bg-gray-100"
      style={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
    >
      {/* actor data */}
      <div className="flex items-start">
        <Link
          href="/[profile]"
          as={`/${actor?.username || actor?.wallet_address}`}
        >
          <a className="relative w-max flex-shrink-0">
            <img
              src={
                actor.profile_img_url ||
                "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
              style={{ width: 48, height: 48 }}
              className="rounded-full mr-2"
            />
            <div
              className="absolute bottom-0 left-0 rounded-full h-5 w-5 flex items-center justify-center shadow"
              style={{
                backgroundColor: activityIconObjects[type].color,
              }}
            >
              <FontAwesomeIcon
                style={{
                  height: 12,
                  width: 12,
                }}
                icon={activityIconObjects[type].icon}
                color="white"
              />
            </div>
          </a>
        </Link>
        <div className="flex flex-col flex-1 max-w-full">
          <div className="flex items-start">
            <Link
              href="/[profile]"
              as={`/${actor?.username || actor?.wallet_address}`}
            >
              <a>
                <div className="mr-2">{actor.name}</div>
              </a>
            </Link>

            {actor.username && (
              <Link
                href="/[profile]"
                as={`/${actor?.username || actor?.wallet_address}`}
              >
                <a>
                  <div className="text-gray-500 mr-2">@{actor.username}</div>
                </a>
              </Link>
            )}
            <div className="text-gray-500">
              <span className="mr-2">·</span>
              {formatDistanceToNowStrict(new Date(`${act.timestamp}Z`), {
                addSuffix: true,
              })}
            </div>
          </div>
          {/* content */}
          <div className="max-w-full">{content}</div>
          {single && <LikeButton item={nfts[0]} />}
        </div>
      </div>
    </div>
  );
}
