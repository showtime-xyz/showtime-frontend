import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
import backend from "../../lib/backend";
import Link from "next/link";
import TokenGrid from "../../components/TokenGrid";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import AppContext from "../../context/app-context";

export async function getServerSideProps(context) {
  const { token: token_array } = context.query;
  const contract_address = token_array[0];
  const token_id = token_array[1];

  const response_token = await backend.get(
    `/v1/token/${contract_address}/${token_id}`
  );
  const token = response_token.data.data;

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
  }

  return {
    props: {
      token,
      same_owner_items,
    }, // will be passed to the page component as props
  };
}

export default function Token({ token, same_owner_items }) {
  //const [isChanging, setIsChanging] = useState(false);
  //const { collection } = router.query;

  const context = useContext(AppContext);

  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    if (context.user && token.owner && token.owner.address) {
      if (token.owner.address === context.user.publicAddress) {
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
    setOwnedItems(same_owner_items);
    setOwnedRefreshed(false);
  }, [same_owner_items]);

  useEffect(() => {
    const refreshOwned = async () => {
      if (
        token.owner.address !== "0x0000000000000000000000000000000000000000"
      ) {
        const response_owned = await backend.get(
          `/v1/owned?address=${token.owner.address}`
        );
        if (response_owned.data.data !== same_owner_items) {
          setOwnedItems(
            response_owned.data.data.filter(
              (item) =>
                !(
                  item.token_id === token.token_id &&
                  item.asset_contract.address === token.asset_contract.address
                )
            )
          );
        }
      }

      setOwnedRefreshed(true);
    };
    if (token.owner && token.owner.address) {
      refreshOwned();
    }
  }, [same_owner_items, token]);

  const [columns, setColumns] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 500) {
      setColumns(1);
      setIsMobile(true);
    } else if (context.windowSize && context.windowSize.width < 1400) {
      setColumns(2);
      setIsMobile(false);
    } else {
      setColumns(3);
      setIsMobile(false);
    }
  }, [context.windowSize]);

  return (
    <Layout key={item.asset_contract.address + "_" + item.token_id}>
      <Head>
        <title>{item.name}</title>
        {item.image_original_url ? (
          <link rel="prefetch" href={item.image_original_url} as="image" />
        ) : null}

        <meta name="description" content={item.description} />
        <meta property="og:type" content="website" />
        <meta name="og:description" content={item.description} />
        <meta property="og:image" content={item.image_url} />
        <meta name="og:title" content={item.name} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={item.name} />
        <meta name="twitter:description" content={item.description} />
        <meta name="twitter:image" content={item.image_url} />
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-6xl">
          {item.name}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          mainSrc={
            item.image_original_url ? item.image_original_url : item.image_url
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

      <div className="flex flex-col md:flex-row mt-8">
        <div className="flex md:w-1/2 md:pr-4">
          <div className="w-full" style={{ position: "relative" }}>
            {item.animation_url &&
            item.animation_url.includes(".mp4") ? null : (
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
                onClick={() => setLightboxOpen(true)}
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
                      ? { opacity: 1, fontSize: 14 }
                      : { opacity: 0.7, fontSize: 14 }
                  }
                >
                  Original size
                </div>
              </button>
            )}
            <TokenGrid
              hasHero
              isDetail
              columnCount={1}
              items={[item]}
              isMobile={isMobile}
            />
          </div>
        </div>
        <div className="flex text-center md:w-1/2  md:pl-4 md:text-left">
          <div className="w-full">
            <div className="showtime-token-description">{item.description}</div>
            <br />
            <br />
            {item.creator ? (
              <>
                <span style={{ fontWeight: 400 }}>{"Created by "}</span>

                <Link href="/p/[slug]" as={`/p/${item.creator.address}`}>
                  <a className="showtime-link">
                    {item.creator.user && item.creator.user.username
                      ? item.creator.user.username
                      : "Unnamed"}
                  </a>
                </Link>
              </>
            ) : (
              "\u00A0"
            )}
            <br />
            <span style={{ fontWeight: 400 }}>
              {"Owned by "}
              {item.owner ? (
                item.owner.user &&
                item.owner.user.username === "NullAddress" ? (
                  "multiple owners"
                ) : (
                  <Link href="/p/[slug]" as={`/p/${item.owner.address}`}>
                    <a className="showtime-link" style={{ fontWeight: 600 }}>
                      {item.owner.user ? item.owner.user.username : "Unnamed"}
                    </a>
                  </Link>
                )
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
            <a
              href={`https://opensea.io/assets/${item.asset_contract.address}/${item.token_id}`}
              title="Buy on OpenSea"
              target="_blank"
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
            <br />
            <br />
          </div>
        </div>
      </div>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-6xl">
          More from this owner
        </div>
      </div>
      <div className="text-center">
        {ownedRefreshed
          ? ownedItems.length === 0
            ? `We couldn't find any more items owned by ${
                isMyProfile ? "you" : "this person"
              }.`
            : null
          : ownedItems.length === 0
          ? "Loading..."
          : null}
      </div>
      <TokenGrid columnCount={columns} items={ownedItems} isMobile={isMobile} />
    </Layout>
  );
}
