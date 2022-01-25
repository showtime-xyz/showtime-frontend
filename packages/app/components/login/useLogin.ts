import { useCallback, useContext, useEffect, useState } from "react";
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

export const useLogin = (onLogin?: () => void) => {
  //#region state
  const [signaturePending, setSignaturePending] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);
  //#endregion

  //#region hooks
  const { mutate } = useSWRConfig();
  const connector = useWalletConnect();
  const context = useContext(AppContext);
  //#endregion

  //#region methods
  const handleOnLoginSuccess = useCallback(
    (source: string) => {
      mutate(null);
      mixpanel.track(`Login success - ${source}`);

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
        const web3 = new Web3Provider(await web3Modal.connect());

        address = await web3.getSigner().getAddress();
        const response = await axios({
          url: `/v1/getnonce?address=${address}`,
          method: "GET",
        });

        setSignaturePending(true);
        signature = await personalSignMessage(
          web3,
          process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + response?.data
        );
      } else {
        if (!connector.connected) {
          return await connector.connect();
        }

        address = connector?.session?.accounts[0];
        const response = await axios({
          url: `/v1/getnonce?address=${address}`,
          method: "GET",
        });

        setSignaturePending(true);
        // @ts-ignore
        setWalletName(connector?._peerMeta?.name);

        const msgParams = [
          convertUtf8ToHex(
            `Sign into Showtime with this wallet. ${response?.data}`
          ),
          address.toLowerCase(),
        ];

        signature = await connector.signPersonalMessage(msgParams);
        console.log("personal signature ", signature);
      }

      const response = await axios({
        url: "/v1/login_wallet",
        method: "POST",
        data: { signature, address },
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

        // Expire the nonce after successful login
        axios({ url: `/v1/rotatenonce?address=${address}`, method: "POST" });
      } else {
        console.error("Login failed ", response);
        throw "Login failed";
      }

      handleOnLoginSuccess("wallet signature");
    } catch (error) {
      magic.user.logout();

      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      captureException(error, {
        tags: {
          login_signature_flow: "modalLogin.js",
        },
      });
    } finally {
      setSignaturePending(false);
    }
  }, [context, connector?.connected, setWalletName, handleOnLoginSuccess]);
  const handleLogin = useCallback(async (payload: object) => {
    try {
      const Web3Provider = (await import("@ethersproject/providers"))
        .Web3Provider;
      // @ts-ignore
      const web3 = new Web3Provider(magic.rpcProvider);
      context.setWeb3(web3);

      const response = await axios({
        url: "/v1/login_magic",
        method: "POST",
        data: payload,
      });

      const accessToken = response?.access;
      const refreshToken = response?.refresh;
      const validResponse = accessToken && refreshToken;

      console.log("response", response);

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
        throw "Login failed";
      }
    } catch (error) {
      magic.user.logout();
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
    setLoading(false);

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
        setLoading(true);
        mixpanel.track("Login - email button click");

        const did = await magic.auth.loginWithMagicLink({ email });

        await handleLogin({
          did,
          email,
        });

        handleOnLoginSuccess("email");
      } catch (error) {
        handleLoginError(error);
      }
    },
    [handleLogin, handleLoginError, handleOnLoginSuccess]
  );
  const handleSubmitPhoneNumber = useCallback(
    async (phoneNumber: string) => {
      try {
        setLoading(true);
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
        handleLoginError(error);
      }
    },
    [handleLogin, handleLoginError]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    connector.on("connect", () => {
      handleSubmitWallet();
    });

    if (connector.connected) {
      handleSubmitWallet();
    }
  }, [connector?.connected]);
  //#endregion
  return {
    loading,
    signaturePending,
    walletName,

    handleSubmitWallet,

    handleLogin,
    handleLoginError,

    handleSubmitEmail,
    handleSubmitPhoneNumber,
  };
};
