import React, { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { Link as SmoothScroll } from "react-scroll";
import ModalReportItem from "./ModalReportItem";
import ReactPlayer from "react-player";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentButton from "./CommentButton";
//import CloseButton from "./CloseButton";
import AppContext from "../context/app-context";
import CreatorSummary from "./CreatorSummary";
import { removeTags, truncateWithEllipses } from "../lib/utilities";
import UserTimestampCard from "./UserTimestampCard";
import TokenHistoryCard from "./TokenHistoryCard";
import CommentsSection from "./CommentsSection";

// how tall the media will be
const TOKEN_MEDIA_HEIGHT = 500;

const TokenDetailBody = ({
  item,
  muted,
  handleLike,
  handleUnlike,
  setEditModalOpen,
  ownershipDetails,
  isInModal,
}) => {
  const context = useContext(AppContext);
  const { isMobile, columns, gridWidth } = context;

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
      img_url = img_url.split("=")[0] + "=w375";
    }
    return img_url;
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Set dimensions of the media based on available space and original aspect ratio
  const targetRef = useRef();
  const modalRef = useRef();
  const [mediaHeight, setMediaHeight] = useState(null);
  const [mediaWidth, setMediaWidth] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    var aspectRatio = 1;

    // Try to use current image's aspect ratio
    if (item.imageRef && item.imageRef.current) {
      if (item.imageRef.current.clientHeight) {
        aspectRatio =
          item.imageRef.current.clientWidth /
          item.imageRef.current.clientHeight;
      }
    }
    // Set full height
    var mWidth = 0;

    if (isMobile) {
      mWidth = modalRef.current.clientWidth;
      setMediaWidth(mWidth);
      setMediaHeight(mWidth / aspectRatio);
    } else {
      setMediaHeight(TOKEN_MEDIA_HEIGHT);
      setMediaWidth(TOKEN_MEDIA_HEIGHT * aspectRatio);
    }
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
      <div
        className="flex flex-col"
        ref={modalRef}
        style={{ position: "relative", marginTop: -1 }}
      >
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
              <div
                className="w-max p"
                style={{
                  position: "absolute",
                  top: isMobile ? 57 : 0,
                  right: 0,
                  margin: 10,
                  zIndex: 1,
                }}
              >
                {isMobile ||
                item.token_has_video ? null : item.token_img_url ? (
                  <button
                    style={{
                      borderRadius: 7,
                      padding: 12,
                    }}
                    type="button"
                    onClick={() => {
                      setLightboxOpen(true);
                      mixpanel.track("Original size clicked");
                    }}
                    className="flex flex-row items-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                  >
                    <div className="">
                      <FontAwesomeIcon icon={faExpand} width={18} height={18} />
                    </div>
                    <div className="ml-2" style={{ fontSize: 14 }}>
                      Original size
                    </div>
                  </button>
                ) : null}
                <div></div>
              </div>
              <img
                src={getImageUrl()}
                alt={item.token_name}
                style={_.merge(
                  fullResLoaded === true ? { display: "none" } : null,
                  context.isMobile
                    ? {
                        width: mediaWidth,
                      }
                    : {
                        height: TOKEN_MEDIA_HEIGHT,
                      }
                )}
              />

              <img
                src={item.token_img_url}
                alt={item.token_name}
                style={_.merge(
                  fullResLoaded ? null : { display: "none" },
                  context.isMobile
                    ? {
                        width: mediaWidth,
                      }
                    : {
                        height: TOKEN_MEDIA_HEIGHT,
                      }
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
            width: isInModal ? "100%" : gridWidth,
            margin: "auto",
          }}
        >
          {/* Title and description section */}
          <div className="flex flex-col md:flex-row pb-10 items-stretch w-full max-w-full">
            <div
              className="pb-0 text-left flex-1 p-4"
              style={{
                overflowWrap: "break-word",
                wordWrap: "break-word",
                ...(isMobile ? {} : { maxWidth: "50%" }),
              }}
            >
              <div className="text-2xl md:text-4xl">{item.token_name}</div>
              {/* Likes & Share */}
              {/*  */}
              <div className="flex items-center pt-2">
                <div className="mr-2 text-base px-4 py-2 rounded-full shadow-md">
                  <LikeButton
                    item={item}
                    handleLike={handleLike}
                    handleUnlike={handleUnlike}
                  />
                </div>
                <SmoothScroll
                  to="CommentsSectionScroll"
                  containerId={isInModal ? "ModalTokenDetailWrapper" : null}
                  smooth={true}
                  offset={isInModal ? 210 : -70}
                  duration={500}
                >
                  <div className="mr-2 text-base px-4 py-2 rounded-full shadow-md">
                    <CommentButton item={item} handleComment={() => {}} />
                  </div>
                </SmoothScroll>
                <a
                  href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`}
                  title="Buy on OpenSea"
                  target="_blank"
                  onClick={() => {
                    mixpanel.track("OpenSea link click");
                  }}
                >
                  <div className="text-base font-normal px-4 py-3 mr-2 rounded-full shadow-md hover:text-stpink">
                    {context.columns > 2 ? "Bid on OpenSea" : "Bid"}
                  </div>
                </a>
                <div className="px-4 py-2 rounded-full shadow-md">
                  <ShareButton
                    url={
                      typeof window !== "undefined" &&
                      window.location.protocol +
                        "//" +
                        window.location.hostname +
                        (window.location.port
                          ? ":" + window.location.port
                          : "") +
                        `/t/${item.contract_address}/${item.token_id}`
                    }
                    type={"item"}
                  />
                </div>
              </div>
            </div>
            <div
              className="flex-1 p-4 pb-0"
              style={isMobile ? {} : { maxWidth: "50%" }}
            >
              {item.token_description && (
                <>
                  <div className="md:text-lg py-2">Description</div>
                  <div
                    className={`${
                      context.isMobile ? null : "text-base"
                    } text-gray-500`}
                    style={
                      context.isMobile
                        ? {
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            fontSize: 14,
                          }
                        : {
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                          }
                    }
                  >
                    {removeTags(item.token_description)}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* separator */}
          <hr />
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
                      username={item.creator_username}
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
                      <Link
                        href="/[profile]"
                        as={
                          item.owner_username
                            ? `/${item.owner_username}`
                            : `/${item.owner_address}`
                        }
                      >
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
                            timestamp={ownershipDetails.token_last_transferred}
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
                {/* History Section */}
                {/*  */}
                {/* {ownershipDetails.transfers &&
                  ownershipDetails.transfers.length > 0 && (
                    <div className="mt-8">
                      <div className="md:text-lg py-2">History</div>
                      <TokenHistoryCard
                        history={[
                          ...(ownershipDetails &&
                            ownershipDetails.transfers.map((transfer) => ({
                              address: transfer.to_address,
                              name: transfer.to_name
                                ? transfer.to_name
                                : "Unnamed",
                              timestamp: transfer.timestamp,
                            }))),
                          // {
                          //   address: item.creator_address,
                          //   name: item.creator_name,
                          //   timestamp: item.token_created,
                          // },
                        ]}
                      />
                    </div>
                  )} */}

                {/* Comments section */}
                <div className="mt-4 flex">
                  <CommentsSection
                    nftId={item.nft_id}
                    commentCount={item.comment_count}
                    closeModal={() => {
                      if (setEditModalOpen) {
                        setEditModalOpen(false);
                      }
                    }}
                    modalRef={modalRef}
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
          {/* <div style={{ width: 160 }} className="mt-12">
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
          </div> */}

          <div className="m-4 flex text-sm">
            <a
              href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`}
              title="Buy on OpenSea"
              target="_blank"
              onClick={() => {
                mixpanel.track("OpenSea link click");
              }}
              className="mr-4 text-gray-500 hover:text-stpink"
            >
              <div>View on OpenSea</div>
            </a>
            <div className="mr-4">·</div>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setReportModalOpen(true);
              }}
              className="text-gray-500 hover:text-stpink"
            >
              Report Item
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenDetailBody;
