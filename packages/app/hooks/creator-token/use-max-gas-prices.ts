import { publicClient } from "app/lib/wallet-public-client";

export const useMaxGasPrices = () => {
  const getMaxFeePerGasAndPriorityPrice = async () => {
    // In Wei. Gwei = 0.001. Recommended by base team
    const maxPriorityFeePerGas = 1000000n;
    const latestBlockBaseFeePerGas = (await publicClient.getBlock())
      .baseFeePerGas;
    if (latestBlockBaseFeePerGas) {
      const maxFeePerGas = latestBlockBaseFeePerGas * 2n + maxPriorityFeePerGas;
      return {
        maxFeePerGas,
        maxPriorityFeePerGas,
      };
    }
  };

  return {
    getMaxFeePerGasAndPriorityPrice,
  };
};
