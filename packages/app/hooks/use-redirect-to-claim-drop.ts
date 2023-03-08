import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";
import {
  useNavigateToLogin,
  useNavigateToOnboarding,
} from "app/navigation/use-navigate-to";
import { createParam } from "app/navigation/use-param";

const { useParam } = createParam<{
  password: string;
}>();

export const useRedirectToClaimDrop = () => {
  const { isAuthenticated, isIncompletedProfile } = useUser();
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  const navigateToOnboarding = useNavigateToOnboarding();

  const [password] = useParam("password");

  const redirectToClaimDrop = (
    editionContractAddress: string,
    shouldUseReplace: boolean = false
  ) => {
    if (!isAuthenticated) {
      navigateToLogin();
    } else if (isIncompletedProfile) {
      navigateToOnboarding(`/claim/${editionContractAddress}`);
    } else {
      const as = `/claim/${editionContractAddress}`;
      const route = Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: editionContractAddress,
            password,
            claimModal: true,
          },
        } as any,
      });
      if (shouldUseReplace) {
        router.replace(
          route,
          Platform.select({ native: as, web: router.asPath }),
          { shallow: true }
        );
      } else {
        router.push(
          route,
          Platform.select({ native: as, web: router.asPath }),
          { shallow: true }
        );
      }
    }
  };

  return redirectToClaimDrop;
};
