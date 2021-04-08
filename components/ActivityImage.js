import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactPlayer from "react-player";

export default function ActivityImage({
  nft,
  index,
  numberOfImages,
  openModal,
  spacingIndex,
}) {
  const aRef = useRef();
  const [imgWidth, setImgWidth] = useState(null);
  useEffect(() => {
    setImgWidth(aRef?.current?.clientWidth);
  }, [aRef?.current?.clientWidth]);

  return (
    <div
      className={`flex-1 cursor-pointer overflow-hidden hover:opacity-90 ${
        spacingIndex !== numberOfImages - 1 ? "mr-1" : ""
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
      }}
    >
      {nft.token_img_url && (
        <img src={nft.token_img_url} className="object-cover w-full h-full" />
      )}
      {nft.token_has_video && !nft.token_img_url && (
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
