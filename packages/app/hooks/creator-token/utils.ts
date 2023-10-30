import { baseGoerli, base } from "viem/chains";

import { isDEV } from "app/utilities";

export const usdcAddress = isDEV
  ? "0xF175520C52418dfE19C8098071a252da48Cd1C19"
  : "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const wETHAddress = isDEV
  ? "0x4200000000000000000000000000000000000006"
  : "0x4200000000000000000000000000000000000006";

export const quoterv2Address = isDEV
  ? "0xedf539058e28E5937dAef3f69cEd0b25fbE66Ae9"
  : "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";

export const creatorTokenSwapRouterAddress = isDEV
  ? "not_implemented"
  : "0x2390491f26873090492792f64f3eea66f611a801";

export const baseChain = isDEV ? baseGoerli : base;
