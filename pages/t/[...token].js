import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
import backend from "../../lib/backend";
import Link from "next/link";
import TokenGridV2 from "../../components/TokenGridV2";
import TokenGrid from "../../components/TokenGrid";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import AppContext from "../../context/app-context";
import mixpanel from "mixpanel-browser";

export async function getServerSideProps(context) {
  const { token: token_array } = context.query;
  const contract_address = token_array[0];
  const token_id = token_array[1];

  const response_token = await backend.get(
    `/v2/token/${contract_address}/${token_id}`
  );
  const token = response_token.data.data.item;
  const same_creator_items = response_token.data.data.same_creator;
  const same_owner_items = response_token.data.data.same_owner;

  /*
  // Get owned items
  let same_owner_items = [];
  if (token.owner && token.owner.address) {
    const response_owned = await backend.get(
      `/v1/owned?address=${token.owner.address}&use_cached=1`
    );
    same_owner_items = response_owned.data.data.filter(
      (item) =>
        !(
          item.token_id === token_id &&
          item.asset_contract.address === contract_address
        )
    );
  }*/

  return {
    props: {
      token,
      same_creator_items,
      same_owner_items,
    }, // will be passed to the page component as props
  };
}

export default function Token({ token, same_owner_items, same_creator_items }) {
  //const [isChanging, setIsChanging] = useState(false);
  //const { collection } = router.query;

  const context = useContext(AppContext);
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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Set up my likes
  const [item, setItem] = useState(token);

  useEffect(() => {
    setItem(token);
  }, [token]);

  const [ownedItems, setOwnedItems] = useState([]);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);

  useEffect(() => {
    setOwnedItems(same_owner_items.filter((c) => c.tid !== item.tid));
    setOwnedRefreshed(false);
  }, [same_owner_items]);

  const [createdItems, setCreatedItems] = useState([]);
  const [createdRefreshed, setCreatedRefreshed] = useState(false);

  useEffect(() => {
    setCreatedItems(same_creator_items.filter((c) => c.tid !== item.tid));
    setCreatedRefreshed(false);
  }, [same_creator_items]);

  /*
  useEffect(() => {
    const refreshOwned = async () => {
      if (
        token.owner_address !== "0x0000000000000000000000000000000000000000"
      ) {
        const response_owned = await backend.get(
          `/v1/owned?address=${token.owner_address}`
        );
        if (response_owned.data.data !== same_owner_items) {
          setOwnedItems(
            response_owned.data.data.filter(
              (item) =>
                !(
                  item.token_id === token.token_id &&
                  item.asset_contract.address === token.contract_address
                )
            )
          );
        }
      }

      setOwnedRefreshed(true);
    };
    if (token.owner_address) {
      refreshOwned();
    }
  }, [same_owner_items, token]);
  */

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
    <Layout key={item.tid}>
      <Head>
        <title>{item.token_name}</title>
        {item.token_img_original_url ? (
          <link rel="prefetch" href={item.token_img_original_url} as="image" />
        ) : null}

        <meta name="description" content={item.token_description} />
        <meta property="og:type" content="website" />
        <meta name="og:description" content={item.token_description} />
        <meta property="og:image" content={item.token_img_url} />
        <meta name="og:title" content={item.token_name} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={item.token_name} />
        <meta name="twitter:description" content={item.token_description} />
        <meta name="twitter:image" content={item.token_img_url} />
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mt-5 py-10">
          {item.token_name}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          mainSrc={
            item.token_img_original_url
              ? item.token_img_original_url
              : item.token_img_url
          }
          //nextSrc={images[(photoIndex + 1) % images.length]}
          //prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          //enableZoom={false}
          /*
          onMovePrevRequest={() =>
            this.setState({
              photoIndex: (photoIndex + images.length - 1) % images.length,
            })
          }
          onMoveNextRequest={() =>
            this.setState({
              photoIndex: (photoIndex + 1) % images.length,
            })
          }*/
        />
      )}

      <div className="flex flex-col lg:flex-row mt-8 xl:w-3/4 xl:mx-auto">
        <div className="flex lg:w-1/2 lg:pr-4 ">
          <div className="w-full" style={{ position: "relative" }}>
            {item.token_has_video ? null : (
              <button
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 10,
                  margin: 10,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: 7,
                }}
                type="button"
                onClick={() => {
                  setLightboxOpen(true);
                  mixpanel.track("Original size clicked");
                }}
                onMouseOver={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}
                className="flex flex-row"
              >
                <img
                  style={
                    isHovering
                      ? { opacity: 1, width: 20 }
                      : { opacity: 0.7, width: 20 }
                  }
                  src={"/icons/expand-white.svg"}
                  alt="expand"
                  className="flex"
                />
                <div
                  className="flex ml-2"
                  style={
                    isHovering
                      ? { opacity: 1, fontSize: 14, color: "white" }
                      : { opacity: 0.7, fontSize: 14, color: "white" }
                  }
                >
                  Original size
                </div>
              </button>
            )}
            <TokenGridV2
              hasHero
              isDetail
              columnCount={1}
              items={[item]}
              isMobile={isMobile}
            />
          </div>
        </div>
        <div className="flex lg:w-1/2 lg:pl-4 lg:text-left">
          <div className="w-full">
            <div className="showtime-token-description">
              {item.token_description}
            </div>
            <br />
            <br />
            {item.creator_id ? (
              <>
                <span style={{ fontWeight: 400 }}>{"Created by "}</span>

                <Link href="/p/[slug]" as={`/p/${item.creator_address}`}>
                  <a className="showtime-link">{item.creator_name}</a>
                </Link>
              </>
            ) : (
              "\u00A0"
            )}
            <br />
            <span style={{ fontWeight: 400 }}>
              {"Owned by "}

              {item.multiple_owners ? (
                "multiple owners"
              ) : item.owner_id ? (
                <Link href="/p/[slug]" as={`/p/${item.owner_address}`}>
                  <a className="showtime-link" style={{ fontWeight: 600 }}>
                    {item.owner_name}
                  </a>
                </Link>
              ) : null}
            </span>
            <br />
            <br />
            <br />
            {/*<a
              href={`https://opensea.io/assets/${item.asset_contract.address}/${item.token_id}`}
              target="_blank"
              className="showtime-white-button-icon"
            >
              <span>View on OpenSea</span>
              <img
                style={{ paddingLeft: 6, width: 20, height: 20 }}
                src={"/icons/external-link-alt-solid.svg"}
                alt="external"
              />
            </a>*/}
            <div style={{ width: 160 }}>
              <a
                href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}`}
                title="Buy on OpenSea"
                target="_blank"
                onClick={() => {
                  mixpanel.track("OpenSea link click");
                }}
              >
                <img
                  style={{
                    width: 160,
                    borderRadius: 7,
                    boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
                  }}
                  src="https://storage.googleapis.com/opensea-static/opensea-brand/listed-button-white.png"
                  alt="Listed on OpenSea badge"
                  className={isMobile ? "mx-auto" : "mr-auto"}
                />
              </a>
            </div>
            <br />
            <br />
          </div>
        </div>
      </div>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mb-4 py-10">
          More from this creator
        </div>
      </div>
      <div className="text-center">
        {/*ownedRefreshed
          ? ownedItems.length === 0
            ? `We couldn't find any more items owned by ${
                isMyProfile ? "you" : "this person"
              }.`
            : null
          : ownedItems.length === 0
          ? "Loading..."
            : null*/}
        {createdItems.length === 0
          ? `We couldn't find any more items created by ${
              isMyProfile ? "you" : "this person"
            }.`
          : null}
      </div>
      <TokenGridV2
        columnCount={columns}
        items={createdItems}
        isMobile={isMobile}
      />
      {item.multiple_owners ? null : (
        <>
          <div className="flex flex-col text-center w-full mt-8">
            <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mb-4 py-10">
              More from this owner
            </div>
          </div>
          <div className="text-center">
            {/*ownedRefreshed
          ? ownedItems.length === 0
            ? `We couldn't find any more items owned by ${
                isMyProfile ? "you" : "this person"
              }.`
            : null
          : ownedItems.length === 0
          ? "Loading..."
            : null*/}
            {ownedItems.length === 0
              ? `We couldn't find any more items owned by ${
                  isMyProfile ? "you" : "this person"
                }.`
              : null}
          </div>
          <TokenGridV2
            columnCount={columns}
            items={ownedItems}
            isMobile={isMobile}
          />
        </>
      )}
      <div className="mb-16"></div>
    </Layout>
  );
}
