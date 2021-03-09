import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
import TokenGridV4 from "../../components/TokenGridV4";
import { useRouter } from "next/router";
import Select from "react-dropdown-select";
import backend from "../../lib/backend";
//import ShareButton from "../../components/ShareButton";
import AppContext from "../../context/app-context";
import mixpanel from "mixpanel-browser";
import { GridTabs, GridTab } from "../../components/GridTabs";

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

  return {
    props: {
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
  const context = useContext(AppContext);
  const { isMobile, gridWidth, columns } = context;
  const [sortBy, setSortby] = useState("random");

  const [pageTitle, setPageTitle] = useState(
    selected_collection
      ? selected_collection.name === "Filter by collection"
        ? "Explore"
        : `Explore ${selected_collection.name}`
      : `Explore ${collection}`
  );

  const router = useRouter();

  const [isChanging, setIsChanging] = useState(true);

  useEffect(() => {
    setCurrentCollectionSlug(router.query.collection);
    if (router.query.collection == "all") {
      setPageTitle("Explore");
      setCurrentCollectionSlug("all");
    }
  }, [router.query.collection]);

  const onChange = async (values) => {
    mixpanel.track("Collection filter dropdown select", {
      collection: values[0]["value"],
    });
    router.push("/c/[collection]", `/c/${values[0]["value"]}`, {
      shallow: true,
    });
    setPageTitle(
      values[0]["name"] === "Filter by collection"
        ? "Explore"
        : `Explore ${values[0]["name"]}`
    );
    setCurrentCollectionSlug(values[0]["value"]);
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
        `/v2/collection?limit=150&order_by=${sortBy}&collection=${collection_name}`
      );

      mixpanel.track("Explore page view", {
        collection: collection_name,
        sortby: sortBy,
      });

      if (sortBy == "random" && collection_name == "all") {
        // Resetting the cache for random items - for next load
        backend.get(
          `/v2/collection?limit=150&recache=1&order_by=${sortBy}&collection=${collection_name}`
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

  const FilterTabs = (
    <GridTabs>
      <GridTab
        label="Random"
        isActive={sortBy === "random"}
        onClickTab={() => {
          if (sortBy === "random") {
            // Rerun the random tab
            setRandomNumber(Math.random());
            mixpanel.track("Random button re-clicked");
          } else {
            setSortby("random");
            mixpanel.track("Random button clicked");
          }
        }}
      />
      <GridTab
        label={!isMobile ? "Last Sold" : "Sold"}
        isActive={sortBy === "sold"}
        onClickTab={() => {
          setSortby("sold");
          mixpanel.track("Recently sold button clicked");
        }}
      />
      <GridTab
        label="Newest"
        isActive={sortBy === "newest"}
        onClickTab={() => {
          setSortby("newest");
          mixpanel.track("Newest button clicked");
        }}
      />
      {!isMobile && (
        <GridTab
          label="Oldest"
          isActive={sortBy === "oldest"}
          onClickTab={() => {
            setSortby("oldest");
            mixpanel.track("Oldest button clicked");
          }}
        />
      )}
      <GridTab
        label="Trending"
        isActive={sortBy === "trending"}
        onClickTab={() => {
          setSortby("trending");
          mixpanel.track("Trending button clicked");
        }}
      />
    </GridTabs>
  );

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

      {gridWidth > 0 ? (
        <div
          className="mx-auto mb-6 text-xs sm:text-sm flex flex-col md:flex-row items-center"
          style={{
            width: gridWidth,
          }}
        >
          {collection_list && collection_list.length > 0 ? (
            <div className="flex flex-row items-center">
              <div
                className="text-left"
                style={
                  context.columns === 1
                    ? { width: 250, marginLeft: 16, marginRight: 16 }
                    : { width: 250, marginLeft: 12, marginRight: 12 }
                }
              >
                <Select
                  options={collection_list}
                  labelField="name"
                  valueField="value"
                  values={collection_list.filter(
                    (item) => item.value === currentCollectionSlug
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
        </div>
      ) : null}

      {columns && (
        <div
          className="mx-auto"
          style={columns === 1 ? null : { width: columns * (375 + 20) }}
        >
          {FilterTabs}
        </div>
      )}
      {gridWidth && (
        <div className="m-auto" style={{ width: gridWidth }}>
          <TokenGridV4 items={collectionItems} isLoading={isChanging} />
        </div>
      )}
    </Layout>
  );
}
