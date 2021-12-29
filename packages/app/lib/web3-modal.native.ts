const getWeb3Modal = async () => {
  const WalletConnectProvider = (await import("@walletconnect/web3-provider"))
    .default;

  const provider = new WalletConnectProvider({
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
  });

  return provider;
};

export default getWeb3Modal;
