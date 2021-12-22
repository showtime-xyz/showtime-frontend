import handler, { middleware } from "@/lib/api-handler";
import ierc20PermitAbi from "@/data/IERC20Permit.json";
import ierc20MetaTxAbi from "@/data/IERC20MetaTx.json";
import { ethers } from "ethers";
import { LIST_CURRENCIES, SOL_MAX_INT } from "@/lib/constants";

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
      const tx =
        body.tokenAddr === LIST_CURRENCIES.WETH
          ? await executeMetaTx(wallet, body)
          : await submitErc20Permit(wallet, body);

      return res.status(200).send(tx.hash);
    } catch (errorMsg) {
      res
        .status(errorMsg === "Something went wrong." ? 500 : 400)
        .send(errorMsg);
    }
  });

const submitErc20Permit = (wallet, permit) => {
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
      s
    );
  } catch (error) {
    const revertMessage = JSON.parse(error?.error?.error?.body || "{}")?.error
      ?.message;

    if (!revertMessage) {
      throw "Something went wrong.";
    }

    throw revertMessage.split("execution reverted: ")[1];
  }
};

const executeMetaTx = (wallet, metatx) => {
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
      v
    );
  } catch (error) {
    const revertMessage = JSON.parse(error?.error?.error?.body || "{}")?.error
      ?.message;

    if (!revertMessage) {
      throw "Something went wrong.";
    }

    throw revertMessage.split("execution reverted: ")[1];
  }
};
