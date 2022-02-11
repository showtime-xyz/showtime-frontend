import { useCallback, useReducer } from "react";

import type { WalletConnectionStatus } from "../../types";

type WalletLoginState = {
  status: WalletConnectionStatus;
  name?: string;
  address?: string;
  signature?: string;
  nonce?: string;
  error?: any;
};

type WalletLoginStateActions = {
  type:
    | "CONNECT_TO_WALLET_REQUEST"
    | "CONNECT_TO_WALLET_SUCCESS"
    | "FETCH_NONCE_REQUEST"
    | "FETCH_NONCE_SUCCESS"
    | "SIGN_PERSONAL_MESSAGE_REQUEST"
    | "SIGN_PERSONAL_MESSAGE_SUCCESS"
    | "LOG_IN_REQUEST"
    | "LOG_IN_SUCCESS"
    | "EXPIRE_NONCE_REQUEST"
    | "EXPIRE_NONCE_SUCCESS"
    | "SUCCESS"
    | "ERROR"
    | "RESET";
  payload: Omit<WalletLoginState, "status">;
};

const INITIAL_WALLET_LOGIN_STATE: WalletLoginState = {
  status: "IDLE",
};

function walletLoginStateReducer(
  state: WalletLoginState,
  action: WalletLoginStateActions
): WalletLoginState {
  switch (action.type) {
    case "CONNECT_TO_WALLET_REQUEST":
      return {
        ...state,
        status: "CONNECTING_TO_WALLET",
      };
    case "CONNECT_TO_WALLET_SUCCESS":
      return {
        ...state,
        name: action.payload.name,
        address: action.payload.address,
        status: "CONNECTED_TO_WALLET",
      };

    case "FETCH_NONCE_REQUEST":
      return {
        ...state,
        status: "FETCHING_NONCE",
      };
    case "FETCH_NONCE_SUCCESS":
      return {
        ...state,
        nonce: action.payload.nonce,
        status: "FETCHED_NONCE",
      };

    case "SIGN_PERSONAL_MESSAGE_REQUEST":
      return {
        ...state,
        status: "SIGNING_PERSONAL_MESSAGE",
      };
    case "SIGN_PERSONAL_MESSAGE_SUCCESS":
      return {
        ...state,
        signature: action.payload.signature,
        status: "SIGNED_PERSONAL_MESSAGE",
      };

    case "LOG_IN_REQUEST":
      return {
        ...state,
        status: "LOGGING_IN",
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state,
        status: "LOGGED_IN",
      };

    case "EXPIRE_NONCE_REQUEST":
      return {
        ...state,
        status: "EXPIRING_NONCE",
      };
    case "EXPIRE_NONCE_SUCCESS":
      return {
        ...state,
        nonce: undefined,
        status: "EXPIRED_NONCE",
      };

    case "SUCCESS":
      return {
        ...state,
        status: "CONNECTED",
      };

    case "ERROR":
      return {
        ...INITIAL_WALLET_LOGIN_STATE,
        status: "ERRORED",
        error: action.payload.error,
      };

    case "RESET":
      return INITIAL_WALLET_LOGIN_STATE;

    default:
      return state;
  }
}

export function useWalletLoginState() {
  const [state, dispatch] = useReducer(
    walletLoginStateReducer,
    INITIAL_WALLET_LOGIN_STATE
  );

  const handleDispatch = useCallback(
    (
      type: WalletLoginStateActions["type"],
      payload?: WalletLoginStateActions["payload"]
    ) => {
      dispatch({
        type,
        payload: payload || {},
      });
    },
    []
  );

  return { ...state, dispatch: handleDispatch };
}
