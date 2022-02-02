import { ethers } from "ethers";
import { Alert } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useContext, useEffect, useReducer, useState } from "react";

import { useUser } from "./use-user";
import { getBiconomy } from "app/utilities";
import minterAbi from "app/abi/ShowtimeMT.json";
import { AppContext } from "app/context/app-context";

type BurnNFTType = {
  status: "idle" | "burning" | "burningError" | "burningSuccess";
  transaction?: string;
};

const initialBurnNFTState: BurnNFTType = {
  status: "idle",
  transaction: undefined,
};

const burnNFTReducer = (state: BurnNFTType, action: any): BurnNFTType => {
  switch (action.type) {
    case "burning":
      return {
        ...state,
        status: "burning",
        transaction: undefined,
      };
    case "burningError":
      return { ...state, status: "burningError" };
    case "burningSuccess":
      return {
        ...state,
        status: "burningSuccess",
        transaction: action.transaction,
      };
    default:
      return state;
  }
};

export type UseBurnNFT = {
  copies: number;
  tokenId: string;
};

export const useBurnNFT = () => {
  const [state, dispatch] = useReducer(burnNFTReducer, initialBurnNFTState);
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState<string>();
  const connector = useWalletConnect();
  const context = useContext(AppContext);

  const getActiveUserAddress = async () => {
    const isMagic = !!context.web3;

    if (isMagic) {
      const signer = context.web3.getSigner();
      const activeMagicAddress = await signer.getAddress();
      setUserAddress(activeMagicAddress);
    } else if (connector.connected) {
      const [connectorAddress] = connector.accounts.filter((address) =>
        address.startsWith("0x")
      );
      if (connectorAddress) {
        setUserAddress(connectorAddress);
      }
    } else {
      await connector.connect();
      console.log("Not connected to wallet, sending connect request");
    }
  };

  useEffect(() => {
    getActiveUserAddress();
  }, [user, context.web3]);

  async function burnToken({ ...params }: UseBurnNFT) {
    return new Promise<{ transaction: string }>(async (resolve, reject) => {
      const { biconomy } = await getBiconomy(connector, context.web3);

      const contract = new ethers.Contract(
        //@ts-ignore
        process.env.NEXT_PUBLIC_MINTING_CONTRACT,
        minterAbi,
        biconomy.getSignerByAddress(userAddress)
      );

      const { data } = await contract.populateTransaction.burn(
        userAddress,
        params.tokenId,
        params.copies
      );
      const provider = biconomy.getEthersProvider();

      console.log("** burning: opening wallet for signing **");

      const transaction = await provider
        .send("eth_sendTransaction", [
          {
            data,
            from: userAddress,
            to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
            signatureType: "EIP712_SIGN",
          },
        ])
        .catch((error: any) => {
          console.error(error);
          // TODO: Add a proper error message. Find what 4001 means
          if (error.code === 4001) {
            reject("Something went wrong");
          }

          reject("Something went wrong");
        });

      console.log("transaction hash ", transaction);

      provider.once(transaction, () => resolve({ transaction: transaction }));
    });
  }

  async function burnTokenPipeline(params: UseBurnNFT) {
    if (userAddress) {
      try {
        dispatch({ type: "burning" });
        console.log("** Begin burning **");

        const response = await burnToken({ ...params });
        dispatch({ type: "burningSuccess", transaction: response.transaction });

        console.log("** burning success **");
      } catch (e) {
        dispatch({ type: "burningError" });
        throw e;
      }
    } else {
      // TODO: better error handling. Maybe show login screen
      Alert.alert(
        "Sorry! We can't find your user address. Please login with a wallet or email/phone"
      );
    }
  }

  console.log("state ", state);

  return { state, startBurning: burnTokenPipeline };
};
