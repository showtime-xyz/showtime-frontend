import React from "react";
import "@/styles/globals.css";
import AppContext from "@/context/app-context";
import mixpanel from "mixpanel-browser";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

mixpanel.init("9b14512bc76f3f349c708f67ab189941");

// Progress bar during Routing changes
const progress = new ProgressBar({
  size: 3,
  color: "#e45cff",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export default class MyApp extends React.Component {
  state = {
    user: undefined,
    windowSize: null,
    myLikes: null,
    myLikeCounts: null,
    myComments: null,
    myCommentCounts: null,
    myFollows: null,
    myProfile: undefined,
    myRecommendations: undefined,
    loginModalOpen: false,
    gridWidth: null,
    columns: null,
    isMobile: null,
    toggleRefreshFeed: false,
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
        this.setMyComments(my_info_data.data.comments);
        this.setMyFollows(my_info_data.data.follows);
        this.setMyProfile({
          ...my_info_data.data.profile,
          // turn notifications_last_opened into Date before storing in context
          notifications_last_opened: my_info_data.data.profile
            .notifications_last_opened
            ? new Date(my_info_data.data.profile.notifications_last_opened)
            : null,
          links: my_info_data.data.profile.links.map((link) => ({
            name: link.type__name,
            prefix: link.type__prefix,
            icon_url: link.type__icon_url,
            type_id: link.type_id,
            user_input: link.user_input,
          })),
        });

        // Load up the recommendations async if we are onboarding
        //console.log(my_info_data.data.profile.has_onboarded);
        if (my_info_data.data.profile.has_onboarded == false) {
          //console.log("NEED TO ONBOARD");

          const myRecRequest = await fetch(
            "/api/follow_recommendations_onboarding"
          );
          const my_rec_data = await myRecRequest.json();
          this.setMyRecommendations(my_rec_data.data);
          //console.log("FINISHED LOADING ONBAORDING DATA");
          //console.log(my_rec_data.data);
        }
      } catch (e) {
        //console.log(e);
      }
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
      this.setMyComments([]);
      this.setMyCommentCounts({});
      this.setMyFollows([]);
      this.setMyRecommendations([]);
      this.setMyProfile(undefined);

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

  setMyComments(myComments) {
    this.setState({ myComments });
  }
  setMyCommentCounts(myCommentCounts) {
    this.setState({ myCommentCounts });
  }

  setMyFollows(myFollows) {
    this.setState({ myFollows });
  }

  setMyProfile(myProfile) {
    this.setState({ myProfile });
  }

  setMyRecommendations(myRecommendations) {
    this.setState({ myRecommendations });
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

  setToggleRefreshFeed(toggleRefreshFeed) {
    this.setState({ toggleRefreshFeed });
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
      myComments: this.state.myComments,
      myCommentCounts: this.state.myCommentCounts,
      myFollows: this.state.myFollows,
      myProfile: this.state.myProfile,
      myRecommendations: this.state.myRecommendations,
      loginModalOpen: this.state.loginModalOpen,
      gridWidth: this.state.gridWidth,
      columns: this.state.columns,
      isMobile: this.state.isMobile,
      toggleRefreshFeed: this.state.toggleRefreshFeed,
      setWindowSize: (windowSize) => this.setWindowSize(windowSize),
      setMyLikes: (myLikes) => this.setMyLikes(myLikes),
      setMyLikeCounts: (myLikeCounts) => this.setMyLikeCounts(myLikeCounts),
      setMyComments: (myComments) => this.setMyComments(myComments),
      setMyCommentCounts: (myCommentCounts) =>
        this.setMyCommentCounts(myCommentCounts),
      setMyFollows: (myFollows) => this.setMyFollows(myFollows),
      setMyProfile: (myProfile) => this.setMyProfile(myProfile),
      setMyRecommendations: (myRecommendations) =>
        this.setMyRecommendations(myRecommendations),
      setLoginModalOpen: (loginModalOpen) =>
        this.setLoginModalOpen(loginModalOpen),

      getUserFromCookies: () => this.getUserFromCookies(),
      logOut: () => this.logOut(),
      setToggleRefreshFeed: (toggleRefreshFeed) =>
        this.setToggleRefreshFeed(toggleRefreshFeed),
      setUser: (user) => this.setUser(user),
    };

    return (
      <AppContext.Provider value={injectedGlobalContext}>
        <Component {...pageProps} />
      </AppContext.Provider>
    );
  }
}
