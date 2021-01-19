import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Magic } from "magic-sdk";
import WalletButton from "../components/WalletButton";
import AppContext from "../context/app-context";
import Web3Modal from "web3modal";
import Web3 from "web3";
import Layout from "../components/layout";
import WalletConnectProvider from "@walletconnect/web3-provider";

export default function Login() {
  const router = useRouter();

  // START WALLET LOGIN
  const [account, setAccount] = useState("");
  const [web3Modal, setWeb3modal] = useState(null);
  const [provider, setProvider] = useState("");

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

  const providerOptions = {
    /*walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "INFURA_ID" // required
      }
    }*/
  };

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
  // END WALLET LOGIN

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { elements } = event.target;

    // the magic code
    const did = await new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUB_KEY
    ).auth.loginWithMagicLink({ email: elements.email.value });

    // Once we have the did from magic, login with our own API
    const authRequest = await fetch("/api/login", {
      method: "POST",
      headers: { Authorization: `Bearer ${did}` },
    });

    if (authRequest.ok) {
      // We successfully logged in, our API
      // set authorization cookies and now we
      // can redirect to the dashboard!
      router.push("/");
    } else {
      /* handle errors */
    }
  };

  return (
    <Layout>
      <div className="text-center">
        <div>Select a login method:</div>
        <form onSubmit={handleSubmit}>
          <br />
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <input name="email" type="email" style={{ color: "black" }} />
          <br />
          <br />
          <button className="showtime-pink-button">Log in with Email</button>
        </form>
        <br />
        __________________________________
        <br />
        <br />
        <WalletButton  className="bg-white text-black"/>
        <br />
        <br />
        <p>
          Select this option if you are using providers like Metamask, Dapper,
          Gnosis Safe, Frame, Web3 Browsers, etc.
        </p>
      </div>
    </Layout>
  );
}
