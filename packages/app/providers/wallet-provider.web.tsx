import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, WagmiConfig, createConfig } from "wagmi";
import * as allChains from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const baseChain = {
  id: 8453,
  name: "Base",
  network: "mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://developer-access-mainnet.base.org"],
    },
    public: {
      http: ["https://developer-access-mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
  },
};

const lineaChain = {
  id: 59144,
  name: "Linea",
  network: "mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://linea-mainnet.infura.io/v3"],
    },
    public: {
      http: ["https://linea-mainnet.infura.io/v3"],
    },
  },
  blockExplorers: {
    default: { name: "Lineascan", url: "https://lineascan.build/" },
  },
};

const allChainsArray = [
  // @ts-ignore
  ...Object.keys(allChains).map((key) => allChains[key]),
  baseChain,
  lineaChain,
];

console.log("Efeff ", allChainsArray);
const { chains, publicClient, webSocketPublicClient } = configureChains(
  allChainsArray,
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  ]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const { wallets } = getDefaultWallets({
  appName: "Showtime",
  projectId,
  chains,
});
const connectors = connectorsForWallets(wallets);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};
