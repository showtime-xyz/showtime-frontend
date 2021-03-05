import { useContext, useState, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import ethProvider from "eth-provider";
import _ from "lodash";
import ClientOnlyPortal from "./ClientOnlyPortal";
import backend from "../lib/backend";
//import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";
import Web3 from "web3";

export default function Modal({ isOpen, setWalletModalOpen }) {
  //const context = useContext(AppContext);
  const [signaturePending, setSignaturePending] = useState(false);
  const [step, setStep] = useState(1);

  const [addressDetected, setAddressDetected] = useState(null);

  const [myWeb3Modal, setMyWeb3Modal] = useState(null);
  const [myProvider, setMyProvider] = useState(null);

  useEffect(() => {
    console.log(myProvider);

    const connect = async () => {
      const web3 = new Web3(myProvider);
      const accounts = await web3.eth.getAccounts();
      setAddressDetected(accounts[0]);

      myProvider.on("accountsChanged", async (accounts) => {
        //console.log(accounts);
        setAddressDetected(accounts[0]);
      });
    };
    connect();
  }, [myProvider]);

  useEffect(() => {
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
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });
    setMyWeb3Modal(web3Modal);
  }, []);

  const tryAgain = async () => {
    if (myProvider.close) {
      await myProvider.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await myWeb3Modal.clearCachedProvider();
      setMyProvider(null);
    }
  };

  const fetchAccountData = async () => {
    // Get a Web3 instance for the wallet
    const web3 = new Web3(myProvider);

    console.log("Web3 instance is", web3);

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
    setAddressDetected(accounts[0]);
  };

  const onConnect = async () => {
    console.log("Opening a dialog", myWeb3Modal);
    try {
      setMyProvider(await myWeb3Modal.connect());
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    // Subscribe to accounts change
    //provider.on("accountsChanged", async (accounts) => {
    //const web3 = new Web3(myProvider);
    //const accounts = await web3.eth.getAccounts();
    //console.log("Got accounts", accounts);
    //setAddressDetected(accounts[0]);
    //});

    /*
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
      fetchAccountData();
    });
    */

    //setMyProvider(provider);

    //await fetchAccountData();
  };

  /**
   * Disconnect wallet button pressed.
   */
  const onDisconnect = async () => {
    console.log("Killing the wallet connection", myProvider);

    // TODO: Which providers have close method?
    if (myProvider.close) {
      await myProvider.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await myWeb3Modal.clearCachedProvider();
      setMyProvider(null);
    }

    setAddressDetected(null);
  };

  const pickWallet = async () => {
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

    web3Modal.clearCachedProvider();

    const provider = await web3Modal?.connect();
    const web3 = new Web3(provider);
    console.log(web3.eth);
    const coinbase = await web3.eth.getCoinbase();
    setAddressDetected(coinbase);
  };

  const handleSelectWallet = async () => {
    mixpanel.track("Add wallet - select wallet button clicked");

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

    const web3 = new Web3(provider);
    console.log(web3.eth);
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

      /*
      // login with our own API
      const authRequest = await fetch("/api/loginsignature", {
        method: "POST",
        body: JSON.stringify({
          signature,
          address,
        }),
      });

      if (authRequest.ok) {
      } else {
        // handle errors
      }
      */
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
          <div className="backdrop" onClick={() => setWalletModalOpen(false)}>
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton setEditModalOpen={setWalletModalOpen} />
              <div
                className="text-3xl border-b-2 pb-2 text-center"
                style={{ fontWeight: 600 }}
              >
                {step == 1 ? "Add Wallet" : "Confirm Wallet"}
              </div>
              {step == 1 ? (
                <>
                  <div
                    className="my-4 py-4 text-center"
                    style={{ fontWeight: 400, fontSize: 18 }}
                  >
                    See all your NFTs under one profile!
                  </div>

                  <div className="my-4" style={{ fontSize: 14 }}>
                    If you've previously signed in with that wallet, your old
                    profile (including likes and follows) will get combined with
                    this profile.
                  </div>
                  <div className="pb-4" style={{ fontSize: 14 }}>
                    Going forward, you can log in with any of the wallets or
                    emails associated with your profile.
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 14 }}>
                  {addressDetected ? (
                    <>
                      <div style={{ fontWeight: 600 }} className="mt-4">
                        We found this wallet address:
                      </div>
                      <div>{addressDetected}</div>

                      <div className="py-4">
                        If that's not the right wallet, please switch to the
                        desired account in the MetaMask dropdown.
                      </div>
                    </>
                  ) : null}

                  <div>
                    <button
                      className="showtime-white-button px-3 py-1"
                      onClick={() => {
                        tryAgain();
                      }}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {signaturePending ? (
                <div className="text-center py-40">
                  Please sign with your wallet...
                </div>
              ) : (
                <>
                  <div className="mt-4 mb-2 pt-4 text-center border-t-2">
                    {step == 1 ? (
                      <button
                        className="showtime-pink-button bg-white text-black hover:bg-gray-300 py-2 px-4"
                        onClick={() => {
                          setStep(2);
                          //pickWallet({ clearCachedProvider: true });
                          onConnect();
                        }}
                        style={{ borderRadius: 7 }}
                      >
                        Select wallet...
                      </button>
                    ) : (
                      <button
                        className="showtime-pink-button bg-white text-black hover:bg-gray-300 py-2 px-4"
                        onClick={() => {
                          setStep(1);
                        }}
                        style={{ borderRadius: 7 }}
                      >
                        Sign to finish
                      </button>
                    )}
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
