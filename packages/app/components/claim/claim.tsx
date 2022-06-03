import { useState } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";

import { ClaimExplanation } from "./claim-explanation";
import { ClaimForm } from "./claim-form";

const { useParam } = createParam<{ contractAddress: string }>();

export const Claim = () => {
  const [contractAddress] = useParam("contractAddress");
  const [showExplanation, setShowExplanation] = useState(true);
  const {
    data: edition,
    loading,
    error,
    mutate,
  } = useCreatorCollectionDetail(contractAddress);

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

  if (showExplanation) {
    return (
      <ClaimExplanation
        edition={edition?.creator_airdrop_edition}
        onDone={() => setShowExplanation(false)}
      />
    );
  }

  if (!edition) return null;

  return <ClaimForm edition={edition} />;
};
