import { useContext, useState } from "react";
import mixpanel from "mixpanel-browser";
import { Magic } from "magic-sdk";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import ethProvider from "eth-provider";
import _ from "lodash";
import ClientOnlyPortal from "./ClientOnlyPortal";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";
import Web3 from "web3";

export default function Modal({ isOpen }) {
  const context = useContext(AppContext);
  const [signaturePending, setSignaturePending] = useState(false);

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
      //authereum: {
      //  package: Authereum,
      //},
      //frame: {
      //  package: ethProvider,
      //},
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });

    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);

    const coinbase = await web3.eth.getCoinbase();
    const address = coinbase.toLowerCase();
    const response_nonce = await backend.get(`/v1/getnonce?address=${address}`);

    try {
      setSignaturePending(true);
      const signature = await web3.eth.personal.sign(
        process.env.NEXT_PUBLIC_SIGNING_MESSAGE + response_nonce.data.data,
        address,
        "" // MetaMask will ignore the password argument here
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
    } finally {
      setSignaturePending(false);
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
              <CloseButton setEditModalOpen={context.setLoginModalOpen} />
              <div className="text-3xl border-b-2 pb-2 text-center">
                Sign in
              </div>
              {signaturePending ? (
                <div className="text-center py-40">
                  Please sign with your wallet...
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmitEmail}>
                    <div className="text-center pt-8">
                      <div
                        style={
                          context.windowSize && context.windowSize.width < 400
                            ? { maxWidth: 215, margin: "auto" }
                            : null
                        }
                      >
                        <label htmlFor="email" className="pb-4 ">
                          Enter your email to receive a sign in link.
                        </label>
                        <div
                          className="pt-1 pb-1"
                          style={{ color: "#444", fontSize: 13 }}
                        >
                          If this is your first time, it will create a new
                          account.
                        </div>
                      </div>
                      <br />
                      <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        className="border-2 w-full mb-8"
                        autoFocus
                        style={{
                          color: "black",
                          padding: 10,
                          borderRadius: 7,
                        }}
                      />
                      <button className="bg-stpink text-white rounded-full px-6 py-2 cursor-pointer border-2 hover:text-stpink hover:bg-white border-stpink transition-all">
                        <span className="text-sm md:text-base">
                          Sign in with Email
                        </span>
                      </button>
                      <div className="py-8" style={{ color: "#444" }}>
                        — or —
                      </div>
                    </div>
                  </form>

                  <div className="mb-4 text-center">
                    <button
                      className="bg-black text-white border-black rounded-full px-6 py-2 cursor-pointer border-2 hover:text-black hover:bg-white transition-all"
                      onClick={() => {
                        handleSubmitWallet();
                      }}
                    >
                      <span className="text-sm md:text-base">
                        Sign in with Wallet
                      </span>
                    </button>
                  </div>
                </>
              )}
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
