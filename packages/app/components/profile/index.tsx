import { Suspense, useCallback, useReducer, useState } from "react";
import { Platform } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import {
  defaultFilters,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";

import { Skeleton, Spinner, View } from "design-system";
import { Hidden } from "design-system/hidden";
import { useColorScheme } from "design-system/hooks";
import { SelectedTabIndicator, TabItem, Tabs } from "design-system/tabs";
import { tw } from "design-system/tailwind";

import { FilterContext } from "./fillter-context";
import { ProfileListFilter } from "./profile-tab-filter";
import { ProfileTabList } from "./profile-tab-list";
import { ProfileTop } from "./profile-top";

type Query = {
  tab: number;
};

const { useParam } = createParam<Query>();

const ProfileScreen = ({ username }: { username: string | null }) => {
  return <Profile address={username} />;
};

const Profile = ({ address }: { address: string | null }) => {
  const { data: profileData } = useUserProfile({ address });
  const { data, loading: tabsLoading } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });
  const [selected, setSelected] = useParam("tab", {
    parse: (v) => Number(v ?? 0),
    initial: 0,
  });

  const { getIsBlocked } = useBlock();
  const isBlocked = getIsBlocked(profileData?.data?.profile.profile_id);

  const colorScheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const [filter, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case "collection_change":
          return { ...state, collectionId: action.payload };
        case "sort_change":
          return { ...state, sortId: action.payload };
      }
    },
    { ...defaultFilters }
  );
  const onCollectionChange = useCallback(
    (value) => {
      dispatch({ type: "collection_change", payload: value });
    },
    [dispatch]
  );

  const onSortChange = useCallback(
    (value) => {
      dispatch({ type: "sort_change", payload: value });
    },
    [dispatch]
  );
  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      <View tw="web:items-center w-full flex-1 overflow-hidden">
        <Tabs.Root
          onIndexChange={setSelected}
          index={selected}
          tabListHeight={TAB_LIST_HEIGHT}
          lazy
        >
          <Tabs.Header>
            <View tw="z-10 items-center bg-white dark:bg-black">
              <View tw="web:max-w-screen-xl w-full">
                {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
                <ProfileTop address={address} isBlocked={isBlocked} />
                {Platform.OS === "web" && (
                  <View tw="-bottom-26 absolute w-full justify-between md:right-10 md:-bottom-10 md:w-auto">
                    <ProfileListFilter
                      onCollectionChange={onCollectionChange}
                      onSortChange={onSortChange}
                      collectionId={filter.collectionId}
                      collections={
                        data?.data?.lists[selected]?.collections || []
                      }
                      sortId={filter.sortId}
                    />
                  </View>
                )}
              </View>
            </View>
          </Tabs.Header>

          {data?.data.lists ? (
            <>
              <Tabs.List
                style={tw.style(`h-[${TAB_LIST_HEIGHT}px] w-full self-center`)}
              >
                {data?.data.lists.map((list, index) => (
                  <Tabs.Trigger key={list.id}>
                    <TabItem name={list.name} selected={selected === index} />
                  </Tabs.Trigger>
                ))}
                <SelectedTabIndicator />
              </Tabs.List>

              <Tabs.Pager>
                {data?.data.lists.map((list) => {
                  return (
                    <ErrorBoundary key={list.id}>
                      <Suspense
                        fallback={
                          <View tw="items-center justify-center pt-20">
                            <Spinner size="small" />
                          </View>
                        }
                        key={list.id}
                      >
                        <ProfileTabList
                          username={profileData?.data.profile.username}
                          profileId={profileData?.data.profile.profile_id}
                          isBlocked={isBlocked}
                          list={list}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  );
                })}
              </Tabs.Pager>
            </>
          ) : tabsLoading ? (
            <Tabs.List
              style={tw.style(
                `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900 ml-4 mt-4`
              )}
            >
              <Tabs.Trigger>
                <View tw="w-22">
                  <Skeleton colorMode={colorScheme} width={74} height={20} />
                </View>
              </Tabs.Trigger>
              <Tabs.Trigger>
                <View tw="w-22">
                  <Skeleton colorMode={colorScheme} width={74} height={20} />
                </View>
              </Tabs.Trigger>
              <Tabs.Trigger>
                <View tw="w-20">
                  <Skeleton colorMode={colorScheme} width={70} height={20} />
                </View>
              </Tabs.Trigger>
            </Tabs.List>
          ) : null}
        </Tabs.Root>
      </View>
    </FilterContext.Provider>
  );
};

export { ProfileScreen as Profile };
