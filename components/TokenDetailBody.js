import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import ModalReportItem from "./ModalReportItem";
import ReactPlayer from "react-player";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";

const TokenDetailBody = ({
  item,
  muted,
  handleLike,
  handleUnlike,
  showTooltip,
  setEditModalOpen,
}) => {
  const getBackgroundColor = (item) => {
    if (
      item.token_background_color &&
      item.token_background_color.length === 6
    ) {
      return `#${item.token_background_color}`;
    } else {
      return null;
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
  const [mediaHeight, setMediaHeight] = useState(0);
  const [mediaWidth, setMediaWidth] = useState(0);
  const [metadataWidth, setMetadataWidth] = useState(0);

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
    var mediaWidth = 0;
    if (
      aspectRatio * targetRef.current.clientHeight <
      modalRef.current.clientWidth * (2 / 3)
    ) {
      mediaWidth = aspectRatio * targetRef.current.clientHeight;
      setMediaHeight(targetRef.current.clientHeight - 1);
      setMediaWidth(mediaWidth);
    } else {
      mediaWidth = modalRef.current.clientWidth * (2 / 3);
      setMediaWidth(mediaWidth);
      setMediaHeight((modalRef.current.clientWidth * (2 / 3)) / aspectRatio);
    }

    const metadata = modalRef.current.clientWidth - mediaWidth;
    setMetadataWidth(metadata);
  }, [targetRef, item]);
  //console.log(mediaWidth);

  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalReportItem
            isOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
            tid={item.tid}
          />
        </>
      ) : null}
      <div className="flex h-full" ref={modalRef}>
        <div
          className="h-full flex items-center"
          style={
            item.token_has_video
              ? {
                  flexShrink: 0,
                  backgroundColor: "black",
                }
              : {
                  flexShrink: 0,
                  backgroundColor: "black",
                  borderBottomLeftRadius: 7,
                  borderTopLeftRadius: 7,
                }
          }
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
            />
          ) : (
            <div
              style={{
                borderBottomLeftRadius: 7,
                borderTopLeftRadius: 7,
              }}
            >
              <img
                src={getImageUrl()}
                alt={item.token_name}
                style={
                  setEditModalOpen &&
                  targetRef.current &&
                  mediaHeight === targetRef.current.clientHeight - 1
                    ? {
                        width: mediaWidth,
                        height: mediaHeight,
                        borderBottomLeftRadius: 7,
                        borderTopLeftRadius: 7,
                      }
                    : {
                        width: mediaWidth,
                        height: mediaHeight,
                      }
                }
              />
            </div>
          )}
        </div>
        <div
          className="pr-8 pl-8 pt-4 "
          style={{ width: metadataWidth, overflow: "auto" }}
        >
          <div
            className="text-3xl border-b-2 pb-2 text-left mb-4"
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
              className="mb-10 "
              style={{
                color: "#333",
                overflowWrap: "break-word",
                wordWrap: "break-word",
              }}
            >
              {item.token_description}
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

          <div className="flex flex-row">
            {item.creator_address ? (
              <div
                className="flex-1"
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgb(136, 136, 136)",
                }}
              >
                Created by
                <div className="flex flex-row  mt-1">
                  <div className="flex-shrink">
                    <Link href="/p/[slug]" as={`/p/${item.creator_address}`}>
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
                          {item.creator_name}
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
                    <Link href="/p/[slug]" as={`/p/${item.owner_address}`}>
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
                        <div style={{ fontWeight: 400 }}>{item.owner_name}</div>
                      </a>
                    </Link>
                  </div>
                  <div className="flex-grow"></div>
                </div>
              </div>
            ) : null}
          </div>

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
