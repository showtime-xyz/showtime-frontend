import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import Layout from "../components/layout";
import TokenGridV4 from "../components/TokenGridV4";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { GridTab, GridTabs } from "../components/GridTabs";

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default function Home() {
  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Home page view");
    }
  }, [typeof context.user]);

  const [featuredItems, setFeaturedItems] = useState([]);
  const [featuredDays, setFeaturedDays] = useState(1);
  const [reachedBottom, setReachedBottom] = useState(false);

  useEffect(() => {
    const getFeatured = async () => {
      const response_featured = await backend.get(
        `/v2/featured?limit=150&days=${featuredDays}`
      );
      const data_featured = response_featured.data.data;
      setFeaturedItems(data_featured);
    };
    getFeatured();
    setReachedBottom(false);
  }, [featuredDays]);

  const [gridWidth, setGridWidth] = useState();
  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 820) {
      setGridWidth(context.windowSize.width);
    } else if (context.windowSize && context.windowSize.width < 1200) {
      setGridWidth(790 - 18);
    } else if (context.windowSize && context.windowSize.width < 1600) {
      setGridWidth(1185 - 18);
    } else {
      setGridWidth(1580 - 18);
    }
  }, [context.windowSize]);

  const FilterTabs =
    gridWidth > 0 ? (
      <>
        <GridTabs title="Trending">
          <GridTab
            label="24 Hours"
            isActive={featuredDays === 1}
            onClickTab={() => {
              setFeaturedDays(1);
            }}
          />
          <GridTab
            label="7 Days"
            isActive={featuredDays === 7}
            onClickTab={() => {
              setFeaturedDays(7);
            }}
          />
          <GridTab
            label="30 Days"
            isActive={featuredDays === 30}
            onClickTab={() => {
              setFeaturedDays(30);
            }}
          />
        </GridTabs>
      </>
    ) : null;

  return (
    <Layout>
      <Head>
        <title>Showtime | Digital Art</title>
        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase digital art"
        />
        <meta property="og:image" content="/banner.png" />
        <meta name="og:title" content="Showtime" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Showtime" />
        <meta
          name="twitter:description"
          content="Discover and showcase digital art"
        />
        <meta
          name="twitter:image"
          content="https://showtime.kilkka.vercel.app/banner.png"
        />
      </Head>
      <h1
        className="showtime-title text-center mx-auto text-2xl md:text-5xl md:leading-snug mb-5 mt-5 py-10"
        style={{ maxWidth: 700 }}
      >
        Discover and showcase your favorite digital art.
      </h1>

      <TokenGridV4
        items={featuredItems}
        onFinish={() => {
          setReachedBottom(true);
        }}
        filterTabs={FilterTabs}
      />

      {featuredItems.length > 0 && reachedBottom ? (
        <div className="text-center pt-8 pb-16">
          <Link href="/c/[collection]" as="/c/all">
            <a className="showtime-purple-button-icon flex flex-row items-center">
              <div className="mr-2">Explore more</div>
              <div className="flex">
                <FontAwesomeIcon style={{ height: 18 }} icon={faArrowRight} />
              </div>
            </a>
          </Link>
        </div>
      ) : null}
    </Layout>
  );
}
