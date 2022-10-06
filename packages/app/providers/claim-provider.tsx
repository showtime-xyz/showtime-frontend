import { ReactNode, useReducer, useState, useEffect } from "react";

import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import { ClaimContext } from "app/context/claim-context";
import { PROFILE_NFTS_QUERY_KEY } from "app/hooks/api-hooks";
import { reducer, initialState } from "app/hooks/use-claim-nft";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useRudder } from "app/lib/rudderstack";
import { delay } from "app/utilities";

type ClaimProviderProps = {
  children: ReactNode;
};

export function ClaimProvider({ children }: ClaimProviderProps) {
  const { rudder } = useRudder();
  const [state, dispatch] = useReducer(reducer, initialState);
  const snackbar = useSnackbar();
  const mutate = useMatchMutate();
  const [contractAddress, setContractAddress] = useState("");
  const { mutate: mutateEdition } = useCreatorCollectionDetail(contractAddress);
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const bottom = usePlatformBottomHeight();

  const pollTransaction = async (transactionId: any, contractAddress: any) => {
    setContractAddress(contractAddress);

    snackbar?.show({
      text: "Claiming...",
      iconStatus: "waiting",
      bottom,
      hideAfter: 15000,
    });

    let intervalMs = 2000;
    for (let attempts = 0; attempts < 100; attempts++) {
      Logger.log(`Checking tx... (${attempts + 1} / 20)`);
      const response = await axios({
        url: `/v1/creator-airdrops/poll-mint?relayed_transaction_id=${transactionId}`,
        method: "GET",
      });
      Logger.log(response);

      dispatch({
        type: "transactionHash",
        transactionHash: response.transaction_hash,
      });

      if (response.is_complete) {
        rudder?.track("NFT Claimed");
        snackbar?.show({
          text: "Claimed!",
          iconStatus: "done",
          bottom,
          hideAfter: 25000,
          action: {
            text: "Share",
            onPress: () => {
              redirectToClaimDrop(contractAddress);
              dispatch({
                type: "share",
              });
            },
          },
        });

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

  useEffect(() => {
    if (state.status === "success") {
      snackbar?.show({
        text: "Claimed!",
        iconStatus: "done",
        bottom,
        hideAfter: 25000,
        action: {
          text: "Share",
          onPress: () => {
            redirectToClaimDrop(contractAddress);
            dispatch({
              type: "share",
            });
          },
        },
      });
    }
  }, [state, bottom, snackbar, redirectToClaimDrop, contractAddress]);

  return (
    <ClaimContext.Provider value={{ state, dispatch, pollTransaction }}>
      {children}
    </ClaimContext.Provider>
  );
}
