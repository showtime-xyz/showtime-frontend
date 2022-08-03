import type {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";

import { useSwitchNetwork } from "./use-switch-network";

export const useSignTypedData = () => {
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const { switchNetwork } = useSwitchNetwork();

  const signTypedData = async (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | number>
  ) => {
    // magic or web
    try {
      if (web3) {
        const result = await web3
          .getSigner()
          ._signTypedData(domain, types, value);
        return result;
      }
    } catch (e: any) {
      Logger.error("signing failed with error", e);

      if (
        e.code === -32603 ||
        (typeof e.message === "string" && e.message.includes("chainId"))
      ) {
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
                  await switchNetwork();
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
      }
    }
  };

  return signTypedData;
};
