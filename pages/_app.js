import React from "react";
import "../styles/globals.css";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
mixpanel.init("9b14512bc76f3f349c708f67ab189941");

export default class MyApp extends React.Component {
  state = {
    user: undefined,
    windowSize: null,
    myLikes: null,
    myLikeCounts: null,
    myFollows: null,
    myProfile: undefined,
    loginModalOpen: false,
    gridWidth: null,
    columns: null,
    isMobile: null,
  };

  getUserFromCookies = async () => {
    // log in with our own API
    const userRequest = await fetch("/api/user");
    try {
      const user_data = await userRequest.json();
      this.setUser(user_data);

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

      // get our likes, follows, profile
      const myInfoRequest = await fetch("/api/myinfo");
      try {
        const my_info_data = await myInfoRequest.json();
        this.setMyLikes(my_info_data.data.likes_nft);
        this.setMyFollows(my_info_data.data.follows);
        this.setMyProfile(my_info_data.data.profile);
      } catch {}
    } catch {
      // Not logged in
      // Switch from undefined to null
      this.setUser(null);
    }
  };

  handleResize = () => {
    // Set window width/height to state
    this.setState({
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
    //update grid width / columns
    this.adjustGridProperties(window.innerWidth);
  };

  logOut = async () => {
    const authRequest = await fetch("/api/logout", {
      method: "POST",
    });

    if (authRequest.ok) {
      this.setUser(null);
      this.setMyLikes([]);
      this.setMyLikeCounts({});

      this.setMyFollows([]);

      mixpanel.track("Logout");
    } else {
      /* handle errors */
    }
  };

  componentDidMount() {
    this.getUserFromCookies();

    // Add event listener
    window.addEventListener("resize", this.handleResize);

    // Call handler right away so state gets updated with initial window size
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
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

  setMyLikeCounts(myLikeCounts) {
    this.setState({ myLikeCounts });
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

  setGridWidth(gridWidth) {
    this.setState({ gridWidth });
  }

  setColumns(columns) {
    this.setState({ columns });
  }

  setIsMobile(isMobile) {
    this.setState({ isMobile });
  }

  adjustGridProperties(windowWidth) {
    if (windowWidth < 790 + 30) {
      this.setIsMobile(true);
      this.setGridWidth(windowWidth);
      this.setColumns(1);
    } else if (windowWidth < 1185 + 45) {
      this.setIsMobile(false);
      this.setGridWidth(790);
      this.setColumns(2);
    } else if (windowWidth < 1580 + 40) {
      this.setIsMobile(false);
      this.setGridWidth(1185);
      this.setColumns(3);
    } else {
      this.setIsMobile(false);
      this.setGridWidth(1580);
      this.setColumns(4);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    const injectedGlobalContext = {
      user: this.state.user,
      windowSize: this.state.windowSize,
      myLikes: this.state.myLikes,
      myLikeCounts: this.state.myLikeCounts,
      myFollows: this.state.myFollows,
      myProfile: this.state.myProfile,
      loginModalOpen: this.state.loginModalOpen,
      gridWidth: this.state.gridWidth,
      columns: this.state.columns,
      isMobile: this.state.isMobile,
      setUser: (user) => this.setUser(user),
      setWindowSize: (windowSize) => this.setWindowSize(windowSize),
      setMyLikes: (myLikes) => this.setMyLikes(myLikes),
      setMyLikeCounts: (myLikeCounts) => this.setMyLikeCounts(myLikeCounts),
      setMyFollows: (myFollows) => this.setMyFollows(myFollows),
      setMyProfile: (myProfile) => this.setMyProfile(myProfile),
      setLoginModalOpen: (loginModalOpen) =>
        this.setLoginModalOpen(loginModalOpen),

      getUserFromCookies: () => this.getUserFromCookies(),
      logOut: () => this.logOut(),
    };

    return (
      <AppContext.Provider value={injectedGlobalContext}>
        <Component {...pageProps} />
      </AppContext.Provider>
    );
  }
}
