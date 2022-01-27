/* eslint-disable react-hooks/rules-of-hooks */ // For some reason, this rule is behaving weirdly. @TODO I guess
import { useState, useEffect, useContext, useRef, Fragment } from "react";
import Head from "next/head";
import mixpanel from "mixpanel-browser";
import Tippy from "@tippyjs/react";
import BadgeIcon from "@/components/Icons/BadgeIcon";
import Layout from "@/components/layout";
import CappedWidth from "@/components/CappedWidth";
import TokenGridV5 from "@/components/TokenGridV5";
import backend from "@/lib/backend";
import AppContext from "@/context/app-context";
import ModalEditProfile from "@/components/ModalEditProfile";
import ModalEditPhoto from "@/components/ModalEditPhoto";
import ModalEditCover from "@/components/ModalEditCover";
import ModalUserList from "@/components/ModalUserList";
import {
  formatAddressShort,
  truncateWithEllipses,
  classNames,
} from "@/lib/utilities";
import { AddressCollection } from "@/components/AddressButton";
import {
  PROFILE_TABS,
  SORT_FIELDS,
  DEFAULT_PROFILE_PIC,
} from "@/lib/constants";
import SpotlightItem from "@/components/SpotlightItem";
import { Transition, Menu } from "@headlessui/react";
import {
  PencilAltIcon,
  DotsHorizontalIcon,
  HeartIcon,
} from "@heroicons/react/solid";
import { UploadIcon } from "@heroicons/react/outline";
import axios, { CancelToken, isCancel } from "@/lib/axios";
import FollowersInCommon from "@/components/FollowersInCommon";
import GlobeIcon from "@/components/Icons/GlobeIcon";
import useAuth from "@/hooks/useAuth";
import FingerprintIcon from "@/components/Icons/FingerprintIcon";
import WalletIcon from "@/components/Icons/WalletIcon";
import Dropdown from "@/components/UI/Dropdown";
import Button from "@/components/UI/Buttons/Button";
import useProfile from "@/hooks/useProfile";
import useSWR from "swr";
import reactStringReplace from "react-string-replace";
import Link from "next/link";

export async function getStaticProps({ params: { profile: slug_address } }) {
  if (slug_address.includes("apple-touch-icon"))
    return { props: {}, notFound: true };

  try {
    const {
      data: {
        data: { profile, followers_count, following_count, featured_nft },
      },
    } = await backend.get(
      `v4/profile_server/${encodeURIComponent(slug_address)}`
    );

    return {
      props: {
        profile,
        slug_address,
        followers_count,
        following_count,
        featured_nft,
      },
      revalidate: 2,
    };
  } catch (err) {
    if (err.response.status == 400) {
      return { redirect: { destination: "/", permanent: false } };
    } else {
      return { notFound: true, revalidate: 1 };
    }
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

const Profile = ({
  profile,
  slug_address,
  followers_count,
  following_count,
  featured_nft,
}) => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { myProfile, setMyProfile } = useProfile();
  const context = useContext(AppContext);

  const [cancelTokenArray, setCancelTokens] = useState([
    CancelToken.source(),
    CancelToken.source(),
    CancelToken.source(),
  ]);

  const cancelTokens = {
    get(listId) {
      return cancelTokenArray[listId];
    },
    refresh(listId) {
      const newToken = CancelToken.source();

      setCancelTokens((tokenArray) => {
        tokenArray[listId] = newToken;

        return tokenArray;
      });

      return newToken;
    },
    cancelExcept(listId) {
      cancelTokenArray
        .filter((_, i) => listId != i)
        .forEach((source) => source.cancel());
    },
    willLoad(listId) {
      this.cancelExcept(listId);
      return this.refresh(listId);
    },
  };

  // Profile details
  const [isMyProfile, setIsMyProfile] = useState();
  const initialBioLength = context.isMobile ? 130 : 150;
  const [moreBioShown, setMoreBioShown] = useState(false);
  const [followersCount, setFollowersCount] = useState(followers_count);

  // Using global context for logged in user, else server data for other pages
  const {
    name,
    img_url,
    cover_url,
    wallet_addresses_v2,
    wallet_addresses_excluding_email_v2,
    bio,
    website_url,
    username,
    featured_nft_img_url,
    links,
    verified,
  } = isMyProfile && myProfile ? myProfile : profile;
  const { profile_id } = profile;

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setIsMyProfile(false);
      mixpanel.track("Profile view", { slug: slug_address });
      return;
    }

    // Logged in?
    if (
      profile.wallet_addresses_v2
        .map((a) => a.address?.toLowerCase())
        .includes(user.publicAddress.toLowerCase())
    ) {
      setIsMyProfile(true);
      mixpanel.track("Self profile view", { slug: slug_address });
    } else {
      setIsMyProfile(false);
      mixpanel.track("Profile view", { slug: slug_address });
    }
  }, [
    authLoading,
    isAuthenticated,
    profile.wallet_addresses_v2,
    user?.publicAddress,
    slug_address,
  ]);

  const [isFollowed, setIsFollowed] = useState(false);
  useEffect(() => {
    if (context.myFollows) {
      setIsFollowed(
        context.myFollows.map((p) => p.profile_id).includes(profile_id)
      );
    }
  }, [context.myFollows, profile_id]);

  // Follow back?
  const { data: followingMe, mutate: mutateFollowsYou } = useSWR(
    () => isAuthenticated && `/api/profile/following?userId=${profile_id}`,
    (url) => axios.get(url).then((res) => res.data.data.following),
    {
      initialData: false,
      revalidateOnMount: true,
      focusThrottleInterval: 60 * 1000,
    }
  );

  // Runs when profile switches and on initial load
  useEffect(() => {
    let isSubscribed = true;

    // Reset these values
    mutateFollowsYou(false, true);
    setMoreBioShown(false);
    setShowUserHiddenItems(false);
    setShowDuplicates(false);
    setCollectionId(0);
    setPage(1);
    setMenuLists([]);
    setHasMore(true);
    setItems([]);
    setSpotlightItem(featured_nft);
    setFollowersCount(followers_count);

    // Populate the tab counts, pick an active tab, then pull the NFT list based on active tab
    getTabs().then((tabsData) => {
      // Using isSubscribed to make sure the user hasn't navigated to a different page in the meantime
      if (isSubscribed) {
        // Populate the tab counts
        setMenuLists(tabsData.lists);

        // Set sort & hidden NFT information, which was returned in the tab response
        setSelectedCreatedSortField(tabsData.lists[0].sort_id);
        setSelectedOwnedSortField(tabsData.lists[1].sort_id);
        setHasUserHiddenItems(
          tabsData.lists[0].count_all_withhidden >
            tabsData.lists[0].count_all_nonhidden ||
            tabsData.lists[1].count_all_withhidden >
              tabsData.lists[1].count_all_nonhidden
        );

        // Look for ?list=X in URL, else fall back to the default specified in the tab response
        const urlParams = new URLSearchParams(location.search);
        const initialListId = urlParams.has("list")
          ? PROFILE_TABS.indexOf(urlParams.get("list"))
          : tabsData.default_list_id;

        // Set the currently active tab
        setSelectedGrid(initialListId);

        // Pull the NFT list for the currently active tab
        setSwitchInProgress(true);
        const sortId =
          initialListId === 1
            ? tabsData.lists[0].sort_id
            : initialListId === 2
            ? tabsData.lists[1].sort_id
            : selectedLikedSortField;
        updateItems(
          initialListId,
          sortId,
          0,
          true,
          1,
          showUserHiddenItems,
          0,
          cancelTokens
        ).then(setSwitchInProgress(false));
      }
    });

    return () => (isSubscribed = false);
  }, [slug_address]);

  // Spotlight
  const [spotlightItem, setSpotlightItem] = useState();
  const handleChangeSpotlightItem = async (nft) => {
    const nftId = nft ? nft.nft_id : null;
    setSpotlightItem(nft);

    // Post changes to the API
    await axios.post("/api/updatespotlight", { nft_id: nftId });
  };

  // NFT grid
  // Tab menu
  const [menuLists, setMenuLists] = useState([]);

  const getTabs = async () => {
    const {
      data: { data: tabsData },
    } = await backend.get(`v1/profile_tabs/${profile_id}`);
    return tabsData;
  };

  const [selectedCreatedSortField, setSelectedCreatedSortField] = useState(1);
  const [selectedOwnedSortField, setSelectedOwnedSortField] = useState(1);
  const [selectedLikedSortField, setSelectedLikedSortField] = useState(2);

  // Grid
  const gridRef = useRef();
  const [selectedGrid, setSelectedGrid] = useState(1);
  const sortingOptionsList = [
    //{ label: "Select...", key: "" },
    ...Object.keys(SORT_FIELDS).map((key) => SORT_FIELDS[key]),
  ];
  const perPage = context.isMobile ? 4 : 12;

  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [switchInProgress, setSwitchInProgress] = useState(false);
  const [showUserHiddenItems, setShowUserHiddenItems] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [hasUserHiddenItems, setHasUserHiddenItems] = useState(false);

  const [collectionId, setCollectionId] = useState(0);
  const [isRefreshingCards, setIsRefreshingCards] = useState(false);

  const shortBioWithMentions = reactStringReplace(
    truncateWithEllipses(bio, initialBioLength),
    /@([\w\d-]+?)\b/g,
    (username, i) => {
      return (
        <Link href="/[profile]" as={`/${username}`} key={i}>
          <a className="font-semibold">@{username}</a>
        </Link>
      );
    }
  );

  const bioWithMentions = reactStringReplace(
    bio,
    /@([\w\d-]+?)\b/g,
    (username, i) => {
      return (
        <Link href="/[profile]" as={`/${username}`} key={i}>
          <a className="font-semibold">@{username}</a>
        </Link>
      );
    }
  );

  const updateItems = async (
    listId,
    sortId,
    collectionId,
    showCardRefresh,
    page,
    showHidden,
    showDuplicates,
    cancelTokens
  ) => {
    if (showCardRefresh) setIsRefreshingCards(true);

    const source = cancelTokens.willLoad(listId);

    await axios
      .post(
        "/api/getprofilenfts",
        {
          profileId: profile_id,
          page: page,
          limit: perPage,
          listId: listId,
          sortId: sortId,
          showHidden: showHidden ? 1 : 0,
          showDuplicates: showDuplicates ? 1 : 0,
          collectionId: collectionId,
        },
        { cancelToken: source.token }
      )
      .then(({ data: { data } }) => {
        setItems(data.items);
        setHasMore(data.has_more);

        if (showCardRefresh) setIsRefreshingCards(false);
      })
      .catch((err) => {
        if (!isCancel(err)) throw err;
      });
  };

  const addPage = async (nextPage) => {
    setIsLoadingMore(true);
    const sortId =
      selectedGrid === 1
        ? selectedCreatedSortField
        : selectedGrid === 2
        ? selectedOwnedSortField
        : selectedLikedSortField;

    const { data } = await axios
      .post("/api/getprofilenfts", {
        profileId: profile_id,
        page: nextPage,
        limit: perPage,
        listId: selectedGrid,
        sortId: fetchMoreSort || sortId,
        showHidden: showUserHiddenItems ? 1 : 0,
        showDuplicates: showDuplicates ? 1 : 0,
        collectionId: collectionId,
      })
      .then((res) => res.data);
    if (!switchInProgress) {
      setItems((items) => [...items, ...data.items]);
      setHasMore(data.has_more);
      setPage(nextPage);
    }

    setIsLoadingMore(false);
  };

  const handleSortChange = async (sortId) => {
    setSwitchInProgress(true);
    const setSelectedSortField =
      selectedGrid === 1
        ? setSelectedCreatedSortField
        : selectedGrid === 2
        ? setSelectedOwnedSortField
        : setSelectedLikedSortField;
    setPage(1);
    setSelectedSortField(sortId);
    await updateItems(
      selectedGrid,
      sortId,
      collectionId,
      true,
      1,
      showUserHiddenItems,
      showDuplicates,
      cancelTokens
    );
    setSwitchInProgress(false);
  };

  const handleListChange = async (listId) => {
    setSwitchInProgress(true);
    setSelectedGrid(listId);
    setCollectionId(0);
    setPage(1);
    setShowDuplicates(false);

    const sortId =
      listId === 1
        ? selectedCreatedSortField
        : listId === 2
        ? selectedOwnedSortField
        : selectedLikedSortField;

    history.replaceState(
      undefined,
      undefined,
      `/${slug_address}?list=${PROFILE_TABS[listId]}`
    );

    await updateItems(
      listId,
      sortId,
      0,
      true,
      1,
      showUserHiddenItems,
      0,
      cancelTokens
    );
    setSwitchInProgress(false);
  };

  const handleCollectionChange = async (collectionId) => {
    setSwitchInProgress(true);
    setCollectionId(collectionId);
    setPage(1);

    const sortId =
      selectedGrid === 1
        ? selectedCreatedSortField
        : selectedGrid === 2
        ? selectedOwnedSortField
        : selectedLikedSortField;
    await updateItems(
      selectedGrid,
      sortId,
      collectionId,
      true,
      1,
      showUserHiddenItems,
      showDuplicates,
      cancelTokens
    );
    setSwitchInProgress(false);
  };

  const handleShowHiddenChange = async (showUserHiddenItems) => {
    setShowUserHiddenItems(showUserHiddenItems);
    setSwitchInProgress(true);
    if (gridRef?.current?.getBoundingClientRect().top < 0) {
      window.scroll({
        top: gridRef?.current?.offsetTop + 30,
        behavior: "smooth",
      });
    }
    setPage(1);

    const sortId =
      selectedGrid === 1
        ? selectedCreatedSortField
        : selectedGrid === 2
        ? selectedOwnedSortField
        : selectedLikedSortField;
    await updateItems(
      selectedGrid,
      sortId,
      collectionId,
      true,
      1,
      showUserHiddenItems,
      showDuplicates,
      cancelTokens
    );
    setSwitchInProgress(false);
  };

  const handleShowDuplicates = async (showDuplicates) => {
    setShowDuplicates(showDuplicates);
    setSwitchInProgress(true);
    if (gridRef?.current?.getBoundingClientRect().top < 0) {
      window.scroll({
        top: gridRef?.current?.offsetTop + 30,
        behavior: "smooth",
      });
    }
    setPage(1);

    const sortId =
      selectedGrid === 1
        ? selectedCreatedSortField
        : selectedGrid === 2
        ? selectedOwnedSortField
        : selectedLikedSortField;
    await updateItems(
      selectedGrid,
      sortId,
      collectionId,
      true,
      1,
      showUserHiddenItems,
      showDuplicates,
      cancelTokens
    );
    setSwitchInProgress(false);
  };

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out");
    context.setLoginModalOpen(true);
  };

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { data: followers, mutate: setFollowers } = useSWR(
    () =>
      showFollowers &&
      `/v1/people?profile_id=${profile_id}&want=followers&limit=500`,
    (url) => backend.get(url).then((res) => res.data.data.list),
    { focusThrottleInterval: 60 * 1000 }
  );
  const { data: following } = useSWR(
    () =>
      showFollowing &&
      `/v1/people?profile_id=${profile_id}&want=following&limit=500`,
    (url) => backend.get(url).then((res) => res.data.data.list),
    { focusThrottleInterval: 60 * 1000 }
  );

  const handleFollow = async () => {
    setIsFollowed(true);
    setFollowersCount(followersCount + 1);
    // Change myFollows via setMyFollows
    context.setMyFollows([
      {
        profile_id: profile_id,
        wallet_address: wallet_addresses_v2[0].address,
        name: name,
        img_url: img_url ? img_url : DEFAULT_PROFILE_PIC,
        timestamp: null,
        username: username,
      },
      ...context.myFollows,
    ]);

    if (followers) {
      setFollowers([
        {
          profile_id: myProfile.profile_id,
          wallet_address: user.publicAddress,
          name: myProfile.name,
          img_url: myProfile.img_url || DEFAULT_PROFILE_PIC,
          timestamp: null,
          username: myProfile.username,
        },
        ...followers,
      ]);
    }

    // Post changes to the API
    await axios
      .post(`/api/follow_v2/${profile_id}`)
      .then(() => mixpanel.track("Followed profile"))
      .catch((err) => {
        if (err.response.data.code !== 429) throw err;

        setIsFollowed(false);
        setFollowersCount(followersCount);
        // Change myLikes via setMyLikes
        context.setMyFollows(
          context.myFollows.filter((item) => item.profile_id != profile_id)
        );

        setFollowers(
          followers.filter(
            (follower) => myProfile.profile_id != follower.profile_id
          )
        );

        return context.setThrottleMessage(err.response.data.message);
      });
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    setFollowersCount(followersCount - 1);
    // Change myLikes via setMyLikes
    context.setMyFollows(
      context.myFollows.filter((item) => item.profile_id != profile_id)
    );

    if (followers)
      setFollowers(
        followers.filter(
          (follower) => myProfile.profile_id != follower.profile_id
        )
      );

    // Post changes to the API
    if (context.disableFollows === false) {
      await axios.post(`/api/unfollow_v2/${profile_id}`);
      mixpanel.track("Unfollowed profile");
    }
  };

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pictureModalOpen, setPictureModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);

  const editAccount = () => {
    setEditModalOpen(true);
    mixpanel.track("Open edit name");
  };

  const editPhoto = () => {
    setPictureModalOpen(true);
    mixpanel.track("Open edit photo");
  };

  const [isChangingOrder, setIsChangingOrder] = useState(false);
  const [revertItems, setRevertItems] = useState(null);
  const [revertSort, setRevertSort] = useState(null);
  const [fetchMoreSort, setFetchMoreSort] = useState(null);

  const handleClickChangeOrder = async () => {
    if (menuLists[selectedGrid - 1].has_custom_sort) {
      setFetchMoreSort(5);
      await handleSortChange(5);
    } else {
      setFetchMoreSort(
        selectedGrid === 1 ? selectedCreatedSortField : selectedOwnedSortField
      );
      const setSelectedSortField =
        selectedGrid === 1
          ? setSelectedCreatedSortField
          : selectedGrid === 2
          ? setSelectedOwnedSortField
          : setSelectedLikedSortField;
      setSelectedSortField(5);
    }
    setRevertItems(items);
    setRevertSort(
      selectedGrid === 1 ? selectedCreatedSortField : selectedOwnedSortField
    );
    setIsChangingOrder(true);
  };

  const handleClickDeleteCustomOrder = async () => {
    await handleSortChange(1);

    setIsChangingOrder(false);
    setRevertItems(null);
    setMenuLists(
      menuLists.map((list, index) =>
        index === selectedGrid - 1 ? { ...list, has_custom_sort: false } : list
      )
    );

    setMyProfile(
      {
        ...myProfile,
        ...(selectedGrid === 1 && { default_created_sort_id: null }),
        ...(selectedGrid === 2 && { default_owned_sort_id: null }),
      },
      true
    );

    await axios.post("/api/updatelistorder", {
      new_order: null,
      list_id: selectedGrid,
    });
  };

  const handleSaveOrder = async () => {
    const saveOrderPayload = items.map((o, i) => ({
      index: i,
      nft_id: o.nft_id,
    }));
    setIsChangingOrder(false);
    setRevertItems(null);
    const newMenuLists = menuLists.map((list, index) =>
      index === selectedGrid - 1 ? { ...list, has_custom_sort: true } : list
    );
    setMenuLists(newMenuLists);
    setMyProfile(
      {
        ...myProfile,
        ...(selectedGrid === 1 && { default_created_sort_id: 5 }),
        ...(selectedGrid === 2 && { default_owned_sort_id: 5 }),
      },
      true
    );
    await fetch("/api/updatelistorder", {
      method: "post",
      body: JSON.stringify({
        new_order: saveOrderPayload,
        list_id: selectedGrid,
      }),
    });
  };

  const handleCancelOrder = () => {
    const oldItems = revertItems;
    const oldSort = revertSort;

    if (selectedGrid === 1) setSelectedCreatedSortField(oldSort);
    else setSelectedOwnedSortField(oldSort);

    setItems(oldItems);
    setFetchMoreSort(null);
    setRevertItems(null);
    setIsChangingOrder(false);
    setHasMore(true);
  };

  // reset reordering if page changes
  useEffect(() => {
    setIsChangingOrder(false);
    setRevertItems(null);
    setRevertSort(null);
    setFetchMoreSort(null);
  }, [selectedGrid, collectionId, profile_id, showUserHiddenItems]);

  const getCoverUrl = (img_url) => {
    if (img_url && img_url.includes("lh3.googleusercontent.com")) {
      img_url = context.isMobile
        ? img_url.split("=")[0] + "=w800"
        : img_url.split("=")[0] + "=w2880";
    }
    return img_url;
  };

  return (
    <div>
      {typeof document !== "undefined" ? (
        <>
          {editModalOpen && (
            <ModalEditProfile
              isOpen={editModalOpen}
              setEditModalOpen={setEditModalOpen}
            />
          )}
          <ModalEditPhoto
            isOpen={pictureModalOpen}
            setEditModalOpen={setPictureModalOpen}
          />
          <ModalEditCover
            isOpen={coverModalOpen}
            setEditModalOpen={setCoverModalOpen}
          />
          {/* Followers modal */}
          <ModalUserList
            title="Followers"
            isOpen={showFollowers}
            users={followers ? followers : []}
            closeModal={() => setShowFollowers(false)}
            emptyMessage={
              followers_count == 0 ? "No followers yet." : "Loading..."
            }
          />
          {/* Following modal */}
          <ModalUserList
            title="Following"
            isOpen={showFollowing}
            users={following ? following : []}
            closeModal={() => setShowFollowing(false)}
            emptyMessage={
              following_count == 0 ? "Not following anyone yet." : "Loading..."
            }
          />
        </>
      ) : null}
      <Layout>
        <Head>
          <title>
            {name
              ? name
              : username
              ? username
              : wallet_addresses_excluding_email_v2 &&
                wallet_addresses_excluding_email_v2.length > 0
              ? wallet_addresses_excluding_email_v2[0].ens_domain
                ? wallet_addresses_excluding_email_v2[0].ens_domain
                : formatAddressShort(
                    wallet_addresses_excluding_email_v2[0].address
                  )
              : "Unnamed"}{" "}
            | Showtime
          </title>

          <meta
            name="description"
            content="Explore crypto art I've created, owned, and liked"
          />
          <meta property="og:type" content="website" />
          <meta
            name="og:description"
            content="Explore crypto art I've created, owned, and liked"
          />
          <meta
            property="og:image"
            content={
              featured_nft_img_url
                ? featured_nft_img_url
                : img_url
                ? img_url
                : "https://cdn.tryshowtime.com/twitter_card.jpg"
            }
          />
          <meta
            name="og:title"
            content={
              name
                ? name
                : username
                ? username
                : wallet_addresses_excluding_email_v2 &&
                  wallet_addresses_excluding_email_v2.length > 0
                ? wallet_addresses_excluding_email_v2[0].ens_domain
                  ? wallet_addresses_excluding_email_v2[0].ens_domain
                  : formatAddressShort(
                      wallet_addresses_excluding_email_v2[0].address
                    )
                : "Unnamed"
            }
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={
              name
                ? name
                : username
                ? username
                : wallet_addresses_excluding_email_v2 &&
                  wallet_addresses_excluding_email_v2.length > 0
                ? wallet_addresses_excluding_email_v2[0].ens_domain
                  ? wallet_addresses_excluding_email_v2[0].ens_domain
                  : formatAddressShort(
                      wallet_addresses_excluding_email_v2[0].address
                    )
                : "Unnamed"
            }
          />
          <meta
            name="twitter:description"
            content="Explore crypto art I've created, owned, and liked"
          />
          <meta
            name="twitter:image"
            content={
              featured_nft_img_url
                ? featured_nft_img_url
                : img_url
                ? img_url
                : "https://cdn.tryshowtime.com/twitter_card.jpg"
            }
          />
        </Head>

        <div className="bg-white dark:bg-black pb-8">
          <div className="max-w-screen-2xl md:px-3 mx-auto w-full">
            <div
              className={`h-32 md:h-64 relative text-left bg-gray-50 dark:bg-gray-900 2xl:rounded-b-[32px] md:-mx-3 ${
                cover_url ? "bg-no-repeat bg-center bg-cover" : ""
              }`}
              style={
                cover_url
                  ? { backgroundImage: `url(${getCoverUrl(cover_url)})` }
                  : {}
              }
            >
              {isMyProfile && (
                <div className="relative">
                  <div
                    className="absolute top-6 right-5 2xl:right-5 text-gray-200 text-sm cursor-pointer bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg backdrop-saturate-150 py-1 px-3 rounded-full hover:bg-opacity-60 flex items-center"
                    onClick={() => {
                      if (isMyProfile) {
                        setCoverModalOpen(true);
                        mixpanel.track("Open edit cover photo");
                      }
                    }}
                  >
                    <PencilAltIcon className="w-4 h-4 mr-1" />
                    <span>Cover</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <CappedWidth>
            <div className="mx-5 md:mx-0 lg:mx-5">
              <div className="flex flex-col text-left">
                <div className="z-10 pb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative -mt-14 md:-mt-20 rounded-full border-8 border-white dark:border-gray-900 overflow-hidden group self-start flex-shrink-0">
                      <img
                        onClick={() => {
                          if (isMyProfile) {
                            setPictureModalOpen(true);
                            mixpanel.track("Open edit photo");
                          }
                        }}
                        src={img_url ? img_url : DEFAULT_PROFILE_PIC}
                        className="h-24 w-24 md:h-32 md:w-32 z-10 flex-shrink-0"
                      />
                      {isMyProfile && (
                        <button
                          onClick={editPhoto}
                          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg backdrop-saturate-150 transition duration-300 flex items-center justify-center rounded-full"
                        >
                          <UploadIcon className="w-10 h-10 text-white dark:text-gray-300" />
                        </button>
                      )}
                    </div>
                    <div className="hidden md:block">
                      {wallet_addresses_excluding_email_v2 && (
                        <AddressCollection
                          addresses={wallet_addresses_excluding_email_v2}
                          isMyProfile={isMyProfile}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-8 md:space-x-4 lg:space-x-8">
                    <div className="hidden md:block">
                      <FollowStats
                        {...{
                          following_count,
                          followersCount,
                          isMyProfile,
                          setShowFollowing,
                          setShowFollowers,
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        style={
                          isMyProfile
                            ? "tertiary_gray"
                            : isFollowed
                            ? "tertiary"
                            : "primary"
                        }
                        onClick={
                          isAuthenticated
                            ? isMyProfile
                              ? editAccount
                              : isFollowed
                              ? handleUnfollow
                              : context.disableFollows
                              ? null
                              : handleFollow
                            : handleLoggedOutFollow
                        }
                        className={`space-x-2 !rounded-full ${
                          isFollowed || isMyProfile
                            ? "dark:text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {isMyProfile ? (
                          <span className="font-semibold whitespace-nowrap">
                            Edit Profile
                          </span>
                        ) : isFollowed ? (
                          <span className="font-bold">Following</span>
                        ) : (
                          <span className="font-bold">
                            {followingMe ? "Follow Back" : "Follow"}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2
                            className={`text-3xl md:text-4xl font-tomato font-bold text-black dark:text-white ${
                              verified ? "whitespace-nowrap" : ""
                            }`}
                          >
                            {name
                              ? name
                              : username
                              ? username
                              : wallet_addresses_excluding_email_v2 &&
                                wallet_addresses_excluding_email_v2.length > 0
                              ? wallet_addresses_excluding_email_v2[0]
                                  .ens_domain
                                ? wallet_addresses_excluding_email_v2[0]
                                    .ens_domain
                                : formatAddressShort(
                                    wallet_addresses_excluding_email_v2[0]
                                      .address
                                  )
                              : "Unnamed"}
                          </h2>
                          {verified && (
                            <BadgeIcon
                              className="w-5 md:w-6 h-auto text-black dark:text-white"
                              tickClass="text-white dark:text-black"
                            />
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          {(username ||
                            (wallet_addresses_excluding_email_v2 &&
                              wallet_addresses_excluding_email_v2.length >
                                0)) && (
                            <p className="flex flex-row items-center justify-start">
                              {username && (
                                <span className="font-tomato font-bold tracking-wider dark:text-gray-300">
                                  @{username}
                                </span>
                              )}
                            </p>
                          )}
                          {followingMe && (
                            <span className="font-medium text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                              Follows You
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:block">
                        {isAuthenticated && !isMyProfile && (
                          <FollowersInCommon profileId={profile_id} />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        {bio ? (
                          <div className="text-black dark:text-gray-400 text-sm max-w-2xl text-left md:text-base mt-4 block break-words">
                            {moreBioShown
                              ? bioWithMentions
                              : shortBioWithMentions}
                            {!moreBioShown &&
                              bio &&
                              bio.length > initialBioLength && (
                                <a
                                  onClick={() => setMoreBioShown(true)}
                                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer"
                                >
                                  {" "}
                                  more
                                </a>
                              )}
                          </div>
                        ) : null}
                      </div>
                      <LinkCollection
                        className="hidden md:block"
                        links={links}
                        website_url={website_url}
                        slug_address={slug_address}
                      />
                    </div>
                    {wallet_addresses_excluding_email_v2 && (
                      <div className="mt-8 md:hidden">
                        <AddressCollection
                          addresses={wallet_addresses_excluding_email_v2}
                          isMyProfile={isMyProfile}
                        />
                      </div>
                    )}
                    <div className="mt-4 md:hidden">
                      <FollowStats
                        {...{
                          following,
                          following_count,
                          followers,
                          followersCount,
                          isMyProfile,
                          setShowFollowing,
                          setShowFollowers,
                        }}
                      />
                    </div>
                    <div className="mt-4 md:hidden">
                      {isAuthenticated && !isMyProfile && (
                        <FollowersInCommon profileId={profile_id} />
                      )}
                    </div>
                    <LinkCollection
                      className="md:hidden"
                      links={links}
                      website_url={website_url}
                      slug_address={slug_address}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CappedWidth>
          {spotlightItem ? (
            <div className="mt-8 md:mt-12">
              <div className="relative bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-800 pb-8 md:py-12">
                <SpotlightItem
                  item={spotlightItem}
                  removeSpotlightItem={() => {
                    handleChangeSpotlightItem(null);
                    mixpanel.track("Removed Spotlight Item");
                  }}
                  isMyProfile={isMyProfile}
                  listId={0}
                  key={spotlightItem.nft_id}
                  pageProfile={{
                    profile_id,
                    slug_address,
                    name,
                    img_url,
                    wallet_addresses_excluding_email_v2,
                    website_url,
                    username,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="my-8" />
          )}
          <CappedWidth>
            <div className="m-auto">
              <div ref={gridRef} className="pt-0 ">
                <div className="lg:col-span-2 xl:col-span-3 min-h-screen">
                  {menuLists && menuLists.length > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:px-3 md:my-2">
                      <div className="flex items-center w-full md:w-auto">
                        <button
                          onClick={() => handleListChange(1)}
                          className={`flex-1 md:flex-initial px-4 py-3 space-x-2 flex items-center justify-center md:justify-start border-b-2 ${
                            selectedGrid === 1
                              ? "border-gray-800 dark:border-gray-300"
                              : "border-gray-200 dark:border-gray-700"
                          } transition`}
                        >
                          <FingerprintIcon className="hidden md:block w-5 h-5 dark:text-gray-500" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-800 dark:text-gray-300">
                              Created
                            </span>{" "}
                            <span className="hidden md:inline">
                              {menuLists && menuLists.length > 0
                                ? Number(
                                    menuLists[0].count_deduplicated_nonhidden
                                  ).toLocaleString()
                                : null}
                            </span>
                          </p>
                        </button>
                        <button
                          onClick={() => handleListChange(2)}
                          className={`flex-1 md:flex-initial px-4 py-3 space-x-2 flex items-center justify-center md:justify-start border-b-2 ${
                            selectedGrid === 2
                              ? "border-gray-800 dark:border-gray-300"
                              : "border-gray-200 dark:border-gray-700"
                          } transition`}
                        >
                          <WalletIcon className="hidden md:block w-5 h-5 dark:text-gray-500" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-800 dark:text-gray-300">
                              Owned
                            </span>{" "}
                            <span className="hidden md:inline">
                              {menuLists && menuLists.length > 0
                                ? Number(
                                    menuLists[1].count_deduplicated_nonhidden
                                  ).toLocaleString()
                                : null}
                            </span>
                          </p>
                        </button>
                        <button
                          onClick={() => handleListChange(3)}
                          className={`flex-1 md:flex-initial px-4 py-3 space-x-2 flex items-center justify-center md:justify-start border-b-2 ${
                            selectedGrid === 3
                              ? "border-gray-800 dark:border-gray-300"
                              : "border-gray-200 dark:border-gray-700"
                          } transition`}
                        >
                          <HeartIcon className="hidden md:block w-5 h-5 dark:text-gray-500" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-800 dark:text-gray-300">
                              Liked
                            </span>{" "}
                            <span className="hidden md:inline">
                              {menuLists && menuLists.length > 0
                                ? Number(
                                    menuLists[2].count_deduplicated_nonhidden
                                  ).toLocaleString()
                                : null}
                            </span>
                          </p>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 w-full md:w-auto px-3 md:px-0">
                        {(selectedGrid === 1 || selectedGrid === 2) &&
                          isMyProfile &&
                          !context.isMobile &&
                          !isRefreshingCards &&
                          collectionId == 0 && (
                            <div>
                              {isChangingOrder &&
                                ((selectedGrid === 1 &&
                                  selectedCreatedSortField === 5) ||
                                  (selectedGrid === 2 &&
                                    selectedOwnedSortField === 5)) && (
                                  <>
                                    <div
                                      className="cursor-pointer mr-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-red-100 bg-red-600 hover:bg-red-700 focus:outline-none"
                                      onClick={handleCancelOrder}
                                    >
                                      Cancel
                                    </div>
                                    <div
                                      className="cursor-pointer mr-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-green-100 bg-green-600 hover:bg-green-700 focus:outline-none"
                                      onClick={handleSaveOrder}
                                    >
                                      Save Order
                                    </div>
                                  </>
                                )}
                            </div>
                          )}
                        {!isChangingOrder && (
                          <>
                            <Dropdown
                              className="w-1/2 md:w-auto md:flex-1"
                              options={
                                menuLists &&
                                menuLists[selectedGrid - 1].collections.map(
                                  (item) => ({
                                    value: item.collection_id,
                                    label: item.collection_name?.replace(
                                      " (FND)",
                                      ""
                                    ),
                                    img_url: item.collection_img_url
                                      ? item.collection_img_url
                                      : DEFAULT_PROFILE_PIC,
                                  })
                                )
                              }
                              value={collectionId}
                              onChange={handleCollectionChange}
                              disabled={isChangingOrder}
                            />
                            <Dropdown
                              className="w-1/2 md:w-auto md:flex-1"
                              options={sortingOptionsList.filter((opts) =>
                                menuLists[selectedGrid - 1].has_custom_sort
                                  ? true
                                  : opts.value !== 5
                              )}
                              value={
                                selectedGrid === 1
                                  ? selectedCreatedSortField
                                  : selectedGrid === 2
                                  ? selectedOwnedSortField
                                  : selectedLikedSortField
                              }
                              onChange={handleSortChange}
                              disabled={isChangingOrder}
                            />

                            {(selectedGrid === 1 || selectedGrid === 2) &&
                              isMyProfile &&
                              !context.isMobile &&
                              !isRefreshingCards &&
                              collectionId == 0 &&
                              items?.length > 0 && (
                                <Menu
                                  as="div"
                                  className="relative inline-block text-left ml-2"
                                >
                                  <>
                                    <div>
                                      <Menu.Button
                                        disabled={isChangingOrder}
                                        className={({ open }) =>
                                          `flex items-center justify-center text-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-gray-800 p-1 -m-1 rounded-lg ${
                                            open
                                              ? "bg-gray-100 dark:bg-gray-800"
                                              : ""
                                          } transition`
                                        }
                                      >
                                        <DotsHorizontalIcon
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </Menu.Button>
                                    </div>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Menu.Items className="z-1 absolute right-0 mt-2 origin-top-right border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-4 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              onClick={handleClickChangeOrder}
                                              className={classNames(
                                                active
                                                  ? "text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                                                  : "text-gray-900 dark:text-gray-400",
                                                "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                                              )}
                                            >
                                              <span className="block truncate font-medium">
                                                Customize Order
                                              </span>
                                            </button>
                                          )}
                                        </Menu.Item>
                                        {myProfile &&
                                          ((selectedGrid === 1 &&
                                            myProfile.default_created_sort_id ===
                                              5) ||
                                            (selectedGrid === 2 &&
                                              myProfile.default_owned_sort_id ===
                                                5) ||
                                            menuLists[selectedGrid - 1]
                                              .has_custom_sort) && (
                                            <Menu.Item>
                                              {({ active }) => (
                                                <button
                                                  onClick={
                                                    handleClickDeleteCustomOrder
                                                  }
                                                  className={classNames(
                                                    active
                                                      ? "text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                                                      : "text-gray-900 dark:text-gray-400",
                                                    "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                                                  )}
                                                >
                                                  <span className="block truncate font-medium">
                                                    Remove Custom Order
                                                  </span>
                                                </button>
                                              )}
                                            </Menu.Item>
                                          )}
                                        {hasUserHiddenItems && (
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                onClick={() =>
                                                  handleShowHiddenChange(
                                                    !showUserHiddenItems
                                                  )
                                                }
                                                className={classNames(
                                                  active
                                                    ? "text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                                                    : "text-gray-900 dark:text-gray-400",
                                                  "cursor-pointer select-none rounded-xl py-3 pl-3 w-full text-left"
                                                )}
                                              >
                                                <span className="block truncate font-medium">
                                                  {showUserHiddenItems
                                                    ? "Hide Hidden"
                                                    : "Show Hidden"}
                                                </span>
                                              </button>
                                            )}
                                          </Menu.Item>
                                        )}
                                      </Menu.Items>
                                    </Transition>
                                  </>
                                </Menu>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 md:mt-8 md:mx-4">
                    {menuLists && menuLists.length > 0 && (
                      <TokenGridV5
                        dataLength={items.length}
                        next={() => addPage(page + 1)}
                        hasMore={hasMore}
                        endMessage={
                          !isRefreshingCards &&
                          !isLoadingMore &&
                          collectionId == 0 ? (
                            menuLists[selectedGrid - 1].count_all_nonhidden >
                            menuLists[selectedGrid - 1]
                              .count_deduplicated_nonhidden ? (
                              !showDuplicates ? (
                                <div className="text-center text-gray-400 text-xs mt-6">
                                  Some duplicate items were hidden.{" "}
                                  <span
                                    className="cursor-pointer hover:text-gray-700"
                                    onClick={() => handleShowDuplicates(true)}
                                  >
                                    Show all
                                  </span>
                                </div>
                              ) : (
                                <div className="text-center text-gray-400 text-xs mt-6">
                                  <span
                                    className="cursor-pointer hover:text-gray-700"
                                    onClick={() => handleShowDuplicates(false)}
                                  >
                                    Hide duplicates
                                  </span>
                                </div>
                              )
                            ) : null
                          ) : null
                        }
                        scrollThreshold={page < 4 ? 0.5 : page < 6 ? 0.7 : 0.8}
                        showUserHiddenItems={showUserHiddenItems}
                        showDuplicates={showDuplicates}
                        setHasUserHiddenItems={setHasUserHiddenItems}
                        key={`grid___${isRefreshingCards}`}
                        items={items}
                        setItems={setItems}
                        isLoading={isRefreshingCards}
                        isLoadingMore={isLoadingMore}
                        listId={selectedGrid}
                        isMyProfile={isMyProfile}
                        detailsModalCloseOnKeyChange={slug_address}
                        changeSpotlightItem={handleChangeSpotlightItem}
                        pageProfile={{
                          profile_id,
                          slug_address,
                          name,
                          img_url,
                          wallet_addresses_excluding_email_v2,
                          website_url,
                          username,
                        }} // to customize owned by list on bottom of card
                        isChangingOrder={isChangingOrder}
                        refreshCurrent={() => handleListChange(selectedGrid)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* End Page Body */}
          </CappedWidth>
        </div>
      </Layout>
    </div>
  );
};

const FollowStats = ({
  following_count,
  followersCount,
  isMyProfile,
  setShowFollowing,
  setShowFollowers,
}) => {
  const context = useContext(AppContext);

  return (
    <div className="flex items-center space-x-6 md:space-x-4 lg:space-x-6">
      <button
        className="cursor-pointer hover:opacity-80 transition"
        onClick={() => setShowFollowing(true)}
      >
        <div className="text-sm dark:text-gray-300 whitespace-nowrap">
          <span className="font-semibold">
            {Number(
              isMyProfile && context.myFollows
                ? context.myFollows.length
                : following_count
            ).toLocaleString()}
          </span>{" "}
          following
        </div>
      </button>
      <button
        className="cursor-pointer hover:opacity-80 transition"
        onClick={() => setShowFollowers(true)}
      >
        <div className="text-sm dark:text-gray-300 whitespace-nowrap">
          <span className="font-semibold">
            {Number(followersCount).toLocaleString()}
          </span>{" "}
          followers
        </div>
      </button>
    </div>
  );
};

const LinkCollection = ({
  links,
  website_url,
  slug_address,
  className = "",
}) => (
  <div className={`mt-4 md:mt-0 space-y-4 md:space-y-10 ${className}`}>
    <div className="space-x-2 md:text-right">
      {website_url && (
        <Tippy
          content={
            new URL(
              website_url.slice(0, 4) === "http"
                ? website_url
                : "https://" + website_url
            ).hostname
          }
        >
          <a
            href={
              website_url.slice(0, 4) === "http"
                ? website_url
                : "https://" + website_url
            }
            target="_blank"
            onClick={() =>
              mixpanel.track("Clicked profile website link", {
                slug: slug_address,
              })
            }
            className="inline-block"
            rel="noreferrer"
          >
            <div className="text-gray-500 hover:opacity-80 dark:hover:opacity-80 border dark:border-gray-700 rounded-full p-1">
              <GlobeIcon className="flex-shrink-0 h-6 w-6 opacity-70 dark:opacity-100" />
            </div>
          </a>
        </Tippy>
      )}
      {links &&
        links.map((link) => (
          <Tippy content={link.name || link.type__name} key={link.type_id}>
            <a
              href={
                `https://${link.prefix ? link.prefix : link.type__prefix}` +
                link.user_input
              }
              target="_blank"
              onClick={() =>
                mixpanel.track(
                  `Clicked ${
                    link.name ? link.name : link.type__name
                  } profile link`,
                  {
                    slug: slug_address,
                  }
                )
              }
              className="inline-block"
              rel="noreferrer"
            >
              <div className="text-gray-500 hover:opacity-80 dark:hover:opacity-80 border dark:border-gray-700 rounded-full p-1">
                <img
                  src={link.icon_url || link.type__icon_url}
                  alt={`${link.name ? link.name : link.type__name} icon`}
                  className="flex-shrink-0 h-6 w-6 opacity-70 dark:opacity-100 filter dark:brightness-200"
                />
              </div>
            </a>
          </Tippy>
        ))}
    </div>
  </div>
);

export default Profile;
