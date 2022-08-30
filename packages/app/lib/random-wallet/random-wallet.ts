export const getWallet = () => {
  const ethers = require("ethers");
  return ethers.Wallet.createRandom();
};
