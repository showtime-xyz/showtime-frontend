import { useState, useEffect } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
import TokenGrid from "../../components/TokenGrid";
import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";
import useOwned from "../../hooks/useOwned";
import backend from "../../lib/backend";

export async function getServerSideProps(context) {
  const { slug } = context.query;

  // Get profile metadata
  const response_profile = await backend.get(`/v1/profile?address=${slug}`);
  const data_profile = response_profile.data.data;

  const name = data_profile.name;
  const img_url = data_profile.img_url;
  const wallet_addresses = data_profile.wallet_addresses;

  // Get owned items
  const response_owned = await backend.get(
    `/v1/owned?address=${slug}&maxItemCount=9&useCached=1`
  );
  const owned_items = response_owned.data.data;

  // Get liked items
  const response_liked = await backend.get(
    `/v1/liked?address=${slug}&maxItemCount=9`
  );
  const liked_items = response_liked.data.data;

  return {
    props: {
      name,
      img_url,
      wallet_addresses,
      owned_items,
      liked_items,
      slug,
    }, // will be passed to the page component as props
  };
}

export default function Profile({
  name,
  img_url,
  wallet_addresses,
  owned_items,
  liked_items,
  slug,
}) {
  //const router = useRouter();
  //const { slug } = router.query;

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

  // Immediate try to refresh the owned items without the cache
  const [ownedItems, setOwnedItems] = useState(owned_items);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);
  const { data: owned_data } = useOwned(slug, ownedRefreshed);
  useEffect(() => {
    if (owned_data) {
      setOwnedRefreshed(true);
      setOwnedItems(owned_data.data);
    }
  }, [owned_data]);

  return (
    <Layout>
      <Head>
        <title>Profile | {name ? name : "[Unnamed]"}</title>
      </Head>
      <div className="mx-auto flex pt-20 pb-10 flex-col items-center">
        <img
          alt="artist"
          className="showtime-avatar object-cover object-center "
          src={img_url}
        />
        <div className="text-3xl mt-4">{name ? name : wallet_addresses[0]}</div>
      </div>
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Owned Items</div>
      </div>

      <TokenGrid
        hasHero
        columnCount={2}
        items={ownedItems}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
        allHeros={true}
      />
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Liked Items</div>
      </div>
      <TokenGrid
        columnCount={2}
        items={liked_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
    </Layout>
  );
}
