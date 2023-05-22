import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";

import { useFollowingList } from "app/hooks/api/use-follow-list";
import { createParam } from "app/navigation/use-param";

import { CreatorChannelUserList } from "./user-list";

type Query = {
  channelId: string;
};

const { useParam } = createParam<Query>();

export const CreatorChannelsMembersModal = () => {
  const [channelId] = useParam("channelId");
  const { data, loading } = useFollowingList(17784243);

  if (!channelId) return null;
  return (
    <BottomSheetModalProvider>
      <CreatorChannelUserList loading={loading} users={data?.list} />
    </BottomSheetModalProvider>
  );
};
