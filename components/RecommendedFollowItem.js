import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import useKeyPress from "../hooks/useKeyPress";
import ModalTokenDetail from "./ModalTokenDetail";
import { getImageUrl } from "../lib/utilities";
import FollowButton from "./FollowButton";
import AppContext from "../context/app-context";
import { formatAddressShort } from "../lib/utilities";

const RecommendedFollowRowItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.11);
`;

const RecommendedFollowHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileBottomSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileTitle = styled.h4`
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    color: #e45cff;
  }
`;

const Metadata = styled.div`
  display: flex;
  align-items: center;
`;

const MetadataIcon = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #bdbdbd;
`;

const MetadataText = styled.h6`
  font-size: 14px;
  font-weight: 500;
  margin-right: 16px;
`;

const ProfileImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-right: 20px;
  cursor: pointer;
  box-sizing: border-box;
`;

const FollowButtonWrapper = styled.div`
  @media screen and (max-width: 600px) {
    margin-top: 20px;
    width: 100%;
  }
`;

const NFTTiles = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 16px;
  @media screen and (max-width: 420px) {
    justify-content: space-between;
  }
`;

const NFTTile = styled.img`
  width: 12vw;
  height: 12vw;
  max-width: 80px;
  max-height: 80px;
  object-fit: cover;
  cursor: pointer;
  @media screen and (max-width: 420px) {
    width: 27vw;
    height: 27vw;
    max-width: 27vw;
    max-height: 27vw;
  }
`;

const NFTVideoTile = styled.div`
  width: 12vw;
  height: 12vw;
  max-width: 80px;
  max-height: 80px;
  cursor: pointer;
  background: black;
  @media screen and (max-width: 420px) {
    width: 27vw;
    height: 27vw;
    max-width: 27vw;
    max-height: 27vw;
  }
`;

const Tiles = ({ topItems, setCurrentlyOpenModal }) => {
  const context = useContext(AppContext);
  return (
    <NFTTiles>
      {topItems.map((topItem, index) => (
        <div key={topItem?.nft_id}>
          {topItem?.token_img_thumbnail_url ? (
            <NFTTile
              style={{
                marginRight:
                  index === topItems.length - 1 || context.gridWidth <= 420
                    ? 0
                    : 14,
              }}
              onClick={() => setCurrentlyOpenModal(topItem)}
              src={topItem?.token_img_thumbnail_url}
            />
          ) : (
            <NFTVideoTile
              style={{
                marginRight:
                  index === topItems.length - 1 || context.gridWidth <= 420
                    ? 0
                    : 14,
              }}
              onClick={() => setCurrentlyOpenModal(topItem)}
            >
              <ReactPlayer
                url={topItem?.token_animation_url}
                playing={false}
                loop
                muted={true}
                width={"100%"}
                height={"100%"}
                playsinline
              />
            </NFTVideoTile>
          )}
        </div>
      ))}
    </NFTTiles>
  );
};

const RecommendedFollowItem = ({ item, closeModal }) => {
  const context = useContext(AppContext);
  const [followerCount, setFollowerCount] = useState();
  const isMyProfile = context?.myProfile?.profile_id === item?.profile_id;
  const topItems = item?.top_items.slice(0, 6);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);
  const currentIndex = topItems?.findIndex(
    (i) => i.nft_id === currentlyOpenModal?.nft_id
  );
  const goToNext = () => {
    if (currentIndex < topItems.length - 1) {
      setCurrentlyOpenModal(topItems[currentIndex + 1]);
    }
  };
  const goToPrevious = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentlyOpenModal(topItems[currentIndex - 1]);
    }
  };
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");
  useEffect(() => {
    if (escPress) {
      setCurrentlyOpenModal(null);
    }
    if (rightPress && currentlyOpenModal) {
      mixpanel.track("Next NFT - keyboard");
      goToNext();
    }
    if (leftPress && currentlyOpenModal) {
      mixpanel.track("Prior NFT - keyboard");
      goToPrevious();
    }
  }, [escPress, leftPress, rightPress]);

  const handleLike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes([...context.myLikes, nft_id]);

    const likedItem = topItems.find((i) => i.nft_id === nft_id);
    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        ((myLikeCounts && myLikeCounts[nft_id]) || likedItem.like_count) + 1,
    });

    // Post changes to the API
    await fetch(`/api/like_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };
  const handleUnlike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === nft_id)));

    const likedItem = topItems.find((i) => i.nft_id === nft_id);
    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        ((myLikeCounts && myLikeCounts[nft_id]) || likedItem.like_count) - 1,
    });

    // Post changes to the API
    await fetch(`/api/unlike_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

  return (
    <RecommendedFollowRowItem>
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={currentlyOpenModal}
            setEditModalOpen={setCurrentlyOpenModal}
            item={currentlyOpenModal}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            columns={context.columns}
            hasNext={!(currentIndex === topItems.length - 1)}
            hasPrevious={!(currentIndex === 0)}
          />
        </>
      ) : null}
      <RecommendedFollowHeader>
        <ProfileSection>
          <Link href="/[profile]" as={`/${item?.username || item.address}`}>
            <a
              onClick={() => {
                closeModal();
                console.log("Close modal");
              }}
            >
              <ProfileImage
                isMobile={context.isMobile}
                src={getImageUrl(item?.img_url)}
              />
            </a>
          </Link>
          <ProfileSectionContent>
            <Link href="/[profile]" as={`/${item?.username || item.address}`}>
              <a
                onClick={() => {
                  closeModal();
                  console.log("Close modal");
                }}
              >
                <ProfileTitle>
                  {item?.name || formatAddressShort(item.address) || "Unnamed"}
                </ProfileTitle>
              </a>
            </Link>
            <ProfileBottomSection>
              <Metadata>
                <MetadataIcon>
                  <FontAwesomeIcon icon={faUser} />
                </MetadataIcon>
                <MetadataText>{followerCount}</MetadataText>
                <MetadataIcon>
                  <FontAwesomeIcon icon={faHeart} />
                </MetadataIcon>
                <MetadataText>{item?.like_count_total}</MetadataText>
              </Metadata>
            </ProfileBottomSection>
          </ProfileSectionContent>
        </ProfileSection>
        {!isMyProfile && (
          <FollowButtonWrapper>
            <FollowButton
              item={item}
              followerCount={followerCount}
              setFollowerCount={setFollowerCount}
            />
          </FollowButtonWrapper>
        )}
      </RecommendedFollowHeader>
      {context.gridWidth <= 420 ? (
        <>
          <Tiles
            topItems={topItems.slice(0, 3)}
            setCurrentlyOpenModal={setCurrentlyOpenModal}
          />
          <Tiles
            topItems={topItems.slice(3, 6)}
            setCurrentlyOpenModal={setCurrentlyOpenModal}
          />
        </>
      ) : (
        <Tiles
          topItems={topItems}
          setCurrentlyOpenModal={setCurrentlyOpenModal}
        />
      )}
    </RecommendedFollowRowItem>
  );
};

export default RecommendedFollowItem;
