import { useState, useEffect } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
//import TokenGrid from "../../components/TokenGrid";

import TokenGrid2 from "../../components/TokenGrid2";

import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";
//import useOwned from "../../hooks/useOwned";
import backend from "../../lib/backend";
import Link from "next/link";
import { useRouter } from "next/router";

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
    `/v1/owned?address=${slug}&limit=9&use_cached=1`
  );
  const owned_items = response_owned.data.data;

  // Get liked items
  const response_liked = await backend.get(`/v1/liked?address=${slug}&limit=9`);
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

const Profile = ({
  name,
  img_url,
  wallet_addresses,
  owned_items,
  liked_items,
  slug,
}) => {
  const { user } = useAuth();
  const [ownedItems, setOwnedItems] = useState([]);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);

  useEffect(() => {
    setOwnedItems(owned_items);
    setOwnedRefreshed(false);
  }, [owned_items]);

  /*
  useEffect(() => {
    const refreshOwned = async () => {
      const response_owned = await backend.get(
        `/v1/owned?address=${slug}&limit=9`
      );
      if (response_owned.data.data !== owned_items) {
        setOwnedItems(response_owned.data.data);
      }

      setOwnedRefreshed(true);
    };
    refreshOwned();
  }, [owned_items]);*/

  return (
    <Layout>
      <Head>
        <title>Profile | {name ? name : "[Unnamed]"}</title>
      </Head>
      <div className="mx-auto flex pt-20 pb-10 flex-col items-center">
        <img
          alt="artist"
          className="showtime-avatar object-cover object-center "
          src={
            img_url
              ? img_url
              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
          }
        />
        <div className="text-3xl mt-4">{name ? name : wallet_addresses[0]}</div>
      </div>
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Owned Items</div>
      </div>
      <div>{ownedRefreshed ? "Refreshed" : "Not fresh"}</div>

      <div>
        owned_items:{" "}
        {owned_items.map((item) => (
          <div key={item.token_id}>
            {item.token_id}
            <br />
          </div>
        ))}
        <br />
        <br />
        <br />
      </div>
      <div>
        ownedItems:{" "}
        {ownedItems.map((item) => (
          <div key={item.token_id}>
            {item.token_id}
            <br />
          </div>
        ))}
        <br />
        <br />
        <br />
      </div>

      <Link href="/p/[slug]" as="/p/0xfa6E0aDDF68267b8b6fF2dA55Ce01a53Fad6D8e2">
        0xfa6E0aDDF68267b8b6fF2dA55Ce01a53Fad6D8e2
      </Link>
      <br />
      <Link href="/p/[slug]" as="/p/0x9D23d6DA969460bD6374e7dBd6E6c5CdA032F017">
        0x9D23d6DA969460bD6374e7dBd6E6c5CdA032F017
      </Link>
      <br />
      <Link href="/p/[slug]" as="/p/0xF6522d1cb83Be982a5d9BF2612d427Da216f960c">
        0xF6522d1cb83Be982a5d9BF2612d427Da216f960c
      </Link>
      <br />
      <br />
      <TokenGrid2
        columnCount={2}
        items={ownedItems}
        myLikes={[]}
        setMyLikes={() => {}}
      />
    </Layout>
  );
};

export default Profile;
