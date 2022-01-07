import { useContext, useState, useCallback, useEffect } from "react";
import { Platform, Linking } from "react-native";
import { captureException } from "@sentry/nextjs";
import { useForm, Controller } from "react-hook-form";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { useSWRConfig } from "swr";
// import Iron from '@hapi/iron'

import { Magic, Relayer } from "app/lib/magic";
import { AppContext } from "app/context/app-context";
import { axios } from "app/lib/axios";
// @ts-ignore
import getWeb3Modal from "app/lib/web3-modal";
import { personalSignMessage } from "app/lib/utilities";
import { accessTokenManager } from "app/lib/access-token-manager";
import { setLogin } from "app/lib/login";
import { mixpanel } from "app/lib/mixpanel";

import {
  View,
  ScrollView,
  Text,
  TextInput,
  Button,
  ButtonLabel,
  Pressable,
} from "design-system";
import { tw } from "design-system/tailwind";
import { useRouter } from "app/navigation/use-router";
import { Ethereum } from "design-system/icon";
import { setRefreshToken } from "app/lib/refresh-token";

type EmailForm = {
  email: string;
};

// TODO: loading state
export function Login() {
  const router = useRouter();
  const context = useContext(AppContext);
  const connector = useWalletConnect();
  const [signaturePending, setSignaturePending] = useState(false);
  const [walletName, setWalletName] = useState("");
  const { mutate } = useSWRConfig();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    connector.on("connect", () => {
      handleSubmitWallet();
    });

    if (connector.connected) {
      handleSubmitWallet();
    }
  }, [connector?.connected]);

  const handleSubmitEmail = useCallback(
    async ({ email }: EmailForm) => {
      try {
        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;

        mixpanel.track("Login - email button click");

        // Magic Link authenticates through email
        const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY);
        const did = await magic.auth.loginWithMagicLink({ email });
        // @ts-ignore
        const web3 = new Web3Provider(magic.rpcProvider);
        context.setWeb3(web3);

        const response = await axios({
          url: "/v1/login_magic",
          method: "POST",
          data: { email, did },
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
          throw "Login failed";
        }

        mutate(null);
        mixpanel.track("Login success - email");
        router.pop();
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
    },
    [context, router]
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
        setWalletName(connector?._peerMeta?.name);

        const msgParams = [
          convertUtf8ToHex(
            `Sign into Showtime with this wallet. ${response?.data}`
          ),
          address.toLowerCase(),
        ];

        signature = await connector.signPersonalMessage(msgParams);
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
        throw "Login failed";
      }

      mutate(null);
      mixpanel.track("Login success - wallet signature");
      router.pop();
    } catch (error) {
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
  }, [context, connector?.connected, setWalletName]);

  return (
    <>
      {signaturePending ? (
        <View tw="py-40">
          <Text tw="text-center dark:text-gray-400">
            {walletName !== ""
              ? `Pushed a request to ${walletName}... Please check your wallet.`
              : `Pushed a request to your wallet...`}
          </Text>
        </View>
      ) : (
        <View>
          <Text tw="text-gray-900 dark:text-white mb-[10px] text-center font-semibold">
            If this is your first time, it will create a new account on
            Showtime.
          </Text>
          <View tw="flex-row justify-center mb-[32px]">
            <Text
              variant="text-xs"
              tw="text-gray-600 dark:text-gray-400 text-center"
            >
              By signing in you agree to our{" "}
            </Text>
            <Pressable
              onPress={() => {
                Linking.openURL(
                  "https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
                );
              }}
            >
              <Text
                variant="text-xs"
                tw="text-black dark:text-white font-bold text-center"
              >
                Terms &amp; Conditions
              </Text>
            </Pressable>
            <Text
              variant="text-xs"
              tw="text-gray-600 dark:text-gray-400 text-center"
            >
              .
            </Text>
          </View>

          <View tw="mb-[16px]">
            <Button
              onPress={() => handleSubmitWallet()}
              variant="primary"
              size="regular"
            >
              <ButtonLabel>Sign in with Wallet</ButtonLabel>
            </Button>
          </View>

          <View tw="mb-[16px] mx-[-16px] bg-gray-100 dark:bg-gray-900">
            <Text tw="my-[8px] font-bold text-sm text-gray-600 dark:text-gray-400 text-center">
              — or —
            </Text>
          </View>

          <Text tw="mb-[16px] font-medium text-gray-900 dark:text-white text-center">
            Enter your email to receive a sign in link
          </Text>
          <View tw="p-[16px] mb-[16px] rounded-[16px] bg-gray-100 dark:bg-gray-900">
            <Text tw="mb-[8px] font-bold text-sm text-gray-900 dark:text-white">
              Email address
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  tw="w-full text-black dark:text-gray-300 rounded-lg focus:outline-none focus-visible:ring-1"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  placeholder="Enter your email address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              )}
              name="email"
              rules={{ required: true }}
              defaultValue=""
            />
          </View>
          {/* {errors.email && <Text sx={{ fontSize: 12, textAlign: 'center' }}>This is required.</Text>} */}

          <Button
            onPress={handleSubmit(handleSubmitEmail)}
            variant="tertiary"
            size="regular"
          >
            <ButtonLabel tw="text-black dark:text-white">
              Sign in with Email
            </ButtonLabel>
          </Button>
        </View>
      )}
      <Relayer />
    </>
  );
}
