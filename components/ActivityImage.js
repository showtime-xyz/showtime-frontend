import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ActivityImage({ nft, index, numberOfImages }) {
  const aRef = useRef();
  const [imgWidth, setImgWidth] = useState(null);

  useEffect(() => {
    setImgWidth(aRef?.current?.clientWidth);
  }, [aRef?.current?.clientWidth]);

  return (
    <Link href={`/t/${nft.contract_address}/${nft.token_id}`}>
      <a
        className={`flex-1 overflow-hidden ${
          index !== numberOfImages - 1 ? "mr-1" : ""
        }`}
        ref={aRef}
        style={{
          height: imgWidth,
          backgroundColor: `#${nft.token_background_color}`,
        }}
      >
        <img src={nft.token_img_url} className="object-cover w-full h-full" />
      </a>
    </Link>
  );
}
