import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";

import { UserList } from "app/components/user-list";
import { useFollowingList } from "app/hooks/api/use-follow-list";
import { createParam } from "app/navigation/use-param";

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
      <UserList loading={loading} users={data?.list} />
    </BottomSheetModalProvider>
  );
};
