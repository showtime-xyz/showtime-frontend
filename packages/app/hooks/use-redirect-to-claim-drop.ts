import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";

const { useParam } = createParam<{
  password: string;
}>();

export const useRedirectToClaimDrop = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const [password] = useParam("password");

  const redirectToClaimDrop = (editionContractAddress: string) => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const as = `/claim/${editionContractAddress}`;

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
            },
          } as any,
        }),
        Platform.select({
          native: as,
          web: router.asPath,
        }),
        { shallow: true }
      );
    }
  };

  return redirectToClaimDrop;
};
