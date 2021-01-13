import React from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";

const TokenHero = ({ item, handleLike, handleUnlike }) => {
  return (
    <div>
      <img
        className="object-cover object-center h-full w-full"
        style={{ maxHeight: 600 }}
        src={item.image_url}
        alt="nft"
      />
      <div className="mt-6 p-1">
        <div className="float-right text-right">
          <div>
            <ShareButton />
            <LikeButton
              isLiked={item.liked}
              likeCount={item.showtime.like_count}
              handleLike={handleLike}
              handleLikeArgs={{
                contract: item.asset_contract.address,
                token_id: item.token_id,
                creator_address: item.creator ? item.creator.address : null,
                creator_name:
                  item.creator && item.creator.user
                    ? item.creator.user.username
                    : null,
                creator_img_url: item.creator
                  ? item.creator.profile_img_url
                  : null,
              }}
              handleUnlike={handleUnlike}
              handleUnlikeArgs={{
                contract: item.asset_contract.address,
                token_id: item.token_id,
              }}
            />
          </div>

          {/*<div className=" text-gray-200 text-right lg:ml-auto md:ml-0 ml-auto leading-none text-md py-3 ">
            {item.last_sale && item.last_sale.payment_token
              ? "Last sale Ξ" +
                parseFloat(item.last_sale.payment_token.eth_price).toFixed(3) +
                " ($" +
                parseInt(item.last_sale.payment_token.usd_price) +
                ")"
              : null}
            </div>*/}
        </div>

        <div className="showtime-hero-title">
          {item.name}{" "}
          {item.creator
            ? item.creator.user && item.creator.user.username
              ? ` by ${item.creator.user.username}`
              : "by [Unnamed]"
            : null}
        </div>

        {/*<p className="leading-relaxed mb-3 text-gray-200">
          Owned by {item.owner.user ? item.owner.user.username : "[Unnamed]"}
          </p>*/}
      </div>
    </div>
  );
};

export default TokenHero;
