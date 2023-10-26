import { createPublicClient, http } from "viem";

import { baseChain } from "app/hooks/creator-token/utils";
import { isDEV } from "app/utilities";

export const alchemyProviderApiKey = "L9a8pI4EBTUufw44iyl023c1xrRICRyl";

export const alchemyBaseProvider = isDEV
  ? undefined
  : "https://base-mainnet.g.alchemy.com/v2/" + alchemyProviderApiKey;

export const publicClient = createPublicClient({
  chain: baseChain,
  transport: http(alchemyBaseProvider),
});
