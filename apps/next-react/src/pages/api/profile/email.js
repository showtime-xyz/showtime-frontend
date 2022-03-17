import handler, { middleware } from "@/lib/api-handler";
import backend from "@/lib/backend";
import { Magic } from "@magic-sdk/admin";

const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";

// Default to polygon chain
const customNodeOptions = {
  rpcUrl: "https://rpc-mainnet.maticvigil.com/",
  chainId: 137,
};

if (isMumbai) {
  console.log("Magic network is connecting to Mumbai testnet");
  customNodeOptions.rpcUrl =
    "https://polygon-mumbai.g.alchemy.com/v2/kh3WGQQaRugQsUXXLN8LkOBdIQzh86yL";
  customNodeOptions.chainId = 80001;
}

export default handler()
  .use(middleware.auth)
  .post(async ({ user, headers: { authorization } }, res) => {
    // exchange the did from Magic for some user data
    const new_user = await new Magic(process.env.MAGIC_SECRET_KEY, {
      network: customNodeOptions,
    }).users.getMetadataByToken(authorization.split("Bearer").pop().trim());

    await backend.post(
      "/v1/addwallet",
      {
        address: new_user.publicAddress,
        email: new_user.email,
      },
      {
        headers: {
          "X-Authenticated-User": user.publicAddress,
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        },
      }
    );

    res.status(200).end();
  });
