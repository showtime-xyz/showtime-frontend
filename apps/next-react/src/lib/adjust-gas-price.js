import { GAS_PRICE_PERCENTAGE } from "@/lib/constants";
import { ethers } from "ethers";

/**
 * Calculate and return the estimated gas price for a transaction
 * adjusted by the GAS_PRICE_PERCENTAGE constant.
 *
 * @param {Function} signer - Interface that supports estimateGas such as signer or provider
 * @returns {Promise<String>} - The value of estimatedGasPrice + percentage adjustment
 */
export const adjustGasPrice = async (signer) => {
  const multiplyBy = ethers.BigNumber.from(GAS_PRICE_PERCENTAGE);
  const divideBy = ethers.BigNumber.from("100");
  const estimatedGasPrice = await signer.estimateGas();
  const adjustment = estimatedGasPrice.mul(multiplyBy).div(divideBy);
  const gasPrice = estimatedGasPrice.add(adjustment).toString();

  return gasPrice;
};
