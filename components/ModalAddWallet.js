import { useContext, useState, useEffect } from "react";
import mixpanel from "mixpanel-browser";
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
import { useRouter } from "next/router";

export default function Modal({ isOpen, setWalletModalOpen, walletAddresses }) {
  const context = useContext(AppContext);
  const [signaturePending, setSignaturePending] = useState(false);
  const [step, setStep] = useState(1);

  const [addressDetected, setAddressDetected] = useState(null);

  const [myWeb3Modal, setMyWeb3Modal] = useState(null);
  const [myProvider, setMyProvider] = useState(null);
  const router = useRouter();

  const connect = async () => {
    const web3 = new Web3(myProvider);
    const accounts = await web3.eth.getAccounts();
    setAddressDetected(accounts[0]);

    myProvider.on("accountsChanged", async (accounts) => {
      //console.log(accounts);
      setAddressDetected(accounts[0]);
    });
  };

  useEffect(() => {
    if (isOpen && myProvider) {
      console.log(myProvider);

      connect();
    }

    return function cleanup() {
      if (myProvider && myProvider.close) {
        myProvider.close();
      }
    };
  }, [myProvider, isOpen]);

  useEffect(() => {
    if (isOpen) {
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
    }

    return function cleanup() {
      if (myWeb3Modal) {
        myWeb3Modal.clearCachedProvider();
        myWeb3Modal.off();
      }
    };
  }, [isOpen]);

  const tryAgain = async () => {
    if (myProvider && myProvider.close) {
      await myProvider.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await myWeb3Modal.clearCachedProvider();
      setMyProvider(null);
    }
    onConnect();
  };

  const onConnect = async () => {
    console.log("Opening a dialog", myWeb3Modal);
    try {
      setMyProvider(await myWeb3Modal.connect());
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      setStep(1);
      return;
    }
  };

  const signMessage = async () => {
    const response_nonce = await backend.get(
      `/v1/getnonce?address=${addressDetected.toLowerCase()}`
    );

    const web3 = new Web3(myProvider);

    try {
      setSignaturePending(true);
      const signature = await web3.eth.personal.sign(
        process.env.NEXT_PUBLIC_SIGNING_MESSAGE + response_nonce.data.data,
        addressDetected,
        "" // MetaMask will ignore the password argument here
      );
      setSignaturePending(false);
      setStep(3);

      // login with our own API
      const authRequest = await fetch("/api/addwallet", {
        method: "POST",
        body: JSON.stringify({
          signature,
          addressDetected,
        }),
      })
        .then(function (response) {
          setStep(4);
          return response.json();
        })
        .then(async function (myJson) {
          // get our likes, follows, profile
          const myInfoRequest = await fetch("/api/myinfo");
          try {
            const my_info_data = await myInfoRequest.json();
            context.setMyLikes(my_info_data.data.likes_nft);
            context.setMyFollows(my_info_data.data.follows);
            context.setMyProfile(my_info_data.data.profile);
          } catch {}

          const redirect = myJson["data"];
          router.push(`/${redirect}`);
          setWalletModalOpen(false);
          setStep(1);
        });
    } catch (err) {
      //throw new Error("You need to sign the message to be able to log in.");
      //console.log(err);
    } finally {
      setSignaturePending(false);
    }
  };

  const handleModalClose = () => {
    setWalletModalOpen(false);
    setStep(1);
    if (myWeb3Modal) {
      myWeb3Modal.clearCachedProvider();
      myWeb3Modal.off();
    }
  };

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop" onClick={() => handleModalClose()}>
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton setEditModalOpen={handleModalClose} />
              <div
                className="text-3xl border-b-2 pb-2 text-center"
                style={{ fontWeight: 600 }}
              >
                {step == 1
                  ? "Add Wallet"
                  : step == 4
                  ? "Success!"
                  : signaturePending
                  ? "Almost there!"
                  : walletAddresses
                      .map((item) => item.toLowerCase())
                      .includes(addressDetected?.toLowerCase())
                  ? "Switch Wallet"
                  : "Confirm Wallet"}
              </div>
              {step == 1 ? (
                <>
                  <div className="my-4 py-4" style={{ fontWeight: "bold" }}>
                    Now you can showcase all your wallets under one profile!
                  </div>

                  <div className="my-4" style={{}}>
                    If you've previously signed in with that wallet, your other
                    profile (including likes and follows) will get combined with
                    this profile.
                  </div>
                  <div className="pb-4" style={{}}>
                    Going forward, you can log in with any of the wallets or
                    emails associated with your profile.
                  </div>
                </>
              ) : step == 4 ? (
                <div className="text-center py-32 px-10">
                  Successfully added the wallet to your profile
                </div>
              ) : step == 3 ? null : (
                <div style={{}}>
                  {addressDetected ? (
                    signaturePending ? null : (
                      <>
                        <div style={{ fontWeight: 600 }} className="mt-4">
                          We found{" "}
                          {walletAddresses
                            .map((item) => item.toLowerCase())
                            .includes(addressDetected.toLowerCase()) ? (
                            <span style={{ color: "red" }}>an existing</span>
                          ) : (
                            <span style={{ color: "green" }}>a new</span>
                          )}{" "}
                          wallet address:
                        </div>
                        <div
                          style={{ color: "rgb(81, 125, 228)", fontSize: 13 }}
                          className="mb-6"
                        >
                          <pre>{addressDetected}</pre>
                        </div>
                        <>
                          {walletAddresses
                            .map((item) => item.toLowerCase())
                            .includes(addressDetected.toLowerCase()) ? (
                            <div className="py-4">
                              <div style={{ fontWeight: 600 }}>
                                This wallet has already been added to your
                                Showtime profile. Please switch to a different
                                wallet in your provider's menu.
                              </div>
                              <br />
                              For MetaMask, switch wallets by clicking on the
                              MetaMask icon in the toolbar, then clicking the
                              circle icon on the top right (the account
                              switcher). If you get a warning "Your current
                              account is not connected," make sure to click
                              "Connect."
                            </div>
                          ) : (
                            <div className="py-4">
                              If that's not the right wallet, please switch to
                              the desired wallet in your provider's menu.
                              <br />
                              <br />
                              For MetaMask, switch wallets by clicking on the
                              MetaMask icon in the toolbar, then clicking the
                              circle icon on the top right (the account
                              switcher). If you get a warning "Your current
                              account is not connected," make sure to click
                              "Connect."
                            </div>
                          )}

                          <div className="text-center">
                            <button
                              className="showtime-white-button px-3 py-1"
                              onClick={() => {
                                tryAgain();
                              }}
                            >
                              Try again
                            </button>
                          </div>
                        </>
                      </>
                    )
                  ) : (
                    <div className="my-16 text-center">
                      Select a wallet provider...
                    </div>
                  )}
                </div>
              )}

              {signaturePending ? (
                <div className="text-center py-40 px-10">
                  Please sign the message we're sending to your wallet...
                </div>
              ) : step == 3 ? (
                <div className="text-center py-40 px-10">
                  Adding wallet and any history, please wait...
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
                        Select wallet
                      </button>
                    ) : step == 4 ? null : step ==
                      3 ? null : addressDetected ? (
                      walletAddresses
                        .map((item) => item.toLowerCase())
                        .includes(addressDetected.toLowerCase()) ? null : (
                        <button
                          className="showtime-pink-button bg-white text-black hover:bg-gray-300 py-2 px-4"
                          onClick={() => {
                            signMessage();
                          }}
                          style={{ borderRadius: 7 }}
                        >
                          Sign to finish
                        </button>
                      )
                    ) : null}
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
                right: 3%;
                left: 3%;
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
