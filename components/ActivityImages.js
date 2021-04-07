import React from "react";
import ActivityImage from "./ActivityImage";

export default function ActivityImages({ nfts, openModal }) {
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
              openModal={openModal}
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
            openModal={openModal}
          />
          <div className="flex mt-1 w-full">
            {[nfts[1], nfts[2]].map((nft, index) => (
              <ActivityImage
                nft={nft}
                index={index + 1}
                key={nft.nft_id}
                numberOfImages={2}
                openModal={openModal}
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
                openModal={openModal}
              />
            ))}
          </div>
          <div className="flex">
            {[nfts[2], nfts[3]].map((nft, index) => (
              <ActivityImage
                nft={nft}
                index={index + 2}
                key={nft.nft_id}
                numberOfImages={2}
                openModal={openModal}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
