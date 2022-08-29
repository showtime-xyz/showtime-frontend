import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

import { useSignTypedData } from "app/hooks/use-sign-typed-data";

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
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  console.log("is connected :: ", isConnected);
  const signMessageAsyncTimeout = async () => {
    await fetch("https://my-vercel-functions-six.vercel.app/api?delay=1000");
    signMessageAsync({ message: "yo!" });
  };

  const signTypedData = useSignTypedData();

  return (
    <div>
      <main>
        {isConnected ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : (
          <ConnectButton />
        )}
        <button
          style={{ marginLeft: 10 }}
          onClick={() => signMessageAsync({ message: "yo!" })}
        >
          Sign message
        </button>
        <button style={{ marginLeft: 10 }} onClick={signMessageAsyncTimeout}>
          Sign message async
        </button>
        <button
          onClick={async () => {
            const res = await signTypedData(
              signatureData.domain,
              signatureData.types,
              signatureData.value
            );
            console.log("result ", res);
          }}
        >
          Sign typed data
        </button>
      </main>
    </div>
  );
};

export default Home;
