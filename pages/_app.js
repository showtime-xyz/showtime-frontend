import React from "react";
import "../styles/globals.css";
import AppContext from "../context/app-context";
//import { useWallet, UseWalletProvider } from "use-wallet";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import ethProvider from "eth-provider";
import mixpanel from "mixpanel-browser";
mixpanel.init("9b14512bc76f3f349c708f67ab189941");

export default class MyApp extends React.Component {
  state = {
    initialized: false,
    web3Modal: null,
    web3Provider: null,
    address: "",
    user: undefined,
    windowSize: null,
    myLikes: null,
    myFollows: null,
    myProfile: undefined,
    loginModalOpen: false,
  };

  componentDidMount() {
    /*
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
      cacheProvider: true, // optional
      providerOptions, // required
    });
    this.setWeb3Modal(web3Modal);

    if (web3Modal.cachedProvider) {
      this.loadWeb3Modal(web3Modal);
    }*/
  }

  async loadWeb3Modal(web3Modal) {
    const provider = await web3Modal.connect();
    const web3Provider = new Web3Provider(provider);

    provider.on("accountsChanged", (accounts) => {
      this.setAddress(accounts[0]);
    });

    const address = await web3Provider.getSigner().getAddress();
    this.setAddress(address);

    this.setWeb3Provider(web3Provider);
  }

  setWeb3Modal(web3Modal) {
    this.setState({ web3Modal }, () => this.setState({ initialized: true }));
  }

  setWeb3Provider(web3Provider) {
    this.setState({ web3Provider });
  }

  setAddress(address) {
    this.setState({ address });
  }

  setUser(user) {
    this.setState({ user });
  }

  setWindowSize(windowSize) {
    this.setState({ windowSize });
  }

  setMyLikes(myLikes) {
    this.setState({ myLikes });
  }

  setMyFollows(myFollows) {
    this.setState({ myFollows });
  }

  setMyProfile(myProfile) {
    this.setState({ myProfile });
  }

  setLoginModalOpen(loginModalOpen) {
    this.setState({ loginModalOpen });
  }

  render() {
    const { Component, pageProps } = this.props;

    const injectedGlobalContext = {
      initialized: this.state.initialized,
      web3Modal: this.state.web3Modal,
      web3Provider: this.state.web3Provider,
      address: this.state.address,
      user: this.state.user,
      windowSize: this.state.windowSize,
      myLikes: this.state.myLikes,
      myFollows: this.state.myFollows,
      myProfile: this.state.myProfile,
      loginModalOpen: this.state.loginModalOpen,
      setWeb3Modal: (web3Modal) => this.setWeb3Modal(web3Modal),
      setWeb3Provider: (web3Provider) => this.setWeb3Provider(web3Provider),
      setAddress: (address) => this.setAddress(address),
      setUser: (user) => this.setUser(user),
      setWindowSize: (windowSize) => this.setWindowSize(windowSize),
      setMyLikes: (myLikes) => this.setMyLikes(myLikes),
      setMyFollows: (myFollows) => this.setMyFollows(myFollows),
      setMyProfile: (myProfile) => this.setMyProfile(myProfile),
      setLoginModalOpen: (loginModalOpen) =>
        this.setLoginModalOpen(loginModalOpen),
    };

    return (
      <AppContext.Provider value={injectedGlobalContext}>
        <Component {...pageProps} />
      </AppContext.Provider>
    );
  }
}
