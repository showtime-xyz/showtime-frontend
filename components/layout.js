import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import PropTypes from "prop-types";
//import backend from "../lib/backend";
import AppContext from "../context/app-context";
import ScrollUp from "./ScrollUp";
import Footer from "./footer";
import Header from "./header";
import RecommendFollowers from "./RecommendFollowers";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";

const Layout = ({ children }) => {
  const context = useContext(AppContext);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const { myProfile } = context;
  const has_onboarded = myProfile?.has_onboarded;
  const router = useRouter();
  const [recInProgress, setRecInProgress] = useState(false);

  const getRecommended = async () => {
    if (has_onboarded === false && recInProgress == false) {
      if (context.myRecommendations) {
        setRecInProgress(true);
        mixpanel.track("Trigger open Recommended Followers modal");
        setRecommendedItems(context.myRecommendations);
        setRecInProgress(false);
      }
    }
  };

  useEffect(() => {
    const handleRouterChange = () => {
      getRecommended();
    };
    router.events.on("routeChangeComplete", handleRouterChange);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <link rel="icon" href="/logo_sm.jpg" />

        <meta name="keywords" content="showtime, ethereum, token, nft" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EJP74KCP4M"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EJP74KCP4M');
        `,
          }}
        />
      </Head>

      <Header />
      <ScrollUp />
      {typeof document !== "undefined" &&
      recommendedItems &&
      recommendedItems.length > 0 ? (
        <RecommendFollowers items={recommendedItems} />
      ) : null}
      <main>{children}</main>

      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
