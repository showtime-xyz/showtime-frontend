import { ReactNode, useReducer, useState } from "react";

import { ClaimContext } from "app/context/claim-context";
import { PROFILE_NFTS_QUERY_KEY } from "app/hooks/api-hooks";
import { reducer, initialState } from "app/hooks/use-claim-nft";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { delay } from "app/utilities";

type ClaimProviderProps = {
  children: ReactNode;
};

export function ClaimProvider({ children }: ClaimProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mutate = useMatchMutate();
  const [contractAddress, setContractAddress] = useState("");
  const { mutate: mutateEdition } = useCreatorCollectionDetail(contractAddress);

  const pollTransaction = async (transactionId: any, contractAddress: any) => {
    setContractAddress(contractAddress);

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

  return (
    <ClaimContext.Provider value={{ state, dispatch, pollTransaction }}>
      {children}
    </ClaimContext.Provider>
  );
}
