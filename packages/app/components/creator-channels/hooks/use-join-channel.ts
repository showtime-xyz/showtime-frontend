import useSWRMutation from "swr/mutation";

import { useOnboardingPromise } from "app/components/onboarding";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useLogInPromise } from "app/lib/login-promise";
import { captureException } from "app/lib/sentry";

import {
  useJoinedChannelsList,
  useSuggestedChannelsList,
} from "./use-channels-list";

async function joinChannel(
  url: string,
  { arg }: { arg: { channelId: number | null | undefined } }
) {
  if (!arg.channelId) {
    Logger.error("Channel id is not provided");
    return;
  }
  return axios({
    url: `/v1/channels/${arg.channelId}/join`,
    method: "POST",
  });
}

export const useJoinChannel = () => {
  const { loginPromise } = useLogInPromise();

  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/channels/join`,
    joinChannel
  );
  const joinedChannels = useJoinedChannelsList();
  const suggestedChannels = useSuggestedChannelsList();
  const { onboardingPromise } = useOnboardingPromise();

  const handleSubmit = useStableCallback(
    async ({ channelId }: { channelId: number | null | undefined }) => {
      try {
        await loginPromise();
        await onboardingPromise();
        await trigger({ channelId });
      } catch (e) {
        captureException(e);
        Logger.error(e);
      } finally {
        suggestedChannels.mutate();
        joinedChannels.mutate();
      }
    }
  );

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};
