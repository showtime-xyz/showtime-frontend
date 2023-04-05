import { Button } from "@showtime-xyz/universal.button";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";

import { ClaimForm } from "./claim-form";

const { useParam } = createParam<{
  contractAddress: string;
  password: string;
}>();

export const Claim = () => {
  const [contractAddress] = useParam("contractAddress");
  const [password] = useParam("password");
  const {
    data: edition,
    loading,
    error,
    mutate,
  } = useCreatorCollectionDetail(contractAddress);

  if (error) {
    return (
      <Button onPress={() => mutate()}>
        Something went wrong. Please try again!
      </Button>
    );
  }

  if (loading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (!edition) return null;

  return <ClaimForm edition={edition} password={password} />;
};
