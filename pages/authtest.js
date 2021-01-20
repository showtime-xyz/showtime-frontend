import { useState, useEffect } from "react";
import _ from "lodash";
import Layout from "../components/layout";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Home() {
  const [account, setAccount] = useState("");
  const [web3Modal, setWeb3modal] = useState(null);
  const [provider, setProvider] = useState("");
  const router = useRouter();

  useEffect(() => {
    // window is accessible here.
    setWeb3modal(
      new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      })
    );
  }, []);

  const providerOptions = {};

  const connect = async () => {
    try {
      const newProvider = await web3Modal.connect();
      const web3 = new Web3(newProvider);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      setProvider(newProvider);

      // login with our own API
      const authRequest = await fetch("/api/loginwallet", {
        method: "POST",
        headers: { Authorization: `Bearer ${accounts[0]}` },
      });

      if (authRequest.ok) {
        // We successfully logged in, our API
        // set authorization cookies and now we
        // can redirect to the dashboard!
        router.push("/");
      } else {
        /* handle errors */
      }
    } catch (err) {
      console.error(err);
    }
  };

  /*
  useEffect(() => {
    if (web3Modal && window.web3) {
      connect();
    }
  }, [web3Modal]);*/

  async function disconnect() {
    if (provider.disconnect) {
      await provider.disconnect();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await web3Modal.clearCachedProvider();
      setProvider(null);
    }
    window.location.reload();
  }

  return (
    <Layout>
      <h1
        className="showtime-title text-center mx-auto"
        style={{ maxWidth: 1000 }}
      >
        Auth Test
      </h1>
      <p>Account: {account}</p>
    </Layout>
  );
}
