import { useCallback } from "react";

import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

import { useWeb3 } from "app/hooks/use-web3";
import {
  BYPASS_EMAIL,
  BYPASS_EMAIL_WITH_INSECURE_KEYS,
} from "app/lib/constants";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";

import { useAuth } from "./use-auth";

export const LOGIN_MAGIC_ENDPOINT = "login_magic";

export function useMagicLogin() {
  //#region hooks
  const { setAuthenticationStatus, login, logout } = useAuth();
  const { setWeb3 } = useWeb3();
  const { magic, Magic } = useMagic();
  //#endregion

  //#region methods
  const loginWithPhoneNumber = useCallback(
    async function loginWithPhoneNumber(phoneNumber: string) {
      setAuthenticationStatus("AUTHENTICATING");
      try {
        const did = await magic.auth.loginWithSMS({
          phoneNumber,
        });

        await login(LOGIN_MAGIC_ENDPOINT, {
          did,
          phone_number: phoneNumber,
        });

        const client = createWalletClient({
          chain: mainnet,
          transport: custom(magic.rpcProvider),
        });

        setWeb3({ ...client, isMagic: true });
      } catch (error) {
        logout();
        throw error;
      }
    },
    [magic, login, logout, setAuthenticationStatus, setWeb3]
  );

  const loginWithEmail = useCallback(
    async function loginWithEmail(email: string) {
      setAuthenticationStatus("AUTHENTICATING");
      let magicInstance = magic;

      if (email === BYPASS_EMAIL) {
        const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";
        // Default to polygon chain
        const customNodeOptions = {
          rpcUrl: "https://rpc-mainnet.maticvigil.com/",
          chainId: 137,
        };

        if (isMumbai) {
          Logger.log("Magic network is connecting to Mumbai testnet");
          customNodeOptions.rpcUrl =
            "https://polygon-mumbai.g.alchemy.com/v2/kh3WGQQaRugQsUXXLN8LkOBdIQzh86yL";
          customNodeOptions.chainId = 80001;
        }

        magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY, {
          network: customNodeOptions,
          testMode: true,
        });
      }

      const overrideEmail = magicInstance.testMode
        ? BYPASS_EMAIL_WITH_INSECURE_KEYS
        : email;

      const did = await magicInstance.auth.loginWithMagicLink({
        email: overrideEmail,
      });

      try {
        await login(LOGIN_MAGIC_ENDPOINT, {
          did,
          email: overrideEmail,
        });

        const client = createWalletClient({
          chain: mainnet,
          transport: custom(magic.rpcProvider),
        });

        setWeb3({ ...client, isMagic: true });
      } catch (error) {
        logout();
        throw error;
      }
    },
    [magic, Magic, login, logout, setAuthenticationStatus, setWeb3]
  );

  //#endregion
  return {
    loginWithPhoneNumber,
    loginWithEmail,
  };
}
