import { useEffectOnce } from "@showtime-xyz/universal.hooks";

import { useRedirectToChannelIntro } from "app/hooks/use-redirect-to-channel-intro";
import { getIsShowCreatorChannelIntro } from "app/lib/mmkv-keys";

export const useIntroducingCreatorChannels = () => {
  const redirectToCreatorChannelIntro = useRedirectToChannelIntro();
  useEffectOnce(() => {
    if (getIsShowCreatorChannelIntro()) {
      setTimeout(() => {
        redirectToCreatorChannelIntro();
      }, 600);
    }
  });
};
