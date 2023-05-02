import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";

import { createParam } from "app/navigation/use-param";

import { FollowersList, FollowingList } from "./following-user-list";

type Query = {
  profileId: string;
};

const { useParam } = createParam<Query>();

export const FollowingModal = () => {
  const [profileId] = useParam("profileId");
  if (!profileId) return null;

  return <FollowingList profileId={+profileId} />;
};

export const FollowerModal = () => {
  const [profileId] = useParam("profileId");

  if (!profileId) return null;
  return (
    <BottomSheetModalProvider>
      <FollowersList profileId={+profileId} />
    </BottomSheetModalProvider>
  );
};
