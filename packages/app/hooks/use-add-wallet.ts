import { useReducer } from "react";

import { useSWRConfig } from "swr";

import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { axios } from "app/lib/axios";
import { magic } from "app/lib/magic";
import { useWalletConnect } from "app/lib/walletconnect";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { useToast } from "design-system/toast";

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
  const toast = useToast();
  const walletConnector = useWalletConnect();
  const { user } = useUser();
  const { setWeb3 } = useWeb3();
  const { mutate } = useSWRConfig();

  const [state, dispatch] = useReducer(
    addWalletReducer,
    initialState,
    (): AddWallet => {
      const connectionStatus = walletConnector.connected;
      // A disconnected status can imply a magic user. It's not an automatic error event.
      return {
        ...initialState,
        status: connectionStatus ? "connected" : "disconnected",
      };
    }
  );

  const wallets = user?.data.profile.wallet_addresses_excluding_email_v2;

  const addWalletToBackend = async (address: string) => {
    await axios({
      url: "/v1/addwallet",
      method: "POST",
      data: { address },
    });
  };

  const disconnectMagic = async () => {
    const isMagicActive = await magic.user.isLoggedIn();

    if (isMagicActive) {
      await magic.user.logout();
      setWeb3(undefined);
    }
  };

  const checkNewAddress = (address: string) => {
    return !wallets?.find(
      (addedWallet) =>
        addedWallet.address.toLowerCase() === address.toLowerCase()
    );
  };

  const addWallet = async () => {
    try {
      let toastMessage = "";
      const connectionStatus = state.status;
      const shouldKillSession =
        walletConnector.connected &&
        (connectionStatus === "connected" || connectionStatus === "connecting");

      if (shouldKillSession) {
        await walletConnector.killSession();
        dispatch({ type: "status", status: "disconnected" });
      }

      dispatch({ type: "status", status: "connecting" });

      const connectionResponse = await walletConnector.connect();
      // walletConnector.connected has a race condition and may return false even if connected
      const validResponse = Boolean(connectionResponse?.accounts);

      if (validResponse) {
        const connectionIsFalsy = !walletConnector.connected;

        if (connectionIsFalsy) {
          // Does not retrigger wallet connect modal, only updates current connection
          await walletConnector.connect();
        }

        const [newAddress] = connectionResponse.accounts;

        const isNewAddress = checkNewAddress(newAddress);

        if (isNewAddress) {
          await addWalletToBackend(newAddress);
          await disconnectMagic();

          toastMessage = "Address added and will soon appear on your profile";
        } else {
          toastMessage = "Address already connected to your profile";
        }

        dispatch({ type: "status", status: "connected" });
        mutate(MY_INFO_ENDPOINT);

        toast?.show({
          message: toastMessage,
          hideAfter: 4000,
        });
      }
    } catch (error) {
      const isDisconnected = !walletConnector.connected;

      if (isDisconnected) {
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
