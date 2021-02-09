import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
//import TokenGridV3 from "../../components/TokenGridV3";
import TokenGridV4 from "../../components/TokenGridV4";
import { useRouter } from "next/router";
import Select from "react-dropdown-select";
import backend from "../../lib/backend";
//import ShareButton from "../../components/ShareButton";
import AppContext from "../../context/app-context";
import mixpanel from "mixpanel-browser";

export async function getServerSideProps(context) {
  const { collection } = context.query;

  // Get list of collections
  const response_collection_list = await backend.get(`/v1/collection_list`);
  const collection_list = [
    {
      name: "Filter by collection",
      value: "all",
      order_by: "visitor_count",
      order_direction: "desc",
      img_url: "/logo_sm.jpg",
    },
    ...response_collection_list.data.data,
  ];

  const selected_collection =
    collection_list.filter((item) => item.value === collection).length > 0
      ? collection_list.filter((item) => item.value === collection)[0]
      : null;

  // Get collection items
  //const response_collection_items = await backend.get(
  //  `/v2/collection?limit=200&collection=${collection}`
  //);
  //const collection_items = response_collection_items.data.data;

  return {
    props: {
      //collection_items,
      collection_list,
      collection,
      selected_collection,
    }, // will be passed to the page component as props
  };
}

export default function Collection({
  //collection_items,
  collection_list,
  collection,
  selected_collection,
}) {
  const [sortBy, setSortby] = useState("random");

  const [pageTitle, setPageTitle] = useState(
    selected_collection
      ? selected_collection.name === "Filter by collection"
        ? "Explore"
        : `Explore ${selected_collection.name}`
      : `Explore ${collection}`
  );

  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Collection page view", { collection: collection });
    }
  }, [typeof context.user]);

  const router = useRouter();
  const [isChanging, setIsChanging] = useState(true);
  //const { collection } = router.query;

  const onChange = async (values) => {
    mixpanel.track("Collection dropdown select");
    router.push("/c/[collection]", `/c/${values[0]["value"]}`, {
      shallow: true,
    });
    setPageTitle(
      values[0]["name"] === "Filter by collection"
        ? "Explore"
        : `Explore ${values[0]["name"]}`
    );
    setCurrentCollectionSlug(values[0]["value"]);
    //await getCollectionItems(values[0]["value"]);
    mixpanel.track("Collection page view", { collection: values[0]["value"] });
  };

  const [collectionItems, setCollectionItems] = useState([]);
  const [currentCollectionSlug, setCurrentCollectionSlug] = useState(
    collection
  );
  const [randomNumber, setRandomNumber] = useState(1);

  useEffect(() => {
    let isSubscribed = true;

    const getCollectionItems = async (collection_name) => {
      setIsChanging(true);
      const response_collection_items = await backend.get(
        `/v2/collection?limit=200&order_by=${sortBy}&collection=${collection_name}`
      );

      if (sortBy == "random" && collection_name == "all") {
        backend.get(
          `/v2/collection?limit=200&recache=1&order_by=${sortBy}&collection=${collection_name}`
        );
      }

      if (isSubscribed) {
        setCollectionItems(response_collection_items.data.data);
      }
      setIsChanging(false);
    };

    getCollectionItems(currentCollectionSlug);

    return () => (isSubscribed = false);
  }, [currentCollectionSlug, sortBy, randomNumber]);

  const [gridWidth, setGridWidth] = useState();
  const [menuPadding, setMenuPadding] = useState(0);
  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 820) {
      setGridWidth(context.windowSize.width);
      setMenuPadding(20);
    } else if (context.windowSize && context.windowSize.width < 1200) {
      setGridWidth(790 - 18);
      setMenuPadding(0);
    } else if (context.windowSize && context.windowSize.width < 1600) {
      setGridWidth(1185 - 18);
      setMenuPadding(0);
    } else {
      setGridWidth(1580 - 18);
      setMenuPadding(0);
    }
  }, [context.windowSize]);

  return (
    <Layout key={collection}>
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase digital art"
        />

        <meta
          property="og:image"
          content={
            selected_collection
              ? selected_collection.img_url
              : "https://showtime.kilkka.vercel.app/banner.png"
          }
        />

        <meta name="og:title" content={`Showtime | ${pageTitle}`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Showtime | ${pageTitle}`} />
        <meta
          name="twitter:description"
          content="Discover and showcase digital art"
        />

        <meta
          name="twitter:image"
          content={
            selected_collection
              ? selected_collection.img_url
              : "https://showtime.kilkka.vercel.app/banner.png"
          }
        />
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mt-5 py-10">
          {pageTitle}
        </div>
      </div>

      {/*collection_list && collection_list.length > 0 ? (
        <div
          className="flex flex-row mx-auto mt-6 items-center"
          style={{ width: 280 }}
        >
          <div className="text-left" style={{ width: 250 }}>
            <Select
              options={collection_list}
              labelField="name"
              valueField="value"
              values={collection_list.filter(
                (item) => item.value === collection
              )}
              searchable={false}
              onChange={(values) => onChange(values)}
              style={{ fontSize: 16 }}
            />
          </div>
          <div className="">
            <ShareButton
              url={typeof window !== "undefined" ? window.location.href : null}
              type={"collection"}
            />
          </div>
        </div>
              ) : null*/}

      {/*<div>
        {collection_list.map((item, index) => {
          return (
            <button
              key={item.value}
              className="text-xs p-2 showtime-like-button-white items-center"
              style={{
                backgroundColor: "white",
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 2,
                borderBottomWidth: 2,
                width: context.windowSize / 12,
                borderColor: "black",
              }}
            >
              <img
                alt="collection"
                className="rounded-full object-cover object-center w-8 h-8 mx-auto mr-1"
                src={item.img_url}
              />

              <div>{item.name}</div>
            </button>
          );
        })}
      </div>*/}

      {gridWidth > 0 ? (
        <div
          className="mx-auto mb-6 text-xs sm:text-sm flex flex-col sm:flex-row items-center"
          style={{
            width: gridWidth,
            paddingLeft: menuPadding,
            paddingRight: menuPadding,
          }}
        >
          {collection_list && collection_list.length > 0 ? (
            <div
              className="flex flex-row items-center mb-6 sm:mb-0"
              style={{ width: 250 }}
            >
              <div className="text-left" style={{ width: 250 }}>
                <Select
                  options={collection_list}
                  labelField="name"
                  valueField="value"
                  values={collection_list.filter(
                    (item) => item.value === collection
                  )}
                  searchable={false}
                  onChange={(values) => onChange(values)}
                  style={{ fontSize: 16 }}
                />
              </div>
              {/*<div className="">
                <ShareButton
                  url={
                    typeof window !== "undefined" ? window.location.href : null
                  }
                  type={"collection"}
                />
                </div>*/}
            </div>
          ) : null}

          {/*<div className="mr-1 text-sm sm:text-base uppercase mb-2">
            Sort by
      </div>*/}
          <div className="text-right flex-grow">
            {context.windowSize ? (
              context.windowSize.width < 375 ? (
                <>
                  <br />
                  <br />
                </>
              ) : null
            ) : null}
            <button
              className={
                sortBy === "random"
                  ? "showtime-like-button-pink px-3 py-1"
                  : "showtime-like-button-white px-3 py-1"
              }
              style={{
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
                borderRightWidth: 1,
              }}
              onClick={() => {
                if (sortBy === "random") {
                  // Rerun the random tab
                  setRandomNumber(Math.random());
                } else {
                  setSortby("random");
                }
              }}
            >
              Random
            </button>
            <button
              className={
                sortBy === "newest"
                  ? "showtime-like-button-pink px-3 py-1"
                  : "showtime-like-button-white px-3 py-1"
              }
              style={{
                borderRadius: 0,
                borderLeftWidth: 1,
                borderRightWidth: 1,
              }}
              onClick={() => {
                setSortby("newest");
              }}
            >
              Newest
            </button>
            <button
              className={
                sortBy === "oldest"
                  ? "showtime-like-button-pink px-3 py-1"
                  : "showtime-like-button-white px-3 py-1"
              }
              style={{
                borderRadius: 0,
                borderLeftWidth: 1,
                borderRightWidth: 1,
              }}
              onClick={() => {
                setSortby("oldest");
              }}
            >
              Oldest
            </button>
            <button
              className={
                sortBy === "trending"
                  ? "showtime-like-button-pink px-3 py-1"
                  : "showtime-like-button-white px-3 py-1"
              }
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeftWidth: 1,
              }}
              onClick={() => {
                setSortby("trending");
              }}
            >
              Trending
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 mt-4 text-center">
        {isChanging ? (
          "Loading..."
        ) : (
          <div class="text-left">
            <TokenGridV4 items={collectionItems} />
          </div>
        )}
      </div>
    </Layout>
  );
}
