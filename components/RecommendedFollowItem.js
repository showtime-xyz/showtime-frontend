import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import useKeyPress from "../hooks/useKeyPress";
import ModalTokenDetail from "./ModalTokenDetail";
import FollowButton from "./FollowButton";
import AppContext from "../context/app-context";
import { formatAddressShort, truncateWithEllipses } from "../lib/utilities";
import RemoveRecommendationButton from "./RemoveRecommendationButton";

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
  ${(p) =>
    p.liteVersion
      ? `white-space: nowrap;
  max-width: 120px;`
      : ""},
`;

const ProfileBottomSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileTitle = styled.h4`
  font-size: ${(p) => (p.liteVersion ? "16px" : "20px")};
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  margin-right: ${(p) => (p.liteVersion ? "20px" : "unset")};
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
  width: ${(p) => (p.liteVersion ? "42px" : "72px")};
  height: ${(p) => (p.liteVersion ? "42px" : "72px")};
  border-radius: 50%;
  margin-right: ${(p) => (p.liteVersion ? "10px" : "20px")};
  cursor: pointer;
  box-sizing: border-box;
`;

const RemoveButtonWrapper = styled.div``;

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
    topItems?.length > 0 && (
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
    )
  );
};

const RecommendedFollowItem = ({
  item,
  closeModal,
  liteVersion,
  removeRecommendation,
}) => {
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

  return (
    <RecommendedFollowRowItem>
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={currentlyOpenModal}
            setEditModalOpen={setCurrentlyOpenModal}
            item={currentlyOpenModal}
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
              }}
              style={{ minWidth: 42 }}
            >
              <ProfileImage
                isMobile={context.isMobile}
                liteVersion={liteVersion}
                src={
                  item?.img_url
                    ? item?.img_url
                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                }
              />
            </a>
          </Link>
          <ProfileSectionContent liteVersion={liteVersion}>
            <Link href="/[profile]" as={`/${item?.username || item.address}`}>
              <a
                onClick={() => {
                  closeModal();
                }}
              >
                <ProfileTitle liteVersion={liteVersion}>
                  {truncateWithEllipses(
                    item?.name,
                    context.isMobile ? 19 : 30
                  ) ||
                    formatAddressShort(item.address) ||
                    "Unnamed"}
                </ProfileTitle>
              </a>
            </Link>
            {!liteVersion && (
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
            )}
          </ProfileSectionContent>
        </ProfileSection>
        <div className="flex flex-col md:flex-row w-full md:w-auto">
          {!isMyProfile && (
            <FollowButtonWrapper>
              <FollowButton
                item={item}
                followerCount={followerCount}
                setFollowerCount={setFollowerCount}
              />
            </FollowButtonWrapper>
          )}

          {liteVersion && (
            <RemoveButtonWrapper>
              <RemoveRecommendationButton
                item={item}
                removeRecommendation={removeRecommendation}
              />
            </RemoveButtonWrapper>
          )}
        </div>
      </RecommendedFollowHeader>
      {context.gridWidth <= 420 ? (
        <>
          <Tiles
            topItems={topItems.slice(0, 3)}
            setCurrentlyOpenModal={setCurrentlyOpenModal}
          />
          {/*<Tiles
            topItems={topItems.slice(3, 6)}
            setCurrentlyOpenModal={setCurrentlyOpenModal}
          />*/}
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
