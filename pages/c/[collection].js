import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
import TokenGridV2 from "../../components/TokenGridV2";
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
  const response_collection_items = await backend.get(
    `/v2/collection?collection=${collection}`
  );
  const collection_items = response_collection_items.data.data;

  return {
    props: {
      collection_items,
      collection_list,
      collection,
      selected_collection,
    }, // will be passed to the page component as props
  };
}

export default function Collection({
  collection_items,
  collection_list,
  collection,
  selected_collection,
}) {
  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Collection page view", { collection: collection });
    }
  }, [typeof context.user]);

  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  //const { collection } = router.query;
  const onChange = (values) => {
    setIsChanging(true);
    router.push("/c/[collection]", `/c/${values[0]["value"]}`, {
      shallow: false,
    });
    mixpanel.track("Collection dropdown select");
  };

  useEffect(() => {
    if (collection_items) {
      setIsChanging(false);
    }
  }, [collection_items]);

  const [columns, setColumns] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 800) {
      setColumns(1);
      setIsMobile(true);
    } else if (context.windowSize && context.windowSize.width < 1400) {
      setColumns(2);
      setIsMobile(false);
    } else if (context.windowSize && context.windowSize.width < 1800) {
      setColumns(3);
      setIsMobile(false);
    } else {
      setColumns(4);
      setIsMobile(false);
    }
  }, [context.windowSize]);

  return (
    <Layout key={collection}>
      <Head>
        <title>Collection | {selected_collection.name}</title>

        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase digital art"
        />
        {collection_items && collection_items.length > 0 ? (
          <meta
            property="og:image"
            content={collection_items[0].token_img_url}
          />
        ) : null}
        <meta
          name="og:title"
          content={`${selected_collection.name} Collection`}
        />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`${selected_collection.name} Collection`}
        />
        <meta
          name="twitter:description"
          content="Discover and showcase digital art"
        />
        {collection_items && collection_items.length > 0 ? (
          <meta
            name="twitter:image"
            content={collection_items[0].token_img_url}
          />
        ) : null}
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mt-5 py-10">
          Discover Collections
        </div>
      </div>

      {collection_list && collection_list.length > 0 ? (
        <div
          className="flex flex-row mx-auto mt-6 items-center"
          style={{ width: 260 }}
        >
          <div className="text-left" style={{ width: 230 }}>
            <Select
              options={collection_list}
              labelField="name"
              valueField="value"
              values={collection_list.filter(
                (item) => item.value === collection
              )}
              searchable={false}
              onChange={(values) => onChange(values)}
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
      <TokenGridV2
        columnCount={columns}
        items={collection_items}
        isMobile={isMobile}
      />
    </Layout>
  );
}
