import React, { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import _ from "lodash";
import ModalReportItem from "./ModalReportItem";
import ReactPlayer from "react-player";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CloseButton from "./CloseButton";
import AppContext from "../context/app-context";
import CreatorSummary from "./CreatorSummary";
import { removeTags, truncateWithEllipses } from "../lib/utilities";
import UserTimestampCard from "./UserTimestampCard";
import TokenHistoryCard from "./TokenHistoryCard";

// how wide the media will be
const TOKEN_MEDIA_WIDTH = 500;

const TokenDetailBody = ({
  item,
  muted,
  handleLike,
  handleUnlike,
  showTooltip,
  setEditModalOpen,
  ownershipDetails,
  columns,
}) => {
  const context = useContext(AppContext);
  const { isMobile } = context;
  console.log(ownershipDetails);
  console.log(item);

  const getBackgroundColor = () => {
    if (
      item.token_background_color &&
      item.token_background_color.length === 6
    ) {
      return `#${item.token_background_color}`;
    } else {
      return "black";
    }
  };
  const getImageUrl = () => {
    var img_url = item.token_img_url ? item.token_img_url : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=s375";
    }
    return img_url;
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Set dimensions of the media based on available space and original aspect ratio
  const targetRef = useRef();
  const modalRef = useRef();
  const [mediaHeight, setMediaHeight] = useState(null);
  const [mediaWidth, setMediaWidth] = useState(null);
  const [metadataWidth, setMetadataWidth] = useState(null);

  useEffect(() => {
    var aspectRatio = 1;
    var hasImageDimensions = false;

    // Try to use current image's aspect ratio
    if (item.imageRef.current) {
      if (item.imageRef.current.clientHeight) {
        aspectRatio =
          item.imageRef.current.clientWidth /
          item.imageRef.current.clientHeight;

        hasImageDimensions = true;
      }
    }
    // Set full height
    var mWidth = 0;

    if (isMobile) {
      mWidth = modalRef.current.clientWidth;
      setMediaWidth(mWidth);
      setMediaHeight(mWidth / aspectRatio);
    } else {
      setMediaWidth(TOKEN_MEDIA_WIDTH);
      setMediaHeight(TOKEN_MEDIA_WIDTH / aspectRatio);
    }

    const metadata = modalRef.current.clientWidth - mWidth;
    setMetadataWidth(metadata);
  }, [targetRef, item, context.windowSize, isMobile]);

  const [fullResLoaded, setFullResLoaded] = useState(null);
  useEffect(() => {
    setFullResLoaded(false);
  }, [item]);

  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalReportItem
            isOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
            nftId={item.nft_id}
          />
        </>
      ) : null}
      <div
        className="flex flex-col"
        ref={modalRef}
        style={{ position: "relative" }}
      >
        {setEditModalOpen && columns !== 1 ? (
          <CloseButton setEditModalOpen={setEditModalOpen} isDetailModal />
        ) : null}

        {columns === 1 ? (
          <div className="p-4 flex flex-row">
            <div className="flex-shrink">
              {item.creator_address ? (
                <Link
                  href="/[profile]"
                  as={`/${item?.creator_username || item.creator_address}`}
                >
                  <a className="flex flex-row items-center ">
                    <div>
                      <img
                        alt={item.creator_name}
                        src={
                          item.creator_img_url
                            ? item.creator_img_url
                            : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                        }
                        className="rounded-full "
                        style={{ height: 24, width: 24 }}
                      />
                    </div>
                    <div className="showtime-card-profile-link ml-2">
                      {truncateWithEllipses(item.creator_name, 30)}
                    </div>
                  </a>
                </Link>
              ) : null}
            </div>
            <div>&nbsp;</div>
          </div>
        ) : null}
        <div
          className="flex items-center md:p-12"
          style={_.merge(
            { flexShrink: 0 },
            item.token_has_video
              ? {
                  backgroundColor: "black",
                }
              : {
                  backgroundColor: getBackgroundColor(),
                }
          )}
          ref={targetRef}
        >
          {item.token_has_video ? (
            <ReactPlayer
              url={item.token_animation_url}
              playing={true}
              loop
              controls
              muted={muted}
              height={mediaHeight}
              width={mediaWidth}
              style={{ margin: "auto" }}
              playsinline
            />
          ) : (
            <div
              style={{
                margin: "auto",
              }}
            >
              <img
                src={getImageUrl()}
                alt={item.token_name}
                style={_.merge(
                  {
                    width: mediaWidth,
                    height: mediaHeight,
                  },
                  fullResLoaded === true ? { display: "none" } : null
                )}
              />

              <img
                src={item.token_img_url}
                alt={item.token_name}
                style={_.merge(
                  {
                    width: mediaWidth,
                    height: mediaHeight,
                  },
                  fullResLoaded ? null : { display: "none" }
                )}
                onLoad={() => {
                  setFullResLoaded(true);
                }}
              />
            </div>
          )}
        </div>
        {/* Details wrapper */}
        <div
          className="p-2 md:p-8"
          style={{
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* Title and description section */}
          <div className="flex flex-col md:flex-row pb-10">
            <div
              className="text-2xl md:text-4xl pb-0 text-left flex-1 p-4"
              style={{
                fontWeight: 600,
                overflowWrap: "break-word",
                wordWrap: "break-word",
              }}
            >
              {item.token_name}
            </div>
            <div className="flex-1 p-4 pb-0">
              {item.token_description && (
                <>
                  <div className="md:text-lg py-2">Description</div>
                  <div
                    className="text-sm md:text-base text-gray-500"
                    style={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                    }}
                  >
                    {removeTags(item.token_description)}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* separator */}
          <hr />
          {/* Likes & Share */}
          {/* <div className="mb-12 flex flex-row">
            <div className="mr-2">
              <LikeButton
                item={item}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                showTooltip={showTooltip}
              />
            </div>
            <div>
              <ShareButton
                url={
                  window.location.protocol +
                  "//" +
                  window.location.hostname +
                  (window.location.port ? ":" + window.location.port : "") +
                  `/t/${item.contract_address}/${item.token_id}`
                }
                type={"item"}
              />
            </div>
          </div> */}
          {/*  */}
          {/* Artist and Owned by Section */}

          {ownershipDetails ? (
            <div className="flex flex-col md:flex-row mt-4">
              {/* artist section */}
              <div className="flex-1 p-4">
                {item.creator_address && (
                  <>
                    <div className="md:text-lg py-4">Creator</div>
                    <CreatorSummary
                      address={item.creator_address}
                      name={item.creator_name}
                      imageUrl={item.creator_img_url}
                      bio={ownershipDetails.creator_bio}
                      closeModal={() => {
                        if (setEditModalOpen) {
                          setEditModalOpen(false);
                        }
                      }}
                    />
                  </>
                )}
              </div>

              {/* owned by section */}
              <div className="flex-1 p-4">
                {item.owner_address && (
                  <div>
                    <div className="md:text-lg py-2">Owned By</div>
                    <div>
                      <Link href="/[profile]" as={`/${item.owner_address}`}>
                        <a
                          onClick={() => {
                            if (setEditModalOpen) {
                              setEditModalOpen(false);
                            }
                          }}
                        >
                          <UserTimestampCard
                            name={item.owner_name}
                            imageUrl={item.owner_img_url}
                            timestamp={
                              ownershipDetails.transfers.length > 0
                                ? ownershipDetails.transfers[0].timestamp
                                : item.token_created
                            }
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
                {/* History Section */}
                {/*  */}
                <div className="mt-8">
                  <div className="md:text-lg py-2">History</div>
                  <TokenHistoryCard
                    history={[
                      ...ownershipDetails.transfers.map((transfer) => ({
                        address: transfer.to_address,
                        name: transfer.to_name ? transfer.to_name : "Unnamed",
                        timestamp: transfer.timestamp,
                      })),
                      // {
                      //   address: item.creator_address,
                      //   name: item.creator_name,
                      //   timestamp: item.token_created,
                      // },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center mt-8">
              <div className="loading-card-spinner" />
            </div>
          )}

          {/* OpenSea Link */}
          <div style={{ width: 160 }} className="mt-12">
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
              />
            </a>
          </div>

          <div
            className="text-xs mt-4 mb-12"
            style={{
              color: "rgb(136, 136, 136)",
              fontWeight: 400,
              cursor: "pointer",
            }}
            onClick={() => {
              setReportModalOpen(true);
            }}
          >
            Report item
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenDetailBody;
