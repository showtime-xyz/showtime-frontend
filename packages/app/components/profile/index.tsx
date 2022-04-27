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

import { Skeleton, Spinner, View } from "design-system";
import { Hidden } from "design-system/hidden";
import { useColorScheme, useIsDarkMode } from "design-system/hooks";
import { SelectedTabIndicator, TabItem, Tabs } from "design-system/tabs";
import { tw } from "design-system/tailwind";

import { FillterContext } from "./fillter-context";
import { ProfileListFilter } from "./profile-tab-filter";
import { ProfileTabList } from "./profile-tab-list";
import { ProfileTop } from "./profile-top";

const ProfileScreen = ({ username }: { username: string }) => {
  return <Profile address={username} />;
};

const Profile = ({ address }: { address?: string }) => {
  const { data: profileData } = useUserProfile({ address });
  const { data, loading: tabsLoading } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });
  // const router = useRouter();
  const { getIsBlocked } = useBlock();
  const isBlocked = getIsBlocked(profileData?.data?.profile.profile_id);

  const [selected, setSelected] = useState(0);
  const colorScheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const isDark = useIsDarkMode();
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
    <FillterContext.Provider value={{ filter, dispatch }}>
      <View tw="w-full items-center web:mb-8">
        <Tabs.Root
          onIndexChange={setSelected}
          initialIndex={selected}
          tabListHeight={TAB_LIST_HEIGHT}
          lazy
        >
          <Tabs.Header>
            <View tw="bg-white dark:bg-black items-center z-10">
              <View tw="w-full web:max-w-screen-xl">
                {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
                <ProfileTop address={address} isBlocked={isBlocked} />
                <Hidden until="md">
                  <View tw={"absolute right-10 z-10 -bottom-10"}>
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
                </Hidden>
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
                    <ErrorBoundary>
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
    </FillterContext.Provider>
  );
};

export { ProfileScreen as Profile };
