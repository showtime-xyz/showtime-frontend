import ierc20MetaTxAbi from "@/data/IERC20MetaTx.json";
import ierc20PermitAbi from "@/data/IERC20Permit.json";
import handler, { middleware } from "@/lib/api-handler";
import axios from "@/lib/axios";
import { LIST_CURRENCIES, SOL_MAX_INT } from "@/lib/constants";
import { toWei } from "@/lib/utilities";
import { captureException } from "@sentry/nextjs";
import { ethers } from "ethers";

export default handler()
  .use(middleware.auth)
  .post(async ({ body }, res) => {
    const wallet = new ethers.Wallet(
      process.env.WALLET_KEY,
      new ethers.providers.JsonRpcProvider(
        `https://polygon-${
          process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai" : "mainnet"
        }.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
      )
    );

    try {
      const gasStationResponse = await axios.get(
        `https://${process.env.GAS_STATION}`
      );
      const feeSuggestion = gasStationResponse.data;
      const maxFee =
        feeSuggestion.fast.maxFee + feeSuggestion.fast.maxPriorityFee;
      const maxPriorityFee = feeSuggestion.fast.maxPriorityFee;

      const txOptions = {
        maxFeePerGas: toWei(maxFee),
        maxPriorityFeePerGas: toWei(maxPriorityFee),
      };

      const tx = [
        LIST_CURRENCIES.WETH,
        LIST_CURRENCIES.DAI,
        LIST_CURRENCIES.USDC,
      ].includes(body.tokenAddr)
        ? await executeMetaTx(wallet, body, txOptions)
        : await submitErc20Permit(wallet, body, txOptions);

      return res.status(200).send(tx.hash);
    } catch (errorMsg) {
      console.log("Permit:", errorMsg);
      captureException(error, {
        tags: {
          permits: "permit.js",
        },
      });
      return res
        .status(errorMsg === "Something went wrong." ? 500 : 400)
        .send(errorMsg);
    }
  });

const submitErc20Permit = async (wallet, permit, options) => {
  const { v, r, s } = ethers.utils.splitSignature(permit.signature);
  const tokenContract = new ethers.Contract(
    permit.tokenAddr,
    ierc20PermitAbi,
    wallet
  );

  try {
    return tokenContract.permit(
      permit.owner,
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
      SOL_MAX_INT,
      permit.deadline,
      v,
      r,
      s,
      options
    );
  } catch (error) {
    console.log("submitErc20Permit Permit:", error);
    const revertMessage = JSON.parse(error?.error?.error?.body || "{}")?.error
      ?.message;
    if (!revertMessage) {
      throw "Something went wrong.";
    }
    throw revertMessage.split("execution reverted: ")[1];
  }
};

const executeMetaTx = async (wallet, metatx, options) => {
  const { r, s, v } = ethers.utils.splitSignature(metatx.signature);
  const tokenContract = new ethers.Contract(
    metatx.tokenAddr,
    ierc20MetaTxAbi,
    wallet
  );

  try {
    return tokenContract.executeMetaTransaction(
      metatx.owner,
      metatx.fnSig,
      r,
      s,
      v,
      options
    );
  } catch (error) {
    console.log("ExecuteMetaTx Permit:", error);
    const revertMessage = JSON.parse(error?.error?.error?.body || "{}")?.error
      ?.message;

    if (!revertMessage) {
      throw "Something went wrong.";
    }

    throw revertMessage.split("execution reverted: ")[1];
  }
};
