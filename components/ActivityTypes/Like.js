import Link from "next/link";
import React from "react";

export default function Like({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="mb-2 text-gray-500">Liked {count} items</div>
      <div className="flex">
        {nfts.map((nft, index) => (
          <Link href={`/t/${nft.contract_address}/${nft.token_id}`}>
            <a
              className={`flex-1 rounded-lg h-60 overflow-hidden ${
                index !== count - 1 ? "mr-1" : ""
              }`}
            >
              <img src={nft.nft_img_url} className="object-cover w-full h-60" />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
