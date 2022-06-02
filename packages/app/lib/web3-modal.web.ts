import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Fortmatic from "fortmatic";

import { Magic } from "app/lib/magic";

let web3ModalCached: any;

const getWeb3Modal = async ({ withMagic = false } = {}) => {
  if (web3ModalCached) {
    return web3ModalCached;
  }

  const WalletConnectProvider = (await import("@walletconnect/web3-provider"))
    .default;
  const Web3Modal = (await import("web3modal")).default;

  web3ModalCached = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        display: {
          description: "Use Rainbow & other popular wallets",
        },
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        },
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          key: process.env.NEXT_PUBLIC_FORTMATIC_PUB_KEY,
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: "Showtime",
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
          rpc: `https://polygon-${
            process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai" : "mainnet"
          }.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
          chainId: 137,
          darkMode: false,
        },
      },
      ...(withMagic
        ? {
            "custom-magiclink": {
              display: {
                logo: "/logo.png",
                name: "Showtime Account",
                description:
                  "If you log in to Showtime with an email address, use this",
              },
              options: {
                apiKey: process.env.NEXT_PUBLIC_MAGIC_PUB_KEY,
              },
              package: Magic,
              connector: async (Magic, opts) => {
                const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";

                // Default to polygon chain
                const customNodeOptions = {
                  rpcUrl: "https://rpc-mainnet.maticvigil.com/",
                  chainId: 137,
                };

                if (isMumbai) {
                  console.log("Magic network is connecting to Mumbai testnet");
                  customNodeOptions.rpcUrl =
                    "https://polygon-mumbai.g.alchemy.com/v2/kh3WGQQaRugQsUXXLN8LkOBdIQzh86yL";
                  customNodeOptions.chainId = 80001;
                }

                const magic = new Magic(opts.apiKey, {
                  network: customNodeOptions,
                });

                if (!(await magic?.user?.isLoggedIn()))
                  await magic.auth.loginWithMagicLink({
                    email: prompt(
                      "What email do you use to log into Showtime?"
                    ),
                  });

                return magic.rpcProvider;
              },
            },
          }
        : {}),
    },
    // theme,
  });

  return web3ModalCached;
};

export default getWeb3Modal;
