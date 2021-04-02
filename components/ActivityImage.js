import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ActivityImage({ nft, index, numberOfImages }) {
  const aRef = useRef();
  return (
    <Link href={`/t/${nft.contract_address}/${nft.token_id}`}>
      <a
        className={`flex-1 overflow-hidden ${
          index !== numberOfImages - 1 ? "mr-1" : ""
        }`}
        ref={aRef}
        style={{
          height: aRef?.current?.clientWidth,
        }}
      >
        <img
          src={nft.nft_img_url}
          className="object-cover w-full h-full hover:opacity-90"
        />
      </a>
    </Link>
  );
}
