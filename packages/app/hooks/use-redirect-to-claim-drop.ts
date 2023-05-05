import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";
import { useLogInPromise } from "app/lib/login-promise";
import { createParam } from "app/navigation/use-param";

const { useParam } = createParam<{
  password: string;
}>();

export const useRedirectToClaimDrop = () => {
  const router = useRouter();
  const { onboardingPromise } = useOnboardingPromise();
  const { loginPromise } = useLogInPromise();

  const [password] = useParam("password");

  const redirectToClaimDrop = async (
    editionContractAddress: string,
    type?: string
  ) => {
    await loginPromise();
    await onboardingPromise();
    const params = type ? `?type=${type}` : "";
    const as = `/claim/${editionContractAddress}${params}`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: editionContractAddress,
            password,
            claimModal: true,
            type,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  };

  return redirectToClaimDrop;
};
