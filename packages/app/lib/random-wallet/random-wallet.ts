export const getWallet = async () => {
  const wallet = (await import("@ethersproject/wallet")).Wallet.createRandom();
  return wallet;
};
