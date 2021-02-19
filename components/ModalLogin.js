import { useContext, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import { Magic } from "magic-sdk";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import ethProvider from "eth-provider";
import _ from "lodash";
import backend from "../lib/backend";

export default function Modal({ isOpen, setEditModalOpen }) {
  const context = useContext(AppContext);

  const handleSubmitEmail = async (event) => {
    mixpanel.track("Login - email button click");
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
      mixpanel.track("Login success - email");

      if (!context?.user) {
        context.getUserFromCookies();
      }
      context.setLoginModalOpen(false);
    } else {
      /* handle errors */
    }
  };

  const handleSubmitWallet = async () => {
    mixpanel.track("Login - wallet button click");

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

    const provider = await web3Modal.connect();
    const web3Provider = new Web3Provider(provider);

    /*
    provider.on("accountsChanged", (accounts) => {
      // Do something with the new account
      console.log("ACCOUNTS CHANGED");
      console.log(accounts[0]);
    });
    */

    const address = await web3Provider.getSigner().getAddress();
    const response_nonce = await backend.get(`/v1/getnonce?address=${address}`);

    try {
      const signature = await web3Provider
        .getSigner()
        .signMessage(
          process.env.NEXT_PUBLIC_SIGNING_MESSAGE + response_nonce.data.data
        );

      // login with our own API
      const authRequest = await fetch("/api/loginsignature", {
        method: "POST",
        body: JSON.stringify({
          signature,
          address,
        }),
      });

      if (authRequest.ok) {
        mixpanel.track("Login success - wallet signature");

        if (!context?.user) {
          context.getUserFromCookies();
        }
        context.setLoginModalOpen(false);
      } else {
        // handle errors
      }
    } catch (err) {
      //throw new Error("You need to sign the message to be able to log in.");
      //console.log(err);
    }
  };

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div
            className="backdrop"
            onClick={() => context.setLoginModalOpen(false)}
          >
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmitEmail}>
                <CloseButton setEditModalOpen={context.setLoginModalOpen} />
                <div
                  className="text-3xl border-b-2 pb-2 text-center"
                  style={{ fontWeight: 600 }}
                >
                  Sign in / Sign up
                </div>
                <div className="text-center pt-8">
                  <label
                    htmlFor="email"
                    className="pb-4 "
                    style={{ fontWeight: 600 }}
                  >
                    Please enter your email:
                  </label>
                  <br />
                  <br />
                  <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    className="border-2 w-full"
                    autoFocus
                    style={{
                      color: "black",
                      padding: 10,
                      borderRadius: 7,
                    }}
                  />
                  <br />
                  <br />
                  <button className="showtime-pink-button">
                    Sign in with Email
                  </button>
                  <div className="pt-4" style={{ color: "#444", fontSize: 13 }}>
                    You will receive a sign in link in your inbox
                  </div>
                  <div className="py-8" style={{ color: "#444" }}>
                    — or —
                  </div>
                </div>
              </form>

              <div className="mb-4 text-center">
                {/*<WalletButton className="bg-white text-black hover:bg-gray-300 rounded-lg py-2 px-5" />*/}
                <button
                  className="showtime-white-button bg-white text-black hover:bg-gray-300 rounded-lg py-2 px-5"
                  onClick={() => {
                    handleSubmitWallet();
                  }}
                >
                  Sign in with Wallet
                </button>
              </div>
            </div>
            <style jsx>{`
              :global(body) {
                overflow: hidden;
              }
              .backdrop {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.7);
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
              }
              .modal {
                background-color: white;
                position: absolute;
                top: 10%;
                right: 5%;
                left: 5%;
                padding: 1em;
                border-radius: 7px;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
              }
            `}</style>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
