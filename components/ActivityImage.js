import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ActivityImage({
  nft,
  index,
  numberOfImages,
  openModal,
}) {
  const aRef = useRef();
  const [imgWidth, setImgWidth] = useState(null);

  useEffect(() => {
    setImgWidth(aRef?.current?.clientWidth);
  }, [aRef?.current?.clientWidth]);

  return (
    <div
      className={`flex-1 cursor-pointer overflow-hidden hover:opacity-90 ${
        index !== numberOfImages - 1 ? "mr-1" : ""
      }`}
      ref={aRef}
      style={{
        height: imgWidth,
        backgroundColor: `#${nft.token_background_color}`,
      }}
      onClick={() => {
        openModal(index);
      }}
    >
      <img src={nft.token_img_url} className="object-cover w-full h-full" />
    </div>
  );
}
