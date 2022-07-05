import { useReducer } from "react";

import { useSWRConfig } from "swr";

import { useToast } from "@showtime-xyz/universal.toast";

import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { axios } from "app/lib/axios";
import { magic } from "app/lib/magic";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import getWeb3Modal from "../lib/web3modal.web";

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
  const { user } = useUser();

  const { setWeb3 } = useWeb3();
  const { mutate } = useSWRConfig();

  const [state, dispatch] = useReducer(
    addWalletReducer,
    initialState,
    (): AddWallet => {
      //   const connectionStatus = walletConnector.connected;
      // A disconnected status can imply a magic user. It's not an automatic error event.
      return {
        ...initialState,
        status: "disconnected",
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
      const web3Modal = await getWeb3Modal();
      web3Modal.clearCachedProvider();

      dispatch({ type: "status", status: "connecting" });
      const provider = await web3Modal?.connect();

      const address =
        provider?.accounts?.[0] ||
        provider?._addresses?.[0] ||
        provider?.selectedAddress;

      if (address) {
        const isNewAddress = checkNewAddress(address);

        if (isNewAddress) {
          await addWalletToBackend(address);
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
      // todo: handle error
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
