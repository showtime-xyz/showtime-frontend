import { useState, useEffect } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
import TokenGrid from "../../components/TokenGrid";
import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";
import { useRouter } from "next/router";
import Select from "react-dropdown-select";
import backend from "../../lib/backend";

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
    `/v1/collection?collection=${collection}&limit=40&order_by=${selected_collection.order_by}&order_direction=${selected_collection.order_direction}`
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
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  //const { collection } = router.query;
  const onChange = (values) => {
    setIsChanging(true);
    router.push("/c/[collection]", `/c/${values[0]["value"]}`, {
      shallow: false,
    });
  };

  const { user } = useAuth();

  // Set up my likes
  const [myLikes, setMyLikes] = useState([]);
  const [myLikesLoaded, setMyLikesLoaded] = useState(false);
  const { data: like_data } = useMyLikes(user, myLikesLoaded);
  useEffect(() => {
    if (like_data) {
      setMyLikesLoaded(true);
      setMyLikes(like_data.data);
    }
  }, [like_data]);

  useEffect(() => {
    if (collection_items) {
      setIsChanging(false);
    }
  }, [collection_items]);

  return (
    <Layout key={collection}>
      <Head>
        <title>Collection | {selected_collection.name}</title>
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">
          Discover Collections
        </div>
      </div>

      {collection_list && collection_list.length > 0 ? (
        <div className="mx-auto mt-10" style={{ maxWidth: 240 }}>
          <Select
            options={collection_list}
            labelField="name"
            valueField="value"
            values={collection_list.filter((item) => item.value === collection)}
            searchable={false}
            onChange={(values) => onChange(values)}
          />
        </div>
      ) : null}
      <p class="mb-12 mt-6 text-center">
        {isChanging ? "Loading..." : "\u00A0"}
      </p>
      <TokenGrid
        columnCount={2}
        items={collection_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
    </Layout>
  );
}
