import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  console.log("is connected :: ", isConnected);
  const signMessageAsyncTimeout = async () => {
    await fetch("https://my-vercel-functions-six.vercel.app/api?delay=1000");
    signMessageAsync({ message: "yo!" });
  };

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
      </main>
    </div>
  );
};

export default Home;
