import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";
import { useUser } from "app/hooks/use-user";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import { createParam } from "app/navigation/use-param";

const { useParam } = createParam<{
  password: string;
}>();

export const useRedirectToClaimDrop = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  const { onboardingPromise } = useOnboardingPromise();

  const [password] = useParam("password");

  const redirectToClaimDrop = async (
    editionContractAddress: string,
    shouldUseReplace: boolean = false
  ) => {
    if (!isAuthenticated) {
      navigateToLogin();
    } else {
      await onboardingPromise();
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
          {
            shallow: true,
            experimental: {
              nativeBehavior: "stack-replace",
              isNestedNavigator: true,
            },
          }
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
