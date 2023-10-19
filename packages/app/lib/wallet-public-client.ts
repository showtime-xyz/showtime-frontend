import { createPublicClient, http } from "viem";

import { baseChain } from "app/hooks/creator-token/use-switch-chain";

export const publicClient = createPublicClient({
  chain: baseChain,
  transport: http(),
});
