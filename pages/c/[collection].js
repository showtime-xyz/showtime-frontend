import { useState, useEffect } from "react";
import Head from "next/head";
import _, { set } from "lodash";
import Layout from "../../components/layout";
import TokenGrid from "../../components/TokenGrid";
import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";
import { useRouter } from "next/router";
import Select from "react-dropdown-select";

export async function getServerSideProps(context) {
  const { collection } = context.query;

  // Get collection items
  const res_collection_items = await fetch(
    `${process.env.BACKEND_URL}/v1/collection?collection=${collection}`
  );
  const data_collection_items = await res_collection_items.json();
  const collection_items = data_collection_items.data;

  // Get list of collections
  const res_collection_list = await fetch(
    `${process.env.BACKEND_URL}/v1/collection_list`
  );
  const data_collection_list = await res_collection_list.json();
  const collection_list = data_collection_list.data;

  return {
    props: {
      collection_items,
      collection_list,
      collection,
    }, // will be passed to the page component as props
  };
}

export default function Collection({
  collection_items,
  collection_list,
  collection,
}) {
  const router = useRouter();
  //const { collection } = router.query;
  const onChange = (values) => {
    router.push(`/c/${values[0]["value"]}`, undefined, {
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

  const collection_name =
    collection_list.filter((item) => item.value === collection).length > 0
      ? collection_list.filter((item) => item.value === collection)[0].name
      : null;

  return (
    <Layout key={collection}>
      <Head>
        <title>Collection | {collection_name}</title>
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">
          Discover Collections
        </div>
      </div>

      {collection_list && collection_list.length > 0 ? (
        <div className="mx-auto mt-10 mb-24" style={{ maxWidth: 240 }}>
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

      <TokenGrid
        columnCount={2}
        items={collection_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
    </Layout>
  );
}
