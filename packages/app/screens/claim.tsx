import { Button } from "@showtime-xyz/universal.button";
import { withModalScreen } from "@showtime-xyz/universal.modal-screen";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { Claim } from "app/components/claim";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";

const { useParam } = createParam<{ contractAddress: string }>();

const ClaimModal = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data, loading, error, mutate } =
    useCreatorCollectionDetail(contractAddress);

  if (error) {
    return (
      <Button onPress={mutate}>Something went wrong. Please Try again</Button>
    );
  }

  if (loading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (!data) return null;

  return <Claim edition={data} />;
};

export const ClaimScreen = withModalScreen(ClaimModal, {
  title: "Claim",
  matchingPathname: "/claim/[contractAddress]",
  matchingQueryParam: "claimModal",
  disableBackdropPress: true,
});
