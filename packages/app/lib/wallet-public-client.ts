import { createPublicClient, http } from "viem";

import { baseChain } from "app/hooks/creator-token/utils";

export const publicClient = createPublicClient({
  chain: baseChain,
  transport: http(),
});
