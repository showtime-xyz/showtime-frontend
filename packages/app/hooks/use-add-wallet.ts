import { useReducer } from "react";

import { useSWRConfig } from "swr";

import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { useWalletConnect } from "app/lib/walletconnect";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

export type AddWallet = {
  status: "idle" | "connecting" | "connected" | "disconnected" | "error";
};

type AddWalletAction = {
  type: "status";
  status: AddWallet["status"];
};

const initialState: AddWallet = {
  status: "idle",
};

const addWalletReducer = (
  state: AddWallet,
  action: AddWalletAction
): AddWallet => {
  switch (action.type) {
    case "status":
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
};

export const useAddWallet = () => {
  const walletConnector = useWalletConnect();
  const { mutate } = useSWRConfig();
  const { user } = useUser();
  const [state, dispatch] = useReducer(
    addWalletReducer,
    initialState,
    (): AddWallet => {
      const connectionStatus = walletConnector.connected;
      // TODO: If disconnected, It can be a magic user. It's not an automatic error (logout) event.
      return { status: connectionStatus ? "connected" : "disconnected" };
    }
  );

  const wallets = user?.data.profile.wallet_addresses_excluding_email_v2;

  const addWallet = async () => {
    try {
      const connectionStatus = state.status;
      console.log("in add wallet is it connected?", walletConnector.connected);
      console.log("in add wallet connectionStatus", connectionStatus);

      // Disconnect, Attempt Connection, Validate Success Or failure
      if (
        walletConnector.connected &&
        (connectionStatus === "connected" || connectionStatus === "connecting")
      ) {
        console.log(
          "Connection value before killsession",
          walletConnector.connected
        );
        await walletConnector.killSession();
        console.log(
          "Connection value after killsession",
          walletConnector.connected
        );
        dispatch({ type: "status", status: "disconnected" });
      }

      dispatch({ type: "status", status: "connecting" });
      // use res to test if connected
      const connectionResponse = await walletConnector.connect();
      const validResponse = Boolean(connectionResponse?.accounts);
      console.log("after connection connect response", connectionResponse);
      console.log(
        "after connection connect connected value",
        walletConnector.connected
      );
      // walletConnector.connected is still false right after, race condition
      if (validResponse) {
        console.log(
          "after connected validResponse response is truthy value is",
          walletConnector.connected
        );
        if (!walletConnector.connected) {
          // does not trigger modal, just connects
          await walletConnector.connect();
        }
        dispatch({ type: "status", status: "connected" });
        const [newAddress] = connectionResponse.accounts;

        // if its not a wallet you already have!
        const isNewAddress = !wallets?.find(
          (addedWallet) =>
            addedWallet.address.toLowerCase() === newAddress.toLowerCase()
        );

        if (isNewAddress) {
          await axios({
            url: "/v1/addwallet",
            method: "POST",
            data: { address: newAddress },
          });

          mutate(MY_INFO_ENDPOINT);
        } else {
          console.log("already known address, not invoking addWallet");
        }

        // now we add to the backend
      } else {
        console.log(
          "after connected value was not truthy and is",
          walletConnector.connected
        );
      }
    } catch (error) {
      console.log("In error connected value", walletConnector.connected);
      console.log("Error: In use add wallet hook", error);
      if (!walletConnector.connected) {
        // To not leave the user authenticated but in an "inactive state" this triggers force logout
        dispatch({ type: "status", status: "error" });
      }
    }
  };

  return {
    state,
    dispatch,
    addWallet,
  };
};

export default {
  useAddWallet,
};
