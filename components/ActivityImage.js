import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import mixpanel from "mixpanel-browser";

export default function ActivityImage({
  nft,
  index,
  numberOfImages,
  openModal,
  spacingIndex,
  bottomRow,
}) {
  const aRef = useRef();
  const [imgWidth, setImgWidth] = useState(null);
  useEffect(() => {
    setImgWidth(aRef?.current?.clientWidth);
  }, [aRef?.current?.clientWidth]);

  useEffect(() => {
    setImgWidth(aRef?.current?.clientWidth);
  }, []);

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
      if (token_aspect_ratio && token_aspect_ratio > 1) {
        img_url = img_url.split("=")[0] + "=h1328";
      } else {
        img_url = img_url.split("=")[0] + "=w1328";
      }
    }
    return img_url;
  };

  return (
    <div
      className={`flex-1  cursor-pointer overflow-hidden hover:opacity-90  transition-all ${
        spacingIndex !== numberOfImages - 1 ? "mr-1" : ""
      }
      
      ${bottomRow && spacingIndex === 0 ? "rounded-bl-lg" : null}
      ${bottomRow && spacingIndex === 1 ? "rounded-br-lg" : null}
      
      `}
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
    >
      {nft.token_img_url && !(nft.token_has_video && numberOfImages === 1) && (
        <img
          src={
            numberOfImages === 1
              ? getImageUrlLarge(nft.token_img_url, nft.token_aspect_ratio)
              : getImageUrl(nft.token_img_url, nft.token_aspect_ratio)
          }
          className="object-cover w-full h-full"
        />
      )}
      {nft.token_has_video && (!nft.token_img_url || numberOfImages === 1) && (
        <ReactPlayer
          url={nft?.token_animation_url}
          playing={true}
          loop
          muted={true}
          width={imgWidth}
          height={imgWidth}
          playsinline
        />
      )}
    </div>
  );
}
