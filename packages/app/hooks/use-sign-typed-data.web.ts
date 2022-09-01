import type {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  useSignTypedData as useWagmiSignTypedData,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

import { useAlert } from "@showtime-xyz/universal.alert";

import { CHAIN_IDENTIFIERS } from "app/lib/constants";

import { useWeb3 } from "./use-web3";

const EXPECTED_CHAIN_ID =
  //@ts-ignore
  CHAIN_IDENTIFIERS[process.env.NEXT_PUBLIC_CHAIN_ID || "polygon"];

export const useSignTypedData = () => {
  let { web3 } = useWeb3();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const Alert = useAlert();
  const { signTypedDataAsync } = useWagmiSignTypedData();

  const signTypedData = async (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        if (web3) {
          const result = await web3
            .getSigner()
            ._signTypedData(domain, types, value);

          resolve(result);
        } else {
          const result = await signTypedDataAsync({ domain, types, value });
          resolve(result);
        }
      } catch (e) {
        // Assuming transaction failed due to wrong network because checking error code is buggy
        // Putting it in error as Rainbow doesn't require switching network while signing chain
        if (chain?.id !== parseInt(EXPECTED_CHAIN_ID)) {
          Alert.alert(
            "Switch network",
            "Wallet must point to polygon network to complete the transaction",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  reject(
                    new Error(
                      "Please switch network to polygon in your wallet and try again"
                    )
                  );
                },
              },
              {
                text: "Switch chain",
                onPress: async () => {
                  try {
                    await switchNetworkAsync?.(parseInt(EXPECTED_CHAIN_ID));
                    const result = await signTypedData(domain, types, value);
                    resolve(result);
                  } catch (e) {
                    reject(
                      new Error(
                        "Please switch network to polygon in your wallet and try again"
                      )
                    );
                    Alert.alert(
                      "Network switching failed",
                      "Please switch network to polygon in your wallet and try again."
                    );
                  }
                },
              },
            ]
          );
        } else {
          reject(e);
        }
      }
    });
  };

  return signTypedData;
};
