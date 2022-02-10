import { Fragment, useState } from "react";

import axios from "@/lib/axios";
import { formatAddressShort } from "@/lib/utilities";
import Link from "next/link";
import useSWR from "swr";

import ModalUserList from "./ModalUserList";
import UserImageList from "./UserImageList";

const FollowersInCommon = ({ profileId }) => {
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  let { data: followersInCommon } = useSWR(
    () => `/api/profile/commonfollows?profileId=${profileId}`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  let { data: followersInCommonComplete } = useSWR(
    () =>
      showFollowersModal &&
      `/api/profile/commonfollows?profileId=${profileId}&isComplete=1`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false, focusThrottleInterval: Infinity }
  );

  if (!followersInCommon || followersInCommon.data.count == 0) return null;

  followersInCommon = followersInCommon.data;

  followersInCommon.followers = followersInCommon.followers.sort((a, b) => {
    if (a.username && !b.username) return -1;
    if (!a.username && b.username) return 1;

    return 0;
  });

  const displayCount = followersInCommon.count === 3 ? 3 : 2;

  return (
    <>
      {typeof document !== "undefined" && followersInCommon.count > 2 ? (
        <ModalUserList
          title="Followed by"
          isOpen={showFollowersModal}
          users={followersInCommonComplete?.data?.followers || []}
          closeModal={() => setShowFollowersModal(false)}
          onRedirect={() => setShowFollowersModal(false)}
          emptyMessage="Loading..."
        />
      ) : null}
      <div className="flex items-center space-x-1">
        <div className="text-sm dark:text-gray-400">
          Followed by{" "}
          <div className="hidden md:inline">
            {followersInCommon.followers
              .slice(0, displayCount)
              .map((follower, i) => (
                <Fragment key={follower.profile_id}>
                  <Link href={`/${follower.username || follower.address}`}>
                    <a className="font-semibold dark:text-gray-300">
                      {follower.username
                        ? `@${follower.username}`
                        : formatAddressShort(follower.address)}
                    </a>
                  </Link>
                  {(followersInCommon.count <= 3 &&
                    followersInCommon.count == i + 2 && (
                      <span>{followersInCommon.count > 2 && ","} &amp; </span>
                    )) ||
                    (followersInCommon.followers.length > i + 1 && (
                      <span>, </span>
                    ))}
                </Fragment>
              ))}
            {followersInCommon.count > 3 && (
              <>
                &amp;{" "}
                <button
                  className="font-semibold dark:text-gray-300"
                  onClick={() => setShowFollowersModal(true)}
                >
                  {followersInCommon.count - 2} other
                  {followersInCommon.count - 2 > 1 ? "s" : ""}
                </button>{" "}
                you follow
              </>
            )}
          </div>
        </div>
        <UserImageList
          users={followersInCommon.followers}
          sizeClass="w-6 h-6"
        />
      </div>
    </>
  );
};

export default FollowersInCommon;
