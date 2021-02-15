import { useContext } from "react";
import { useRouter } from "next/router";

import Web3Modal from "web3modal";
import AppContext from "../context/app-context";

import { Web3Provider } from "@ethersproject/providers";
import mixpanel from "mixpanel-browser";

export default function WalletButton({
  user,
  setUser,
  type,
  text,
  className,
  redirect,
}) {
  const context = useContext(AppContext);
  const router = useRouter();
  const web3Modal = context?.web3Modal;

  const logoutOfWeb3Modal = function () {
    if (web3Modal) web3Modal.clearCachedProvider();
    window.location.reload();
  };

  const loadWeb3Modal = async function () {
    const provider = await web3Modal?.connect();
    if (context?.setWeb3Provider) {
      context.setWeb3Provider(new Web3Provider(provider));
      //console.log(new Web3Provider(provider));
      if (redirect) router.push("/");

      const address = await new Web3Provider(provider).getSigner().getAddress();
      //console.log(address);

      // login with our own API
      const authRequest = await fetch("/api/loginwallet", {
        method: "POST",
        headers: { Authorization: `Bearer ${address}` },
      });

      if (authRequest.ok) {
        // We successfully logged in, our API
        // set authorization cookies and now we
        // can redirect to the dashboard!
        mixpanel.track("Login success - wallet");
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
          getUserFromCookies();
          getMyInfo();
        }

        //setEditModalOpen(false);
        context.setLoginModalOpen(false);
      } else {
        /* handle errors */
      }
    }
  };

  const buttonOnClick = function () {
    mixpanel.track("Login - wallet button click");

    if (!web3Modal?.cachedProvider) {
      loadWeb3Modal();
    } else {
      if (redirect) {
        router.push("/");
      } else {
        logoutOfWeb3Modal();
      }
    }
  };

  let linkText = "Disconnect Wallet";
  if (web3Modal && !web3Modal.cachedProvider) {
    linkText = text ? text : "Sign in with Wallet";
  } else if (web3Modal && web3Modal.cachedProvider) {
    linkText = text ? text : "Disconnect Wallet";
  } else if (!web3Modal) linkText = "Not connected properly";

  const linkType = type ? type : "button";

  return (
    <>
      {linkType === "button" && (
        <button onClick={buttonOnClick} className={"showtime-white-button"}>
          {linkText}
        </button>
      )}
      {linkType === "text" && (
        <button onClick={logoutOfWeb3Modal} className={"showtime-white-button"}>
          {linkText}
        </button>
      )}
    </>
  );
}
