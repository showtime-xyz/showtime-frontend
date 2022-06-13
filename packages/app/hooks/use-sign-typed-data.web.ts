import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { useSignTypedData as useWagmiSignTypedData, useNetwork } from "wagmi";

import { useAlert } from "@showtime-xyz/universal.alert";

import { CHAIN_IDENTIFIERS } from "app/lib/constants";

const EXPECTED_CHAIN_ID =
  //@ts-ignore
  CHAIN_IDENTIFIERS[process.env.NEXT_PUBLIC_CHAIN_ID || "polygon"];

export const useSignTypedData = () => {
  const { activeChain, switchNetwork } = useNetwork();
  const Alert = useAlert();
  const { signTypedDataAsync } = useWagmiSignTypedData();

  const signTypedData = async (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
    onError: (e: string) => void
  ) => {
    if (activeChain?.id !== parseInt(EXPECTED_CHAIN_ID)) {
      onError(
        "Wallet must point to polygon network to complete the transaction"
      );
      Alert.alert(
        "Switch network",
        "Wallet must point to polygon network to complete the transaction",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Switch chain",
            onPress: async () => {
              try {
                switchNetwork?.(parseInt(EXPECTED_CHAIN_ID));
              } catch (e) {
                Alert.alert(
                  "Network switching failed",
                  "Please switch network to polygon in your wallet and try again."
                );
              }
            },
          },
        ]
      );
      return null;
    } else {
      const result = await signTypedDataAsync({ domain, types, value });
      return result;
    }
  };

  return signTypedData;
};
