import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";

import { useUser } from "./use-user";

export const useRedirectToChannelIntro = () => {
  const router = useRouter();
  const { onboardingPromise } = useOnboardingPromise();
  const { user } = useUser();
  const redirectToChannelIntro = async () => {
    await onboardingPromise();
    const as = `/channels/intro`;
    if (!user?.data?.profile?.verified) {
      return;
    }

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            channelsIntroModal: true,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  };

  return redirectToChannelIntro;
};
