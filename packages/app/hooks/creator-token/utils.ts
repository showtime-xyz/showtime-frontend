import { baseGoerli, base } from "viem/chains";

import { isDEV } from "app/utilities";

export const usdcAddress = isDEV
  ? "0xF175520C52418dfE19C8098071a252da48Cd1C19"
  : "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const baseChain = isDEV ? baseGoerli : base;
