import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import ethProvider from "eth-provider";
import _ from "lodash";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default function AuthTest() {
  const [web3Modal, setWeb3Modal] = useState(null);
  const [address, setAddress] = useState(null);
  const [isMetaMask, setIsMetaMask] = useState(false);
  const [myWeb3Provider, setMyWeb3Provider] = useState(null);

  const logoutOfWeb3Modal = function () {
    if (web3Modal) web3Modal.clearCachedProvider();
    setAddress(null);
  };

  const loadWeb3Modal = async function () {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        },
      },
      authereum: {
        package: Authereum,
      },
      frame: {
        package: ethProvider,
      },
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });
    setWeb3Modal(web3Modal);

    const provider = await web3Modal.connect();
    const web3Provider = new Web3Provider(provider);

    provider.on("accountsChanged", (accounts) => {
      // Do something with the new account
      console.log("ACCOUNTS CHANGED");
      setAddress(accounts[0]);
    });

    const currentAddress = await web3Provider.getSigner().getAddress();
    setAddress(currentAddress);
    setIsMetaMask(provider.isMetaMask);
    setMyWeb3Provider(web3Provider);

    /*
    // login with our own API
    const authRequest = await fetch("/api/loginwallet", {
      method: "POST",
      headers: { Authorization: `Bearer ${address}` },
    });

    if (authRequest.ok) {
      // We successfully logged in, our API
      // set authorization cookies and now we
      // can redirect to the dashboard!
    } else {
      // handle errors 
    }*/
  };

  const handleSignMessage = async (nonce) => {
    try {
      const signature = await myWeb3Provider
        .getSigner()
        .signMessage(`I am signing my one-time nonce: ${nonce}`);

      console.log(signature);
      return signature;
    } catch (err) {
      //throw new Error("You need to sign the message to be able to log in.");
      //console.log("probably dismissed modal");
    }
  };

  const raw_signature =
    "0xd14a3bbeeb2d11392070b99038d9f3cde8b1357bd678b9b4a3b52ce48442ea0f5c71fb661881b120b655da90f1ee1663ca51ef796509254c02a9a229b26884ee1c";

  const verify = ({ publicAddress, raw_signature }) => {
    console.log("HERE");
    const nonce = 12345;
    const msg = `I am signing my one-time nonce: ${nonce}`;
    console.log(msg);
    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
    //console.log(msgBufferHex);
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: raw_signature,
    });

    console.log(address.toLowerCase());

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial publicAddress
    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      console.log("VERIFIED");
    } else {
      console.log("SIG VERIFICATION FAILED");
    }
  };

  return (
    <div>
      {address ? (
        <div className="bg-white p-16">
          <div>Detected Wallet: {address}</div>
          <div>
            <button
              className="p-2 border-2"
              onClick={() => {
                handleSignMessage(12345);
              }}
            >
              ADD THIS WALLET TO MY PROFILE
            </button>
            <br />
            <br />
            <button
              className="p-2 border-2"
              onClick={() => {
                console.log("CLIECK");
                verify({
                  publicAddress: address,
                  raw_signature: raw_signature,
                });
              }}
            >
              VERIFY
            </button>
          </div>
          <div>
            {isMetaMask
              ? "If you wish to add a different wallet, switch wallets in the MetaMask dropdown"
              : null}
          </div>
        </div>
      ) : null}
      <br />
      <br />
      <button
        onClick={() => {
          loadWeb3Modal();
        }}
      >
        Connect a wallet
      </button>
      <br />
      <br />
      <button
        onClick={() => {
          logoutOfWeb3Modal();
        }}
      >
        Log out
      </button>
    </div>
  );
}
