import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
// import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import mixpanel from "mixpanel-browser";
import Layout from "../../components/layout";
import backend from "../../lib/backend";
import TokenGridV4 from "../../components/TokenGridV4";
import AppContext from "../../context/app-context";
import ModalReportItem from "../../components/ModalReportItem";
import TokenDetailBody from "../../components/TokenDetailBody";

export async function getServerSideProps(context) {
  const { token: token_array } = context.query;
  const contract_address = token_array[0];
  const token_id = token_array[1];

  const response_token = await backend.get(
    `/v2/token/${contract_address}/${token_id}?limit=150`
  );
  const token = response_token.data.data.item;
  const same_creator_items = response_token.data.data.same_creator;
  const same_owner_items = response_token.data.data.same_owner;

  return {
    props: {
      token,
      same_creator_items,
      same_owner_items,
    }, // will be passed to the page component as props
  };
}

export default function Token({ token, same_owner_items, same_creator_items }) {
  const context = useContext(AppContext);
  const { isMobile, gridWidth } = context;
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("NFT page view");
    }
  }, [typeof context.user]);

  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    if (context.user && token.owner_address) {
      if (token.owner_address === context.user.publicAddress) {
        setIsMyProfile(true);
      } else {
        setIsMyProfile(false);
      }
    } else {
      setIsMyProfile(false);
    }
  }, [same_owner_items, context.user]);

  // Set up my likes
  const [item, setItem] = useState(token);

  const [ownershipDetails, setOwnershipDetails] = useState();

  useEffect(() => {
    setItem(token);
    setOwnershipDetails(null);
    const getOwnershipDetails = async (nftId) => {
      const detailsData = await backend.get(`/v1/nft_detail/${nftId}`);
      const {
        data: { data: details },
      } = detailsData;
      setOwnershipDetails(details);
    };
    if (item) {
      getOwnershipDetails(item.nft_id);
    }
    return () => setOwnershipDetails(null);
  }, [token]);

  const [ownedItems, setOwnedItems] = useState([]);

  useEffect(() => {
    setOwnedItems(same_owner_items.filter((c) => c.nft_id !== item.nft_id));
  }, [same_owner_items]);

  const [createdItems, setCreatedItems] = useState([]);

  useEffect(() => {
    setCreatedItems(same_creator_items.filter((c) => c.nft_id !== item.nft_id));
  }, [same_creator_items]);

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, " ");
  }

  const handleLike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes([...context.myLikes, nft_id]);

    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]: ((myLikeCounts && myLikeCounts[nft_id]) || item.like_count) + 1,
    });

    // Post changes to the API
    await fetch(`/api/like_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };

  const handleUnlike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === nft_id)));

    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]: ((myLikeCounts && myLikeCounts[nft_id]) || item.like_count) - 1,
    });

    // Post changes to the API
    await fetch(`/api/unlike_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <Layout key={item.nft_id}>
      <Head>
        <title>{item.token_name}</title>
        {item.token_img_original_url ? (
          <link rel="prefetch" href={item.token_img_original_url} as="image" />
        ) : null}

        <meta name="description" content={item.token_description} />
        <meta property="og:type" content="website" />
        <meta name="og:description" content={item.token_description} />
        <meta
          property="og:image"
          content={
            item.token_img_preview_url ? item.token_img_preview_url : null
          }
        />
        <meta name="og:title" content={item.token_name} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={item.token_name} />
        <meta name="twitter:description" content={item.token_description} />
        <meta
          name="twitter:image"
          content={
            item.token_img_preview_url ? item.token_img_preview_url : null
          }
        />
      </Head>

      {typeof document !== "undefined" ? (
        <>
          <ModalReportItem
            isOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
            nftId={item.nft_id}
          />
        </>
      ) : null}

      {gridWidth && (
        <div>
          <div className="flex flex-col w-full relative bg-white">
            <TokenDetailBody
              item={item}
              muted={false}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              className="w-full"
              ownershipDetails={ownershipDetails}
            />
          </div>
          {createdItems.length === 0 ? null : (
            <>
              <div className="flex flex-col text-center w-full">
                <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mb-4 py-10">
                  More from this creator
                </div>
              </div>
              <div className="text-center">
                {createdItems.length === 0
                  ? `We couldn't find any more items created by ${
                      isMyProfile ? "you" : "this person"
                    }.`
                  : null}
              </div>
              {gridWidth && (
                <div className="m-auto" style={{ width: gridWidth }}>
                  <TokenGridV4 items={createdItems} />
                </div>
              )}
            </>
          )}
          {item.multiple_owners ? null : ownedItems.length ===
            0 ? null : createdItems.length > 0 ? null : (
            <>
              <div className="flex flex-col text-center w-full mt-8">
                <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mb-4 py-10">
                  More from this owner
                </div>
              </div>
              <div className="text-center">
                {ownedItems.length === 0
                  ? `We couldn't find any more items owned by ${
                      isMyProfile ? "you" : "this person"
                    }.`
                  : null}
              </div>
              {gridWidth && (
                <div className="m-auto" style={{ width: gridWidth }}>
                  <TokenGridV4 items={ownedItems} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="mb-16"></div>
    </Layout>
  );
}
