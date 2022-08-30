export const getWallet = () => {
  const ethers = require("ethers");
  ethers.Wallet.createRandom();
};
