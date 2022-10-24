import { forwardRef } from "react";

import { TrendingTabListProps, TrendingTabListRef } from "./";

export const CreatorsList = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function CreatorsList() {
  return null;
  // const { data, isLoadingMore, isLoading, refresh, fetchMore } =
  //   useTrendingCreators({
  //     days,
  //   });
  // const separatorHeight = 8;
  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     refresh,
  //   }),
  //   [refresh]
  // );
  // const ListFooterComponent = useCallback(
  //   () => <ListFooter isLoading={isLoadingMore} />,
  //   [isLoadingMore]
  // );

  // const ItemSeparatorComponent = useCallback(
  //   () => (
  //     <View
  //       tw={`bg-gray-200 dark:bg-gray-800`}
  //       style={{ height: separatorHeight }}
  //     />
  //   ),
  //   []
  // );

  // const { width, height } = useWindowDimensions();
  // const router = useRouter();

  // let dataProvider = useMemo(
  //   () =>
  //     new DataProvider((r1, r2) => {
  //       return typeof r1 === "string" && typeof r2 === "string"
  //         ? r1 !== r2
  //         : r1.profile_id !== r2.profile_id;
  //     }).cloneWithRows(data),
  //   [data]
  // );

  // const mediaDimension = useWindowDimensions().width / 3;
  // const cardSize = 64 + mediaDimension + 16;

  // const cardHeight = cardSize + separatorHeight;

  // const _layoutProvider = useMemo(
  //   () =>
  //     new LayoutProvider(
  //       () => {
  //         return "item";
  //       },
  //       (_type, dim) => {
  //         dim.width = width;
  //         dim.height = cardHeight;
  //       }
  //     ),
  //   [width, cardHeight]
  // );

  // const _rowRenderer = useCallback(
  //   (_type: any, item: any) => {
  //     return (
  //       <>
  //         <CreatorPreview
  //           creator={item}
  //           onMediaPress={(initialScrollIndex: number) => {
  //             router.push(
  //               `/list?initialScrollIndex=${initialScrollIndex}&type=trendingCreator&days=${days}&creatorId=${item.profile_id}`
  //             );
  //           }}
  //           mediaSize={mediaDimension}
  //         />
  //         <ItemSeparatorComponent />
  //       </>
  //     );
  //   },
  //   [ItemSeparatorComponent, days, router, mediaDimension]
  // );

  // const layoutSize = useMemo(
  //   () => ({
  //     width,
  //     height,
  //   }),
  //   [width, height]
  // );
  // if (isLoading) {
  //   return <TabSpinner index={index} />;
  // }

  // if (data.length === 0 && !isLoading) {
  //   return (
  //     <TabScrollView
  //       contentContainerStyle={tw.style("mt-12 items-center")}
  //       index={index}
  //     >
  //       <EmptyPlaceholder title="No results found" hideLoginBtn />
  //     </TabScrollView>
  //   );
  // }
  // // Todo: replace to TabInfiniteScrollList when re-enabled this page.
  // return (
  //   <TabInfiniteScrollList
  //     numColumns={NUM_COLUMNS}
  //     data={data}
  //     ref={listRef}
  //     keyExtractor={keyExtractor}
  //     renderItem={renderItem}
  //     estimatedItemSize={contentWidth / NUM_COLUMNS}
  //     overscan={{
  //       main: contentWidth / NUM_COLUMNS,
  //       reverse: contentWidth / NUM_COLUMNS,
  //     }}
  //     ListFooterComponent={ListFooterComponent}
  //     index={index}
  //   />
  // );
});
