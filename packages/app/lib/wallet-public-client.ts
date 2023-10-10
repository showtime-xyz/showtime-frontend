import { createPublicClient, http } from "viem";
import { base, baseGoerli } from "viem/chains";

export const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_STAGE === "development" ? baseGoerli : base,
  transport: http(),
});
