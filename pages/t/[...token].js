import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Link from "next/link";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../components/layout";
import backend from "../../lib/backend";
import TokenGridV3 from "../../components/TokenGridV3";
import TokenGridV4 from "../../components/TokenGridV4";
import AppContext from "../../context/app-context";
import ModalReportItem from "../../components/ModalReportItem";

export async function getServerSideProps(context) {
  const { token: token_array } = context.query;
  const contract_address = token_array[0];
  const token_id = token_array[1];

  const response_token = await backend.get(
    `/v2/token/${contract_address}/${token_id}?limit=180`
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

  useEffect(() => {
    setOwnedItems(same_owner_items.filter((c) => c.tid !== item.tid));
  }, [same_owner_items]);

  const [createdItems, setCreatedItems] = useState([]);

  useEffect(() => {
    setCreatedItems(same_creator_items.filter((c) => c.tid !== item.tid));
  }, [same_creator_items]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 800) {
      setIsMobile(true);
    } else if (context.windowSize && context.windowSize.width < 1400) {
      setIsMobile(false);
    } else if (context.windowSize && context.windowSize.width < 1800) {
      setIsMobile(false);
    } else {
      setIsMobile(false);
    }
  }, [context.windowSize]);

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, " ");
  }

  const [reportModalOpen, setReportModalOpen] = useState(false);

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
            tid={item.tid}
          />
        </>
      ) : null}

      <div className="flex flex-col text-center w-full">
        <div
          className="showtime-title text-center mx-auto w-full text-3xl md:text-5xl mt-5 py-10"
          style={{
            overflowWrap: "break-word",
            wordWrap: "break-word",
          }}
        >
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

      <div className="flex flex-col lg:flex-row mt-6 lg:w-2/3 mx-auto">
        <div className="flex lg:w-1/2 lg:pr-4 ">
          <div className="w-full" style={{ position: "relative" }}>
            {item.token_has_video ? null : item.token_img_url ? (
              <button
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 10,
                  margin: 10,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: 7,
                  color: "white",
                }}
                type="button"
                onClick={() => {
                  setLightboxOpen(true);
                  mixpanel.track("Original size clicked");
                }}
                onMouseOver={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}
                className="flex flex-row items-center"
              >
                <div className="flex">
                  <FontAwesomeIcon
                    style={
                      isHovering
                        ? { opacity: 1, height: 22 }
                        : { opacity: 0.7, height: 22 }
                    }
                    icon={faExpand}
                  />
                </div>
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
            ) : null}
            <div style={item.token_img_url ? null : { marginTop: -24 }}>
              <TokenGridV3 isDetail items={[item]} />
            </div>
          </div>
        </div>
        <div className="flex lg:w-1/2 p-4 lg:text-left ">
          <div
            className="w-full"
            style={{
              overflowWrap: "break-word",
              wordWrap: "break-word",
            }}
          >
            {item.token_description ? (
              <>
                <div className="showtime-token-description">
                  {removeTags(item.token_description)}
                </div>
                <br />
                <br />
              </>
            ) : null}
            {item.creator_id ? (
              <>
                <span style={{ fontWeight: 400 }}>{"Created by "}</span>

                <Link href="/p/[slug]" as={`/p/${item.creator_address}`}>
                  <a className="showtime-link" style={{ fontWeight: 600 }}>
                    {item.creator_name}
                  </a>
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
            <div style={{ width: 160 }}>
              <a
                href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`}
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

            <div
              className="text-xs"
              style={{ color: "#666", fontWeight: 400, cursor: "pointer" }}
              onClick={() => {
                setReportModalOpen(true);
              }}
            >
              Report item
            </div>
          </div>
        </div>
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
          <TokenGridV4 items={createdItems} />
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
          <TokenGridV4 items={ownedItems} />
        </>
      )}
      <div className="mb-16"></div>
    </Layout>
  );
}
