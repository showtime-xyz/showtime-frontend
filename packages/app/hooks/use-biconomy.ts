import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy } from "app/utilities";

export const useBiconomy = () => {
  const connector = useWalletConnect();
  const { web3 } = useWeb3();
  const { userAddress } = useCurrentUserAddress();

  const getBiconomySigner = async () => {
    const biconomy = await (await getBiconomy(connector, web3)).biconomy;

    return {
      signer: biconomy.getSignerByAddress(userAddress),
      provider: biconomy.getEthersProvider(),
      signerAddress: userAddress,
      web3,
    };
  };

  return { getBiconomySigner };
};
