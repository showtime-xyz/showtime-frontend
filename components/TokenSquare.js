import React from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";

const TokenSquare = ({ item, handleLike, handleUnlike }) => {
  return (
    <div>
      <img
        className="w-full object-cover object-center"
        src={item.image_url}
        alt="nft"
      />
      <div className="mt-6 p-1">
        <div>
          <div className="float-right showtime-square-created">
            {item.last_sale && item.last_sale.payment_token
              ? " Ξ " +
                parseFloat(item.last_sale.payment_token.eth_price).toFixed(3) +
                " ETH ($" +
                parseInt(item.last_sale.payment_token.usd_price) +
                ")"
              : null}
          </div>
          <h2 className="showtime-square-created">
            {item.creator
              ? item.creator.user && item.creator.user.username
                ? item.creator.user.username
                : "[Unnamed]"
              : "WHAT"}
          </h2>
        </div>
        <div>
          <div className="float-right text-right pt-8">
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
          <h1 className="showtime-square-title">{item.name}</h1>

          <p className="showtime-square-owned">
            Owned by {item.owner.user ? item.owner.user.username : "[Unnamed]"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenSquare;
