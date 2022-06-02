import { Suspense, useCallback, useReducer } from "react";
import { Platform } from "react-native";

import { useColorScheme } from "@showtime-xyz/universal.hooks";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import {
  defaultFilters,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { Haptics } from "app/lib/haptics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";

import { SelectedTabIndicator, TabItem, Tabs } from "design-system/tabs";

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

type Filter = typeof defaultFilters;

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
    (state: Filter, action: any): Filter => {
      switch (action.type) {
        case "collection_change":
          return { ...state, collectionId: action.payload };
        case "sort_change":
          return { ...state, sortType: action.payload };
        default:
          return state;
      }
    },
    { ...defaultFilters }
  );

  const handleTabOnPress = useCallback(() => {
    Haptics.impactAsync();
  }, []);

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
                      collections={data?.tabs[selected]?.collections || []}
                    />
                  </View>
                )}
              </View>
            </View>
          </Tabs.Header>

          {data?.tabs ? (
            <>
              <Tabs.List
                onPressCallback={handleTabOnPress}
                style={tw.style(
                  `h-[${TAB_LIST_HEIGHT}px] bg-white dark:bg-black`
                )}
              >
                {data?.tabs.map((list, index) => (
                  <Tabs.Trigger key={list.type}>
                    <TabItem name={list.name} selected={selected === index} />
                  </Tabs.Trigger>
                ))}
                <SelectedTabIndicator />
              </Tabs.List>

              <Tabs.Pager>
                {data?.tabs.map((list) => {
                  return (
                    <ErrorBoundary key={list.type}>
                      <Suspense
                        fallback={
                          <View tw="items-center justify-center pt-20">
                            <Spinner size="small" />
                          </View>
                        }
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
