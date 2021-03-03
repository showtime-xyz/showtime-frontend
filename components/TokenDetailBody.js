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

const TokenDetailBody = ({
  item,
  muted,
  handleLike,
  handleUnlike,
  showTooltip,
  setEditModalOpen,
  isStacked,
  columns,
}) => {
  const context = useContext(AppContext);

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

    if (isStacked) {
      mWidth = modalRef.current.clientWidth;
      setMediaWidth(mWidth);
      setMediaHeight(mWidth / aspectRatio);
    } else {
      if (
        aspectRatio * targetRef.current.clientHeight <
        modalRef.current.clientWidth * (2 / 3)
      ) {
        mWidth = aspectRatio * targetRef.current.clientHeight;
        setMediaHeight(targetRef.current.clientHeight);
        setMediaWidth(mWidth);
      } else {
        mWidth = modalRef.current.clientWidth * (2 / 3);
        setMediaWidth(mWidth);
        setMediaHeight((modalRef.current.clientWidth * (2 / 3)) / aspectRatio);
      }
    }

    const metadata = modalRef.current.clientWidth - mWidth;
    setMetadataWidth(metadata);
  }, [targetRef, item, isStacked, context.windowSize]);

  const [fullResLoaded, setFullResLoaded] = useState(null);
  useEffect(() => {
    setFullResLoaded(false);
  }, [item]);

  const removeTags = (str) => {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, " ");
  };

  const truncateWithEllipses = (text, max) => {
    return text.substr(0, max - 1) + (text.length > max ? "..." : "");
  };

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
        className="flex lg:h-full flex-col lg:flex-row "
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
                <Link href="/[profile]" as={`/${item.creator_address}`}>
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
          className="lg:h-full flex items-center"
          style={_.merge(
            { flexShrink: 0 },
            item.token_has_video
              ? {
                  backgroundColor: "black",
                }
              : {
                  backgroundColor: getBackgroundColor(),
                },
            setEditModalOpen
              ? isStacked
                ? null
                : { borderBottomLeftRadius: 7, borderTopLeftRadius: 7 }
              : null
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
              style={_.merge(
                setEditModalOpen
                  ? isStacked
                    ? null
                    : {
                        borderBottomLeftRadius: 7,
                        borderTopLeftRadius: 7,
                      }
                  : null,
                {
                  margin: "auto",
                }
              )}
            >
              <img
                src={getImageUrl()}
                alt={item.token_name}
                style={_.merge(
                  {
                    width: mediaWidth,
                    height: mediaHeight,
                  },
                  setEditModalOpen &&
                    targetRef.current &&
                    mediaHeight === targetRef.current.clientHeight
                    ? isStacked
                      ? null
                      : {
                          borderBottomLeftRadius: 7,
                          borderTopLeftRadius: 7,
                        }
                    : null,
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
                  setEditModalOpen &&
                    targetRef.current &&
                    mediaHeight === targetRef.current.clientHeight
                    ? isStacked
                      ? null
                      : {
                          borderBottomLeftRadius: 7,
                          borderTopLeftRadius: 7,
                        }
                    : null,
                  fullResLoaded ? null : { display: "none" }
                )}
                onLoad={() => {
                  setFullResLoaded(true);
                }}
              />
            </div>
          )}
        </div>
        <div
          className="px-4 md:pr-8 md:pl-8 pt-4 "
          style={_.merge(
            {
              overflow: "auto",
              position: "relative",
            },
            isStacked
              ? null
              : {
                  width: metadataWidth,
                }
          )}
        >
          <div
            className="text-2xl md:text-3xl border-b-2 pb-2 text-left mb-4"
            style={{
              fontWeight: 600,
              overflowWrap: "break-word",
              wordWrap: "break-word",
            }}
          >
            {item.token_name}
          </div>
          {item.token_description ? (
            <div
              className="mb-10 text-sm md:text-base"
              style={{
                color: "#333",
                overflowWrap: "break-word",
                wordWrap: "break-word",
              }}
            >
              {removeTags(item.token_description)}
            </div>
          ) : null}

          <div className="mb-12 flex flex-row">
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
          </div>

          <div className="flex flex-col 2xl:flex-row">
            {item.creator_address && columns !== 1 ? (
              <div
                className="flex-1 pb-2 2xl:pb-0"
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgb(136, 136, 136)",
                }}
              >
                Created by
                <div className="flex flex-row  mt-1">
                  <div className="flex-shrink">
                    <Link href="/[profile]" as={`/${item.creator_address}`}>
                      <a
                        className="flex flex-row items-center showtime-follower-button rounded-full"
                        onClick={() => {
                          if (setEditModalOpen) {
                            setEditModalOpen(false);
                          }
                        }}
                      >
                        <div>
                          <img
                            alt={item.creator_name}
                            src={
                              item.creator_img_url
                                ? item.creator_img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            className="rounded-full mr-1"
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <div style={{ fontWeight: 400 }}>
                          {truncateWithEllipses(item.creator_name, 26)}
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="flex-grow"></div>
                </div>
              </div>
            ) : null}

            {item.owner_address ? (
              <div
                className="flex-1"
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgb(136, 136, 136)",
                }}
              >
                Owned by
                <div className="flex flex-row  mt-1">
                  <div className="flex-shrink">
                    <Link href="/[profile]" as={`/${item.owner_address}`}>
                      <a
                        className="flex flex-row items-center showtime-follower-button rounded-full "
                        onClick={() => {
                          if (setEditModalOpen) {
                            setEditModalOpen(false);
                          }
                        }}
                      >
                        <div>
                          <img
                            alt={item.owner_name}
                            src={
                              item.owner_img_url
                                ? item.owner_img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            className="rounded-full mr-1"
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <div style={{ fontWeight: 400 }}>
                          {truncateWithEllipses(item.owner_name, 26)}
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="flex-grow"></div>
                </div>
              </div>
            ) : null}
          </div>

          {item.token_creator_followers_only ? (
            context.myFollows ? (
              context.myFollows
                .map((item) => item.wallet_address)
                .includes(item.creator_address) ? (
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
              ) : null
            ) : null
          ) : (
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
          )}

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
