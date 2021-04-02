import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/layout";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import ActivityFeed from "../components/ActivityFeed";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Activity = () => {
  const context = useContext(AppContext);
  const { columns, gridWidth } = context;
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Leaderboard page view");
    }
  }, [typeof context.user]);

  const ACTIVITY_FEED = [
    // multiple buy
    {
      type: "BUY",
      id: 234,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      seller: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "seller",
        name: "Seller Person",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      nfts: [
        {
          id: 1,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
        {
          id: 3,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
        {
          id: 2,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // one buy
    {
      type: "BUY",
      id: 9865,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      seller: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "seller",
        name: "Seller Person",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      nfts: [
        {
          id: 1,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // one creation
    {
      type: "CREATE",
      id: 1203,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },

      nfts: [
        {
          id: 1,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // two creations
    {
      type: "CREATE",
      id: 887,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },

      nfts: [
        {
          id: 1,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
        {
          id: 2,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // one sale
    {
      type: "SELL",
      id: 5252,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      buyer: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "buyer",
        name: "Buyer Person",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      nfts: [
        {
          id: 1,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // three sales
    {
      type: "SELL",
      id: 234,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      buyer: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "buyer",
        name: "Buyer Person",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      nfts: [
        {
          id: 1,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
        {
          id: 2,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
        {
          id: 3,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // one like
    {
      type: "LIKE",
      id: 1,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      nfts: [
        {
          id: 1,
          title: "CrpytoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/MlhWuUVejA3dpoNqrfwJbPkFF6azVVvtiTRG2WhIQzi7RtCs6Ih56iRbLc-RfZr1fjIKG29a7Zgb-1ratEj2oRLnBv_EqEC3vM6bew=w375",
        },
      ],
    },
    // 3 likes
    {
      type: "LIKE",
      id: 4934,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
        username: "Alex",
        name: "Alex Kilkka",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/51_1612510386.jpg",
      },
      nfts: [
        {
          id: 1,
          title: "CrpytoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/MlhWuUVejA3dpoNqrfwJbPkFF6azVVvtiTRG2WhIQzi7RtCs6Ih56iRbLc-RfZr1fjIKG29a7Zgb-1ratEj2oRLnBv_EqEC3vM6bew=w375",
        },
        {
          id: 2,
          title: "CrpytoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/MlhWuUVejA3dpoNqrfwJbPkFF6azVVvtiTRG2WhIQzi7RtCs6Ih56iRbLc-RfZr1fjIKG29a7Zgb-1ratEj2oRLnBv_EqEC3vM6bew=w375",
        },
        {
          id: 3,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // 4 likes
    {
      type: "LIKE",
      id: 5645,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
        username: "Alex",
        name: "Alex Kilkka",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/51_1612510386.jpg",
      },
      nfts: [
        {
          id: 1,
          title: "CrpytoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/MlhWuUVejA3dpoNqrfwJbPkFF6azVVvtiTRG2WhIQzi7RtCs6Ih56iRbLc-RfZr1fjIKG29a7Zgb-1ratEj2oRLnBv_EqEC3vM6bew=w375",
        },
        {
          id: 2,
          title: "CrpytoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/MlhWuUVejA3dpoNqrfwJbPkFF6azVVvtiTRG2WhIQzi7RtCs6Ih56iRbLc-RfZr1fjIKG29a7Zgb-1ratEj2oRLnBv_EqEC3vM6bew=w375",
        },
        {
          id: 3,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
        {
          id: 4,
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // one comment
    {
      type: "COMMENT",
      id: 3,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      nfts: [
        {
          id: 1,
          comment: "Love this cyptopunk, I need it!",
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
    // multiple comment
    {
      type: "COMMENT",
      id: 53211,
      timestamp: "2021-02-14T14:14:41",
      actor: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      nfts: [
        {
          id: 1,
          comment: "Love this cyptopunk, I need it!",
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
        {
          id: 2,
          comment: "Love this cyptopunk, I need it!",
          title: "CryptoPunk #4301",
          token_id: "1234",
          contract_address: "0x658a0253da9bf18bea77c0c85bc4280829ad98c4",
          nft_img_url:
            "https://lh3.googleusercontent.com/3n5UwqFOUwRWc7SzQwrNj11mBSeCFnaHaGT0bW3B19uUd9f2vJJgGqLoqeukbjg_eK9XsZNGKuIawdUjfWZ9jHu9jtIOKK6eKWV4LVI=w375",
        },
      ],
    },
  ];

  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getActivity = async () => {
      setIsLoading(true);
      // const result = await backend.get(
      //   `/v1/leaderboard?days=${leaderboardDays}`
      // );
      // const data = result?.data?.data;
      setActivity(ACTIVITY_FEED);
      setIsLoading(false);

      // Reset cache for next load
      // backend.get(`/v1/activity?days=${leaderboardDays}&recache=1`);
    };
    getActivity();
  }, []);
  return (
    <Layout>
      <Head>
        <title>Activity</title>
        <meta name="description" content="Trending creators" />
        <meta property="og:type" content="website" />
        <meta name="og:description" content="Trending creators" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_og_card.jpg"
        />
        <meta name="og:title" content="Showtime | Leaderboard" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Showtime | Leaderboard" />
        <meta name="twitter:description" content="Trending creators" />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_twitter_card2.jpg"
        />
      </Head>

      {gridWidth && (
        <>
          <div
            className="m-auto relative"
            style={{
              ...(columns === 1 ? null : { width: gridWidth, paddingLeft: 16 }),
            }}
          >
            <div
              className="mx-auto relative mt-16 mb-4 md:mt-24 text-center md:text-left"
              style={{
                ...(columns === 1
                  ? { padding: "0px 16px" }
                  : { width: gridWidth }),
              }}
            >
              <h1 className="text-xl md:text-3xl xl:text-4xl">Activity</h1>
            </div>
            {/* Page Content */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-4">
              {/* Left Column */}
              <div className="flex flex-col md:col-span-2">
                <div className="border-t border-b h-2 bg-gray-100 border-gray-200" />

                <ActivityFeed activity={[...activity]} />
              </div>
              {/* Right Column */}
              <div className="flex flex-col md:col-span-2">
                <div className="p-6 h-max bg-gray-100 rounded-lg sticky top-0">
                  <div className="text-xl">Recommended Follows</div>
                  <div className="bg-gray-200 p-4 rounded-lg">
                    [Recommended follows comp here]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Activity;
