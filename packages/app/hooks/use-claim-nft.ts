import { ethers } from "ethers";

import { axios } from "app/lib/axios";

import { pollTransaction } from "./use-drop-nft";
import { useSignerAndProvider, useSignTypedData } from "./use-signer-provider";

const minterABI = ["function mintEdition(address collection, address _to)"];

const onePerAddressMinterContract =
  "0x50c001362FB06E2CB4D4e8138654267328a8B247";

export const useClaimNFT = () => {
  const signTypedData = useSignTypedData();
  const { getUserAddress } = useSignerAndProvider();
  const claimNFT = async (props: { editionAddress: string }) => {
    const targetInterface = new ethers.utils.Interface(minterABI);
    const userAddress = await getUserAddress();
    const callData = targetInterface.encodeFunctionData("mintEdition", [
      props.editionAddress,
      userAddress,
    ]);

    const { data: forwardRequest } = await axios({
      url: `/v1/relayer/forward-request?call_data=${encodeURIComponent(
        callData
      )}&to_address=${encodeURIComponent(onePerAddressMinterContract)}`,
      method: "GET",
    });

    console.log("Signing...");
    const signature = await signTypedData(
      forwardRequest.domain,
      forwardRequest.types,
      forwardRequest.value
    );

    console.log("Signature", signature);
    console.log("Submitting tx...");
    const { data: relayedTx } = await axios({
      url: `/v1/relayer/forward-request`,
      method: "POST",
      data: {
        forward_request: forwardRequest,
        signature,
      },
    });

    const mint = await pollTransaction(
      relayedTx.relayed_transaction_id,
      "poll-mint"
    );

    if (!mint) {
      throw new Error("Edition minting failed");
    }
  };

  return claimNFT;
};
