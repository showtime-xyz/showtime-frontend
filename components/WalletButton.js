import { useContext } from "react";
import { useRouter } from "next/router";

import Web3Modal from "web3modal";
import AppContext from "../context/app-context";

import { Web3Provider } from "@ethersproject/providers";

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
      console.log(new Web3Provider(provider));
      if (redirect) router.push("/");
    }
  };

  const buttonOnClick = function () {
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
    linkText = text ? text : "Connect Wallet";
  } else if (web3Modal && web3Modal.cachedProvider) {
    linkText = text ? text : "Disconnect Wallet";
  } else if (!web3Modal) linkText = "Not connected properly";

  const linkType = type ? type : "button";

  return (
    <>
      {linkType === "button" && (
        <button
          onClick={buttonOnClick}
          className={className}
        >
          {linkText}
        </button>
      )}
      {linkType === "text" && (
        <button
          onClick={logoutOfWeb3Modal}
          className={className}
        >
          {linkText}
        </button>
      )}
    </>
  );
}
