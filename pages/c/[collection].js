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
import CappedWidth from "../../components/CappedWidth";

export async function getServerSideProps(context) {
  const { collection } = context.query;

  // Get list of collections
  const response_collection_list = await backend.get(`/v1/collection_list`);
  const collection_list = [
    {
      name: "All leading collections",
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
  const { isMobile } = context;
  const [sortBy, setSortby] = useState("random");

  const [pageTitle, setPageTitle] = useState(
    selected_collection
      ? selected_collection.name === "All leading collections"
        ? "Discover"
        : `Discover ${selected_collection.name}`
      : `Discover ${collection}`
  );

  const router = useRouter();

  const [isChanging, setIsChanging] = useState(true);

  useEffect(() => {
    setCurrentCollectionSlug(router.query.collection);
    if (router.query.collection == "all") {
      setPageTitle("Discover");
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
      values[0]["name"] === "All leading collections"
        ? "Discover"
        : `Discover ${values[0]["name"]}`
    );
    setCurrentCollectionSlug(values[0]["value"]);
    setCurrentCollectionName(
      values[0]["name"] === "All leading collections" ? null : values[0]["name"]
    );
  };

  const [collectionItems, setCollectionItems] = useState([]);
  const [currentCollectionSlug, setCurrentCollectionSlug] = useState(
    collection
  );
  const [currentCollectionName, setCurrentCollectionName] = useState(
    selected_collection
      ? selected_collection.name === "All leading collections"
        ? null
        : selected_collection.name
      : collection
      ? collection.replace(/-/g, " ")
      : collection
  );
  const [randomNumber, setRandomNumber] = useState(1);

  useEffect(() => {
    let isSubscribed = true;

    const getCollectionItems = async (collection_name) => {
      setIsChanging(true);
      const response_collection_items = await backend.get(
        `/v2/collection?limit=150&order_by=${sortBy}&collection=${collection_name}`
      );

      mixpanel.track("Discover page view", {
        collection: collection_name,
        sortby: sortBy,
      });

      if (sortBy == "random") {
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

        <meta name="description" content="Discover and showcase crypto art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase crypto art"
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

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Showtime | ${pageTitle}`} />
        <meta
          name="twitter:description"
          content="Discover and showcase crypto art"
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

      <div className="py-12 sm:py-14 px-8 sm:px-10 text-left  bg-gradient-to-r from-green-400 to-blue-400">
        <CappedWidth>
          <div className="flex flex-row mx-3 text-white">
            <div className="flex-1">
              <div className="text-xl sm:text-2xl">Discover</div>
              <div
                className="text-3xl sm:text-6xl"
                style={{ fontFamily: "Afronaut", textTransform: "capitalize" }}
              >
                {currentCollectionName ? currentCollectionName : "Leading NFT"}
              </div>
              <div className="text-3xl sm:text-6xl">
                {currentCollectionName ? "Collection." : "Collections."}
              </div>
            </div>
          </div>
        </CappedWidth>
      </div>
      <CappedWidth>
        <div className="flex-1 -mt-4 mx-3 lg:w-2/3 lg:pr-6 xl:w-1/2">
          <div className="bg-white rounded-lg shadow-md px-6 py-6 text-center flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-3 md:mb-0">
              Select a collection to browse:{" "}
            </div>
            <div className="flex-1 text-left">
              <Select
                options={collection_list}
                labelField="name"
                valueField="value"
                values={
                  collection_list
                    .map((item) => item.value)
                    .includes(currentCollectionSlug)
                    ? collection_list.filter(
                        (item) => item.value === currentCollectionSlug
                      )
                    : [
                        {
                          value: "all",
                          name: "All leading collections",
                        },
                      ]
                }
                searchable={false}
                onChange={(values) => onChange(values)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto relative mt-12">{FilterTabs}</div>

        <div className="m-auto relative min-h-screen">
          <TokenGridV4
            items={collectionItems}
            isLoading={isChanging}
            extraColumn
            key={`grid_${currentCollectionSlug}_${sortBy}_${randomNumber}_${isChanging}`}
          />
        </div>
      </CappedWidth>
    </Layout>
  );
}
