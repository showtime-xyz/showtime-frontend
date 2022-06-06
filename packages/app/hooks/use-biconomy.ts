import { useWallet } from "app/hooks/auth/use-wallet";
import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy } from "app/utilities";

export const useBiconomy = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const { getAddress } = useWallet();

  const getBiconomySigner = async () => {
    const address = await getAddress();
    const biconomy = await (await getBiconomy(connector, web3)).biconomy;

    return {
      signer: biconomy.getSignerByAddress(address),
      provider: biconomy.getEthersProvider(),
      signerAddress: address,
      web3,
    };
  };

  return { getBiconomySigner };
};
