import React, { useContext, useState } from "react";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import ethProvider from "eth-provider";
import _ from "lodash";
import backend from "../lib/backend";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default function AuthTest() {
  const context = useContext(AppContext);
  const router = useRouter();

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

    const provider = await web3Modal.connect();
    const web3Provider = new Web3Provider(provider);

    provider.on("accountsChanged", (accounts) => {
      // Do something with the new account
      console.log("ACCOUNTS CHANGED");
      setAddress(accounts[0]);
    });

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
        // We successfully logged in, our API
        // set authorization cookies and now we
        // can redirect to the dashboard!
        mixpanel.track("Login success - wallet signature");
        //router.push("/");

        const getUserFromCookies = async () => {
          // log in with our own API
          const userRequest = await fetch("/api/user");
          try {
            const user_data = await userRequest.json();
            context.setUser(user_data);

            mixpanel.identify(user_data.publicAddress);
            if (user_data.email) {
              mixpanel.people.set({
                $email: user_data.email, // only reserved properties need the $
                USER_ID: user_data.publicAddress, // use human-readable names
                //"Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
                //"credits": 150    // ...or numbers
              });
            } else {
              mixpanel.people.set({
                //$email: user_data.email, // only reserved properties need the $
                USER_ID: user_data.publicAddress, // use human-readable names
                //"Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
                //"credits": 150    // ...or numbers
              });
            }
          } catch {
            // Not logged in
            // Switch from undefined to null
            context.setUser(null);
          }
        };

        const getMyInfo = async () => {
          // get our likes
          const myInfoRequest = await fetch("/api/myinfo");
          try {
            const my_info_data = await myInfoRequest.json();

            context.setMyLikes(my_info_data.data.likes);
            context.setMyFollows(my_info_data.data.follows);
            context.setMyProfile(my_info_data.data.profile);
          } catch {}
        };

        if (!context?.user) {
          await getUserFromCookies();
          await getMyInfo();
          console.log("success");
          router.push("/");
        }
      } else {
        // handle errors
      }
    } catch (err) {
      //throw new Error("You need to sign the message to be able to log in.");
      //console.log(err);
    }

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

  return (
    <div>
      <button
        onClick={() => {
          loadWeb3Modal();
        }}
      >
        Sign in with wallet
      </button>
    </div>
  );
}
