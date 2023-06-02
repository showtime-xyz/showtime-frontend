import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";

import { createParam } from "app/navigation/use-param";

import { useChannelMembers } from "./hooks/use-channel-members";
import { CreatorChannelUserList } from "./user-list";

type Query = {
  channelId: string;
};

const { useParam } = createParam<Query>();

export const CreatorChannelsMembersModal = () => {
  const [channelId] = useParam("channelId");
  const { data, isLoading } = useChannelMembers(channelId);
  if (!channelId) return null;
  return (
    <BottomSheetModalProvider>
      <CreatorChannelUserList loading={isLoading} users={data} />
    </BottomSheetModalProvider>
  );
};
