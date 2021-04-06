import React from "react";
import ActivityImage from "./ActivityImage";

export default function ActivityImages({ nfts }) {
  const count = nfts?.length;
  return (
    <>
      {count < 3 && (
        <div className="flex flex-1">
          {nfts.map((nft, index) => (
            <ActivityImage
              nft={nft}
              index={index}
              key={nft.nft_id}
              numberOfImages={count}
            />
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="flex flex-col flex-1">
          <ActivityImage
            nft={nfts[0]}
            index={0}
            key={nfts[0].nft_id}
            numberOfImages={1}
          />
          <div className="flex mt-1 w-full">
            {[nfts[1], nfts[2]].map((nft, index) => (
              <ActivityImage
                nft={nft}
                index={index}
                key={nft.nft_id}
                numberOfImages={2}
              />
            ))}
          </div>
        </div>
      )}

      {count === 4 && (
        <div className="flex flex-col">
          <div className="flex mb-1">
            {[nfts[0], nfts[1]].map((nft, index) => (
              <ActivityImage
                nft={nft}
                index={index}
                key={nft.nft_id}
                numberOfImages={2}
              />
            ))}
          </div>
          <div className="flex">
            {[nfts[2], nfts[3]].map((nft, index) => (
              <ActivityImage
                nft={nft}
                index={index}
                key={nft.nft_id}
                numberOfImages={2}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
