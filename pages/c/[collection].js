import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
//import TokenGridV3 from "../../components/TokenGridV3";
import TokenGridV4 from "../../components/TokenGridV4";
import { useRouter } from "next/router";
import Select from "react-dropdown-select";
import backend from "../../lib/backend";
import ShareButton from "../../components/ShareButton";
import AppContext from "../../context/app-context";
import mixpanel from "mixpanel-browser";

export async function getServerSideProps(context) {
  const { collection } = context.query;

  // Get list of collections
  const response_collection_list = await backend.get(`/v1/collection_list`);
  const collection_list = response_collection_list.data.data;

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
  const [pageTitle, setPageTitle] = useState(
    `${selected_collection ? selected_collection.name : collection} Collection`
  );

  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Collection page view", { collection: collection });
    }
  }, [typeof context.user]);

  const getCollectionItems = async (collection_name) => {
    const response_collection_items = await backend.get(
      `/v2/collection?limit=200&collection=${collection_name}`
    );
    setCollectionItems(response_collection_items.data.data);
    setIsChanging(false);
  };

  const router = useRouter();
  const [isChanging, setIsChanging] = useState(true);
  //const { collection } = router.query;

  const onChange = async (values) => {
    setIsChanging(true);

    mixpanel.track("Collection dropdown select");
    router.push("/c/[collection]", `/c/${values[0]["value"]}`, {
      shallow: true,
    });
    setPageTitle(`${values[0]["name"]} Collection`);
    await getCollectionItems(values[0]["value"]);
    mixpanel.track("Collection page view", { collection: values[0]["value"] });
  };

  const [collectionItems, setCollectionItems] = useState([]);

  useEffect(() => {
    getCollectionItems(collection);
  }, [collection]);

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
        {selected_collection ? (
          <meta property="og:image" content={selected_collection.img_url} />
        ) : null}
        <meta name="og:title" content={pageTitle} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:description"
          content="Discover and showcase digital art"
        />
        {selected_collection ? (
          <meta name="twitter:image" content={selected_collection.img_url} />
        ) : null}
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mt-5 py-10">
          Featured Collections
        </div>
      </div>

      {collection_list && collection_list.length > 0 ? (
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
      ) : null}
      <p className="mb-6 mt-4 text-center">
        {isChanging ? "Loading..." : "\u00A0"}
      </p>
      <TokenGridV4 items={collectionItems} />
    </Layout>
  );
}
