import { useEffect } from "react";

import { useRedirectToChannelIntro } from "app/hooks/use-redirect-to-channel-intro";
import { useUser } from "app/hooks/use-user";
import { getIsShowCreatorChannelIntro } from "app/lib/mmkv-keys";

import { useChannelById } from "../creator-channels/hooks/use-channel-detail";

export const useIntroducingCreatorChannels = () => {
  const { user: userProfile } = useUser();
  const channelId = userProfile?.data.channels?.[0];
  const { data } = useChannelById(channelId?.toString());
  const redirectToCreatorChannelIntro = useRedirectToChannelIntro();

  useEffect(() => {
    if (
      data?.latest_message_updated_at === null &&
      getIsShowCreatorChannelIntro()
    ) {
      setTimeout(() => {
        redirectToCreatorChannelIntro();
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.latest_message_updated_at]);
};
