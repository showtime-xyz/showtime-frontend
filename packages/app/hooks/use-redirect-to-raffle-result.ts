import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

export const useRedirectToRaffleResult = () => {
  const router = useRouter();

  const redirectToRaffleResult = async (editionContractAddress: string) => {
    const as = `/raffle/${editionContractAddress}`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: editionContractAddress,
            raffleModal: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  };

  return redirectToRaffleResult;
};
