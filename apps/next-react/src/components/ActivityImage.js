import { useState, useEffect, useRef, useContext } from "react";
import ReactPlayer from "react-player";
import mixpanel from "mixpanel-browser";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import AppContext from "@/context/app-context";
import OrbitIcon from "./Icons/OrbitIcon";

export default function ActivityImage({
  nft,
  index,
  numberOfImages,
  openModal,
  spacingIndex,
  bottomRow,
  roundAllCorners,
  totalNumberOfImages,
  cardWidth,
}) {
  useEffect(() => {
    if (
      !nft?.mime_type?.startsWith("model") ||
      window.customElements.get("model-viewer")
    )
      return;
    import("@google/model-viewer");
  }, [nft?.mime_type]);

  const aRef = useRef();
  const { isMobile } = useContext(AppContext);
  const [imgWidth, setImgWidth] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    setImgWidth(aRef?.current?.clientWidth);
  }, [aRef?.current?.clientWidth]);

  useEffect(() => {
    setImgWidth(aRef?.current?.clientWidth);
  }, []);

  useEffect(() => {
    if (imgWidth > cardWidth && window.innerWidth > cardWidth) {
      return setImgWidth(cardWidth);
    } else if (imgWidth > window.innerWidth && cardWidth > window.innerWidth) {
      return setImgWidth(window.innerWidth);
    }
  }, [cardWidth, imgWidth]);

  const getImageUrl = (img_url, token_aspect_ratio) => {
    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      if (token_aspect_ratio && token_aspect_ratio > 1) {
        img_url = img_url.split("=")[0] + "=h660";
      } else {
        img_url = img_url.split("=")[0] + "=w660";
      }
    }
    return img_url;
  };

  const getImageUrlLarge = (img_url, token_aspect_ratio) => {
    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      if (token_aspect_ratio && token_aspect_ratio > 1)
        img_url = img_url.split("=")[0] + "=h1328";
      else img_url = img_url.split("=")[0] + "=w1328";
    }

    return img_url;
  };

  // Automatically load models that have no preview image. We don't account for video here because currently token_animation_url is a glb file.
  useEffect(() => {
    if (!nft || !nft.mime_type?.startsWith("model")) return;
    if (nft.token_img_url || nft.token_img_original_url) return;

    setShowModel(true);
  }, [nft]);

  return (
    <div
      className={`flex-1 relative cursor-pointer overflow-hidden hover:opacity-90 transition-all ${
        spacingIndex !== numberOfImages - 1 ? "mr-1" : ""
      }
				${bottomRow && spacingIndex === 0 ? "sm:rounded-bl-lg" : null}
				${bottomRow && spacingIndex === 1 ? "sm:rounded-br-lg" : null}
				${roundAllCorners && index === 0 ? "sm:rounded-tl-lg" : null}
				${
          roundAllCorners &&
          ((index === 0 &&
            (totalNumberOfImages === 1 || totalNumberOfImages === 3)) ||
            (index === 1 &&
              (totalNumberOfImages === 2 || totalNumberOfImages === 4)))
            ? "sm:rounded-tr-lg"
            : null
        }
				${
          roundAllCorners && totalNumberOfImages === 1
            ? "sm:rounded-bl-lg sm:rounded-br-lg"
            : null
        }`}
      ref={aRef}
      style={{
        height: imgWidth,
        backgroundColor: nft.token_background_color
          ? `#${nft.token_background_color}`
          : "black",
      }}
      onClick={() => {
        openModal(index);
        mixpanel.track("Activity - Click on NFT image, open modal");
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {nft.mime_type && (
        <>
          {nft.mime_type?.startsWith("model") && showModel && (
            <model-viewer
              src={nft.source_url}
              class="object-cover w-full h-full"
              autoplay
              camera-controls
              auto-rotate
              ar
              ar-modes="scene-viewer quick-look"
              interaction-prompt="none"
              onClick={(event) => event.stopPropagation()}
            />
          )}
          {nft.mime_type?.startsWith("model") && !showModel && (
            <img
              src={
                numberOfImages === 1
                  ? getImageUrlLarge(
                      nft.still_preview_url
                        ? nft.still_preview_url
                        : nft.token_img_url,
                      nft.token_aspect_ratio
                    )
                  : getImageUrl(
                      nft.still_preview_url
                        ? nft.still_preview_url
                        : nft.token_img_url,
                      nft.token_aspect_ratio
                    )
              }
              className="object-cover w-full h-full"
            />
          )}
          {nft.mime_type?.startsWith("image") && (
            <img
              src={
                numberOfImages === 1
                  ? getImageUrlLarge(
                      nft.still_preview_url
                        ? nft.still_preview_url
                        : nft.token_img_url,
                      nft.token_aspect_ratio
                    )
                  : getImageUrl(
                      nft.still_preview_url
                        ? nft.still_preview_url
                        : nft.token_img_url,
                      nft.token_aspect_ratio
                    )
              }
              className="object-cover w-full h-full"
            />
          )}
          {nft.mime_type?.startsWith("video") && (
            <ReactPlayer
              url={
                nft.animation_preview_url
                  ? nft.animation_preview_url
                  : nft?.source_url
                  ? nft?.source_url
                  : nft?.token_animation_url
              }
              playing={true}
              loop
              muted={true}
              width={
                imgWidth > window.innerWidth
                  ? window.innerWidth
                  : imgWidth > cardWidth
                  ? cardWidth
                  : imgWidth
              }
              height={imgWidth}
              style={{
                maxWidth:
                  imgWidth > window.innerWidth
                    ? window.innerWidth
                    : imgWidth > cardWidth
                    ? cardWidth
                    : imgWidth,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              playsinline
              // Disable downloading & right click
              config={{
                file: {
                  attributes: {
                    onContextMenu: (e) => e.preventDefault(),
                    controlsList: "nodownload",
                    style:
                      numberOfImages > 1
                        ? { objectFit: "cover", width: "100%", height: "100%" }
                        : { width: "100%", height: "100%" },
                  },
                },
              }}
            />
          )}
        </>
      )}

      {!nft.mime_type && (
        <>
          {nft.token_img_url &&
            !(
              (nft.token_has_video && !nft.mime_type?.startsWith("model")) ||
              (nft.token_animation_url && !nft.token_img_url)
            ) && (
              <img
                src={
                  numberOfImages === 1
                    ? getImageUrlLarge(
                        nft.token_img_url,
                        nft.token_aspect_ratio
                      )
                    : getImageUrl(nft.token_img_url, nft.token_aspect_ratio)
                }
                className="object-cover w-full h-full"
              />
            )}

          {!nft.mime_type?.startsWith("model") &&
            (nft.token_has_video ||
              (nft.token_animation_url && !nft.token_img_url) ||
              nft.animation_preview_url ||
              nft.mime_type?.startsWith("video")) && (
              <ReactPlayer
                url={
                  nft.animation_preview_url
                    ? nft.animation_preview_url
                    : nft?.source_url
                    ? nft?.source_url
                    : nft?.token_animation_url
                }
                playing={true}
                loop
                muted={true}
                width={
                  imgWidth > window.innerWidth
                    ? window.innerWidth
                    : imgWidth > cardWidth
                    ? cardWidth
                    : imgWidth
                }
                height={imgWidth}
                style={{
                  maxWidth:
                    imgWidth > window.innerWidth
                      ? window.innerWidth
                      : imgWidth > cardWidth
                      ? cardWidth
                      : imgWidth,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                playsinline
                // Disable downloading & right click
                config={{
                  file: {
                    attributes: {
                      onContextMenu: (e) => e.preventDefault(),
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            )}
        </>
      )}

      {totalNumberOfImages > 1 && !isMobile && (
        <div
          className={`absolute flex bottom-1 right-0 py-1 px-2 bg-white dark:bg-black bg-opacity-95 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg backdrop-saturate-150 shadow-md rounded-xl transform scale-90 ${
            isHovering
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 translate-y-1"
          } transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          <LikeButton item={nft} />
          <div className="w-3" />
          <CommentButton
            item={nft}
            handleComment={() => {
              mixpanel.track("Open NFT modal via hover comment button");
              openModal(index);
            }}
          />
        </div>
      )}
      {nft.mime_type?.startsWith("model") && (
        <div
          className={`p-2.5 ${
            showModel ? "" : "opacity-80 hover:opacity-100 cursor-pointer"
          } absolute top-1 right-1`}
          onClick={(event) => {
            event.stopPropagation();
            if (showModel) return;
            mixpanel.track("Load 3d model from feed");
            setShowModel(true);
          }}
        >
          <div className="flex items-center space-x-1 text-white rounded-full py-1 px-2 -my-1 -mx-1 bg-black bg-opacity-40">
            <OrbitIcon className="w-4 h-4" />
            <span className="font-semibold">3D</span>
          </div>
        </div>
      )}
    </div>
  );
}
