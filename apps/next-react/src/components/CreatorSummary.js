import { useContext } from "react";

import AppContext from "@/context/app-context";
import { DEFAULT_PROFILE_PIC } from "@/lib/constants";
import { truncateWithEllipses } from "@/lib/utilities";
import Link from "next/link";

import FollowButton from "./FollowButton";

export default function CreatorSummary({
  name,
  username,
  address,
  imageUrl,
  closeModal,
  bio,
  collectionSlug,
  isCollection,
  profileId,
}) {
  const context = useContext(AppContext);
  return (
    <>
      <div>
        <Link
          href={collectionSlug ? "/c/[collection]" : "/[profile]"}
          as={
            collectionSlug
              ? `/c/${collectionSlug}`
              : username
              ? `/${username}`
              : `/${address}`
          }
        >
          <a onClick={closeModal}>
            <img
              alt={name}
              src={imageUrl ? imageUrl : DEFAULT_PROFILE_PIC}
              className="rounded-full mr-1 inline-block h-16 w-16"
            />
          </a>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-center flex-wrap">
        <Link
          href={collectionSlug ? "/c/[collection]" : "/[profile]"}
          as={
            collectionSlug
              ? `/c/${collectionSlug}`
              : username
              ? `/${username}`
              : `/${address}`
          }
        >
          <a onClick={closeModal}>
            <p className="text-xl md:text-3xl py-2 inline-block dark:text-gray-300 hover:text-stpink dark:hover:text-stpink mr-3">
              {truncateWithEllipses(name, 24)}
            </p>
          </a>
        </Link>
        {!isCollection &&
          profileId &&
          context.myProfile?.profile_id !== profileId && (
            <div className="flex items-center w-1/2 md:w-max py-2">
              <FollowButton
                item={{ profile_id: profileId, follower_count: 0 }}
                followerCount={0}
                setFollowerCount={() => {}}
              />
            </div>
          )}
      </div>
      {bio && (
        <div className="pb-4 pt-2 text-gray-500 dark:text-gray-400">{bio}</div>
      )}
    </>
  );
}
