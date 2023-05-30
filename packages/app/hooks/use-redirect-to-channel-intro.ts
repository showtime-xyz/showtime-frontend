import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";

export const useRedirectToChannelIntro = () => {
  const router = useRouter();
  const { onboardingPromise } = useOnboardingPromise();

  const redirectToChannelIntro = async () => {
    await onboardingPromise();
    const as = `/channels/intro`;
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
