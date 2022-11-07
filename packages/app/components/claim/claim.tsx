import { useState } from "react";

import { MMKV } from "react-native-mmkv";

import { Button } from "@showtime-xyz/universal.button";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";

import { ClaimExplanation } from "./claim-explanation";
import { ClaimForm } from "./claim-form";

const { useParam } = createParam<{
  contractAddress: string;
  password: string;
}>();

const store = new MMKV();
const STORE_KEY = "showClaimExplanation";

export const Claim = () => {
  const [contractAddress] = useParam("contractAddress");
  const [password] = useParam("password");
  const [showExplanation, setShowExplanation] = useState(
    () => store.getBoolean(STORE_KEY) ?? true
  );
  const {
    data: edition,
    loading,
    error,
    mutate,
  } = useCreatorCollectionDetail(contractAddress);

  const hideExplanation = () => {
    setShowExplanation(false);
    store.set(STORE_KEY, false);
  };

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

  if (showExplanation) {
    return (
      <ClaimExplanation
        edition={edition?.creator_airdrop_edition}
        onDone={hideExplanation}
      />
    );
  }

  if (!edition) return null;

  return <ClaimForm edition={edition} password={password} />;
};
