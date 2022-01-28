import { useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { Platform } from "react-native";
import { captureException } from "@sentry/nextjs";
import { useSWRConfig } from "swr";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { magic } from "app/lib/magic";
import { axios } from "app/lib/axios";
// @ts-ignore
import getWeb3Modal from "app/lib/web3-modal";
import { AppContext } from "app/context/app-context";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { personalSignMessage } from "app/lib/utilities";
import { setRefreshToken } from "app/lib/refresh-token";
import { accessTokenManager } from "app/lib/access-token-manager";
import { setLogin } from "app/lib/login";
import { mixpanel } from "app/lib/mixpanel";
import { useFetchOnAppForeground } from "../../hooks/use-fetch-on-app-foreground";

type IStatus =
  | "idle"
  | "requestedWalletConnect"
  | "waitingForSignature"
  | "requestingNonce"
  | "loading"
  | "success"
  | "error";

type ILoginState = {
  status: IStatus;
  error: null;
  walletName?: string;
};

const initialState: ILoginState = {
  status: "idle" as IStatus,
  error: null,
  walletName: undefined,
};

const loginReducer = (
  state: ILoginState,
  action: { type: IStatus; payload?: any }
): ILoginState => {
  switch (action.type) {
    case "requestedWalletConnect":
      return { ...state, status: "requestedWalletConnect" };
    case "requestingNonce":
      return { ...state, status: "requestingNonce" };
    case "waitingForSignature":
      return {
        ...state,
        status: "waitingForSignature",
        walletName: action.payload,
      };
    case "loading":
      return { ...state, status: "loading" };
    case "success":
      return { ...state, status: "success" };
    case "error":
      return { ...state, status: "error" };
    default:
      return state;
  }
};

export const useLogin = (onLogin?: () => void) => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const statusRef = useRef<IStatus>();

  //#region hooks
  const { mutate } = useSWRConfig();
  const connector = useWalletConnect();
  const context = useContext(AppContext);
  const fetchOnForeground = useFetchOnAppForeground();
  //#endregion

  //#region effects
  useEffect(() => {
    statusRef.current = state.status;
  }, [state.status]);
  useEffect(() => {
    // on unmount
    return () => {
      // if user leaves the login page with unsuccessful attempts, we logout, so it clears wallet connect sessions
      if (statusRef.current !== "success") {
        console.log("logging out from login modal");
        context.logOut();
      }
    };
  }, []);
  useEffect(() => {
    console.log("connected status ", connector.connected);
    // TODO: The below call is responsible for signature verification post wallet connection
    // We should move it in a separate function to avoid confusion
    if (connector.connected && state.status === "requestedWalletConnect") {
      handleSubmitWallet();
    }
  }, [connector?.connected, state.status]);
  //#endregion

  //#region methods
  const handleOnLoginSuccess = useCallback(
    (source: string) => {
      mutate(null);
      mixpanel.track(`Login success - ${source}`);
      dispatch({
        type: "success",
      });
      if (onLogin) {
        onLogin();
      }
    },
    [mutate, onLogin]
  );
  const handleSubmitWallet = useCallback(async () => {
    try {
      let address: string;
      let signature: string;

      if (Platform.OS === "web") {
        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        mixpanel.track("Login - wallet button click");

        const web3Modal = await getWeb3Modal();

        dispatch({
          type: "requestedWalletConnect",
        });

        const web3 = new Web3Provider(await web3Modal.connect());

        address = await web3.getSigner().getAddress();
        dispatch({
          type: "requestingNonce",
        });
        const response = await axios({
          url: `/v1/getnonce?address=${address}`,
          method: "GET",
        });

        dispatch({
          type: "waitingForSignature",
          payload: web3Modal.selectedWallet.name,
        });

        signature = await personalSignMessage(
          web3,
          process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + response?.data
        );
      } else {
        if (!connector.connected) {
          dispatch({ type: "requestedWalletConnect" });
          return await connector.connect();
        }

        address = connector?.session?.accounts[0];

        dispatch({
          type: "requestingNonce",
        });

        const response = await fetchOnForeground({
          url: `/v1/getnonce?address=${address}`,
          method: "GET",
        });

        dispatch({
          type: "waitingForSignature",
          payload: connector?.peerMeta?.name,
        });

        const msgParams = [
          convertUtf8ToHex(
            process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + response?.data
          ),
          address.toLowerCase(),
        ];

        signature = await connector.signPersonalMessage(msgParams);
        console.log("personal signature ", signature);
      }

      dispatch({
        type: "loading",
      });

      const response = await fetchOnForeground({
        url: "/v1/login_wallet",
        method: "POST",
        data: { signature, address },
      });

      const accessToken = response?.access;
      const refreshToken = response?.refresh;
      const validResponse = accessToken && refreshToken;
      console.log("login wallet response ", response);

      if (validResponse) {
        // TODO:
        // const sealedRefreshToken = await Iron.seal(
        // 	{ refreshToken },
        // 	process.env.ENCRYPTION_SECRET_V2,
        // 	Iron.defaults
        // )
        // setRefreshToken(sealedRefreshToken)
        setRefreshToken(refreshToken);
        accessTokenManager.setAccessToken(accessToken);
        setLogin(Date.now().toString());

        // Expire the nonce after successful login
        axios({ url: `/v1/rotatenonce?address=${address}`, method: "POST" });
      } else {
        console.error("Login failed ", response);
        throw "Login failed";
      }

      handleOnLoginSuccess("wallet signature");
    } catch (error) {
      // If there's an error, we don't know if it was from wallet connect or our API, so we logout.
      // This makes sure we get to see the walletconnect select wallet modal again.
      context.logOut();

      dispatch({ type: "error" });

      console.error(error);

      captureException(error, {
        tags: {
          login_signature_flow: "modalLogin.js",
        },
      });
    }
  }, [context, connector?.connected, handleOnLoginSuccess]);
  const handleLogin = useCallback(async (payload: object) => {
    try {
      const Web3Provider = (await import("@ethersproject/providers"))
        .Web3Provider;
      // @ts-ignore
      const web3 = new Web3Provider(magic.rpcProvider);
      context.setWeb3(web3);

      const response = await fetchOnForeground({
        url: "/v1/login_magic",
        method: "POST",
        data: payload,
      });

      const accessToken = response?.access;
      const refreshToken = response?.refresh;
      const validResponse = accessToken && refreshToken;

      if (validResponse) {
        // TODO:
        // const sealedRefreshToken = await Iron.seal(
        // 	{ refreshToken },
        // 	process.env.ENCRYPTION_SECRET_V2,
        // 	Iron.defaults
        // )
        // setRefreshToken(sealedRefreshToken)
        setRefreshToken(refreshToken);
        accessTokenManager.setAccessToken(accessToken);
        setLogin(Date.now().toString());
      } else {
        console.error("login with magic failed ", response);
        throw "Login failed";
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      captureException(error, {
        tags: {
          login_signature_flow: "modalLogin.js",
          login_magic_link: "modalLogin.js",
        },
      });
    }
  }, []);
  const handleLoginError = useCallback((error) => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    captureException(error, {
      tags: {
        login_signature_flow: "modalLogin.js",
        login_magic_link: "modalLogin.js",
      },
    });
  }, []);
  const handleSubmitEmail = useCallback(
    async (email: string) => {
      try {
        dispatch({ type: "loading" });
        mixpanel.track("Login - email button click");

        const did = await magic.auth.loginWithMagicLink({ email });

        await handleLogin({
          did,
          email,
        });

        handleOnLoginSuccess("email");
      } catch (error) {
        dispatch({ type: "error" });
        context.logOut();
        handleLoginError(error);
      }
    },
    [handleLogin, handleLoginError, handleOnLoginSuccess]
  );
  const handleSubmitPhoneNumber = useCallback(
    async (phoneNumber: string) => {
      try {
        dispatch({ type: "loading" });
        mixpanel.track("Login - phone number button click");

        const did = await magic.auth.loginWithSMS({
          phoneNumber,
        });

        await handleLogin({
          did,
          phone_number: phoneNumber,
        });

        handleOnLoginSuccess("phone number");
      } catch (error) {
        context.logOut();
        handleLoginError(error);
        dispatch({ type: "error" });
      }
    },
    [handleLogin, handleLoginError]
  );
  //#endregion

  console.log("status ", state.status);

  return {
    state,

    handleSubmitWallet,

    handleLogin,
    handleLoginError,

    handleSubmitEmail,
    handleSubmitPhoneNumber,
  };
};
