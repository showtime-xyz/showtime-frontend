import { Platform } from "react-native";

import { useRouter } from "app/navigation/use-router";
import { IEdition } from "app/types";

import { Button } from "design-system/button";

export const ClaimButton = ({ edition }: { edition: IEdition }) => {
  const router = useRouter();

  const onClaimPress = () => {
    const as = `/claim/${edition.contract_address}`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: edition?.contract_address,
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
  };

  if (Platform.OS !== "web") return null;

  return <Button onPress={onClaimPress}>Claim for free</Button>;
};
