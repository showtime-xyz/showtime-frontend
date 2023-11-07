import type { NextPage } from "next";

const signatureData = {
  domain: {
    name: "showtime.xyz",
    version: "v1",
    chainId: "80001",
    verifyingContract: "0x50c001c88b59dc3b833E0F062EfC2271CE88Cb89",
  },
  types: {
    ForwardRequest: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
      {
        name: "gas",
        type: "uint256",
      },
      {
        name: "nonce",
        type: "uint256",
      },
      {
        name: "data",
        type: "bytes",
      },
      {
        name: "validUntilTime",
        type: "uint256",
      },
    ],
  },
  value: {
    from: "0xd97Bc2B4286B94D039f5ec3Ea6b4235AA1B6AC86",
    to: "0xD3F9EDAa55a939B0CF06dfc750B5DC2Ea9bA10Db",
    value: "0",
    gas: "1500000",
    nonce: "18",
    data: "0xa66ff0af000000000000000000000000d97bc2b4286b94d039f5ec3ea6b4235aa1b6ac86",
    validUntilTime: "1659098739",
  },
};

const Home: NextPage = () => {
  return null;
};

export default Home;
