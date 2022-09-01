import { useReducer, useEffect, useRef, useCallback } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";

import { PROFILE_NFTS_QUERY_KEY } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useSignTypedData } from "app/hooks/use-sign-typed-data";
import { useWallet } from "app/hooks/use-wallet";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useRudder } from "app/lib/rudderstack";
import { captureException } from "app/lib/sentry";
import { IEdition } from "app/types";
import { ledgerWalletHack } from "app/utilities";
import { delay } from "app/utilities";

const minterABI = ["function mintEdition(address _to)"];

const getForwarderRequest = async ({
  minterAddress,
  userAddress,
}: {
  minterAddress: string;
  userAddress: string;
}) => {
  const Interface = (await import("@ethersproject/abi")).Interface;
  const targetInterface = new Interface(minterABI);
  const callData = targetInterface.encodeFunctionData("mintEdition", [
    userAddress,
  ]);
  const res = await axios({
    url: `/v1/relayer/forward-request?call_data=${encodeURIComponent(
      callData
    )}&to_address=${encodeURIComponent(
      minterAddress
    )}&from_address=${encodeURIComponent(userAddress)}`,
    method: "GET",
  });

  return res;
};

type State = {
  status: "idle" | "loading" | "success" | "error";
  error?: string;
  transactionHash?: string;
  mint?: any;
  signaturePrompt?: boolean;
};

type Action = {
  error?: string;
  type: string;
  transactionHash?: string;
  mint?: any;
};

const initialState: State = {
  status: "idle",
  signaturePrompt: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "success":
      return {
        ...state,
        status: "success",
        mint: action.mint,
      };
    case "transactionHash":
      return {
        ...state,
        transactionHash: action.transactionHash,
      };
    case "signaturePrompt": {
      return {
        ...state,
        signaturePrompt: true,
      };
    }

    case "signatureSuccess": {
      return {
        ...state,
        signaturePrompt: false,
      };
    }
    case "error":
      return {
        ...state,
        status: "error",
        signaturePrompt: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export const useClaimNFT = (edition?: IEdition) => {
  const { rudder } = useRudder();
  const signTypedData = useSignTypedData();
  const [state, dispatch] = useReducer(reducer, initialState);
  const mutate = useMatchMutate();
  const Alert = useAlert();
  const { mutate: mutateEdition } = useCreatorCollectionDetail(
    edition?.contract_address
  );
  const { connect } = useWallet();
  const { userAddress } = useCurrentUserAddress();

  // @ts-ignore
  const signTransaction = async ({ forwardRequest }) => {
    dispatch({ type: "signaturePrompt" });

    const signature = await signTypedData(
      forwardRequest.domain,
      forwardRequest.types,
      forwardRequest.value
    );

    dispatch({ type: "signatureSuccess" });

    const newSignature = ledgerWalletHack(signature);
    Logger.log("Signature", { signature, newSignature });
    Logger.log("Submitting tx...");

    const relayedTx = await axios({
      url: `/v1/relayer/forward-request`,
      method: "POST",
      data: {
        forward_request: forwardRequest,
        signature: newSignature,
        from_address: userAddress,
      },
    });

    let intervalMs = 2000;
    for (let attempts = 0; attempts < 100; attempts++) {
      Logger.log(`Checking tx... (${attempts + 1} / 20)`);
      const response = await axios({
        url: `/v1/creator-airdrops/poll-mint?relayed_transaction_id=${relayedTx.relayed_transaction_id}`,
        method: "GET",
      });
      Logger.log(response);

      dispatch({
        type: "transactionHash",
        transactionHash: response.transaction_hash,
      });

      if (response.is_complete) {
        rudder?.track("NFT Claimed");
        dispatch({ type: "success", mint: response.mint });
        mutate((key) => key.includes(PROFILE_NFTS_QUERY_KEY));
        mutateEdition((d) => {
          if (d) {
            return {
              ...d,
              is_already_claimed: true,
              total_claimed_count: d?.total_claimed_count + 1,
            };
          }
        });

        return;
      }

      await delay(intervalMs);
    }

    dispatch({ type: "error", error: "polling timed out" });
  };

  const forwarderRequestCached = useRef<any>();

  useEffect(() => {
    let timeout: any;
    async function initialiseForwardRequest() {
      if (edition?.minter_address && userAddress) {
        forwarderRequestCached.current = await getForwarderRequest({
          userAddress,
          minterAddress: edition?.minter_address,
        });
      }

      // clear cached forwarderRequest because nonce might have changed!
      timeout = setTimeout(() => {
        forwarderRequestCached.current = null;
      }, 20000);
    }
    initialiseForwardRequest();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [edition?.minter_address, userAddress]);

  const claimNFT = async (): Promise<boolean | undefined> => {
    try {
      if (userAddress) {
        if (edition?.minter_address) {
          dispatch({ type: "loading" });

          let forwardRequest: any;
          if (forwarderRequestCached.current) {
            forwardRequest = forwarderRequestCached.current;
          } else {
            forwardRequest = await getForwarderRequest({
              minterAddress: edition?.minter_address,
              userAddress,
            });
          }

          Logger.log("Signing... ", forwardRequest);

          await signTransaction({ forwardRequest });

          return true;
        }
      } else {
        // user is probably not connected to wallet
        connect();
      }
    } catch (e: any) {
      dispatch({ type: "error", error: e?.message });
      forwarderRequestCached.current = null;
      Logger.error("nft drop claim failed", e);

      if (e?.response?.status === 420) {
        Alert.alert(
          "Wow, you love claiming drops!",
          "Only 5 claims per day is allowed. Come back tomorrow!"
        );
      }

      if (e?.response?.status === 500) {
        Alert.alert(
          "Oops. An error occured.",
          "We are currently experiencing a lot of usage. Please try again in one hour!"
        );
      }

      captureException(e);
    }
  };

  const onReconnectWallet = useCallback(() => {
    dispatch({
      type: "error",
      error: "Please retry claiming the drop",
    });
  }, []);

  return {
    state,
    claimNFT,
    onReconnectWallet,
  };
};
