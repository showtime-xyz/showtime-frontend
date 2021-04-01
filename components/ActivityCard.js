import React, { Suspense } from "react";
import { ACTIVITY_TYPES } from "../lib/constants";
import { Like } from "./ActivityTypes";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
// const Like = React.lazy(() => import("./ActivityTypes/Like"));

export default function ActivityCard({ act }) {
  const actor = act.actor_data;
  let content = null;
  switch (act.type) {
    case ACTIVITY_TYPES.LIKE:
      content = <Like act={act} />;
    default:
      break;
  }
  return (
    <div className="flex flex-col flex-1 px-4 py-6 border-b border-gray-200 hover:bg-gray-100 text-sm md:text-base">
      {/* actor data */}
      <div className="flex items-start">
        <Link
          href="/[profile]"
          as={`/${actor?.username || actor?.wallet_address}`}
        >
          <a>
            <img
              src={actor.profile_img_url}
              style={{ width: 48, height: 48 }}
              className="rounded-full mr-2"
            />
          </a>
        </Link>
        <div className="flex flex-col">
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
                  <div className="text-gray-400 mr-2">@{actor.username}</div>
                </a>
              </Link>
            )}
            <div className="text-gray-400">
              <span className="mr-2">·</span>
              {formatDistanceToNowStrict(new Date(act.timestamp), {
                addSuffix: true,
              })}
            </div>
          </div>
          <div>{content}</div>
        </div>
      </div>
      {/* content */}
    </div>
  );
}
