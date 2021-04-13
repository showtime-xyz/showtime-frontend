import { useContext, useState } from "react";
import mixpanel from "mixpanel-browser";
import { Magic } from "magic-sdk";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
//import Authereum from "authereum";
//import ethProvider from "eth-provider";
import { WalletLink } from "walletlink";
import _ from "lodash";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";
import Web3 from "web3";
import Fortmatic from "fortmatic";
import ScrollableModal from "./ScrollableModal";

export default function Modal({ isOpen }) {
  const context = useContext(AppContext);
  const [signaturePending, setSignaturePending] = useState(false);

  const handleSubmitEmail = async (event) => {
    mixpanel.track("Login - email button click");
    event.preventDefault();

    const { elements } = event.target;

    // the magic code
    try {
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
    } catch {
      /* handle errors */
    }
  };

  const handleSubmitWallet = async () => {
    mixpanel.track("Login - wallet button click");

    var providerOptions = {
      walletconnect: {
        display: {
          description: "Use Rainbow & other popular wallets",
        },
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        },
      },
      fortmatic: {
        package: Fortmatic, // required
        options: {
          key: process.env.NEXT_PUBLIC_FORTMATIC_PUB_KEY, // required
        },
      },
    };
    if (!context.isMobile) {
      providerOptions = {
        ...providerOptions,
        "custom-walletlink": {
          display: {
            logo: "/coinbase.svg",
            name: "Coinbase",
            description: "Use Coinbase Wallet app on mobile device",
          },
          options: {
            appName: "Showtime", // Your app name
            networkUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
            chainId: process.env.NEXT_PUBLIC_CHAINID,
          },
          package: WalletLink,
          connector: async (_, options) => {
            const { appName, networkUrl, chainId } = options;
            const walletLink = new WalletLink({
              appName,
            });
            const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
            await provider.enable();
            return provider;
          },
        },
      };
    }

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
        <ScrollableModal
          closeModal={() => context.setLoginModalOpen(false)}
          contentWidth="25rem"
        >
          <div className="p-4">
            <CloseButton setEditModalOpen={context.setLoginModalOpen} />
            <div className="text-3xl border-b-2 pb-2 text-center">Sign in</div>
            {signaturePending ? (
              <div className="text-center py-40">
                Pushed a request to your wallet...
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmitEmail}>
                  <div className="text-center pt-8">
                    <div>
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
                      className="border-2 w-full"
                      autoFocus
                      style={{
                        color: "black",
                        padding: 10,
                        borderRadius: 7,
                      }}
                    />

                    <div
                      className="pt-8 pb-8"
                      style={{ color: "#444", fontSize: 13 }}
                    >
                      By signing in you agree to our{" "}
                      <a
                        href="https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
                        target="_blank"
                      >
                        Terms & Conditions
                      </a>
                      .
                    </div>

                    <button className="bg-stpink text-white rounded-full px-6 py-2 cursor-pointer border-2 hover:text-stpink hover:bg-white border-stpink transition-all">
                      <span className="text-sm md:text-base">
                        Sign in with Email
                      </span>
                    </button>
                    <div className="py-6" style={{ color: "#444" }}>
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
        </ScrollableModal>
      )}
    </>
  );
}
