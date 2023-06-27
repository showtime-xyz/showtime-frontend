import { useCallback, memo } from "react";
import { useWindowDimensions, Platform, Linking } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";
import { format } from "date-fns";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CreditCard, Check, Trash } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabInfiniteScrollList } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import {
  PaymentsHistory,
  usePaymentsHistory,
} from "app/hooks/api/use-payments-history";
import {
  PaymentsMethods,
  usePaymentsManage,
} from "app/hooks/api/use-payments-manage";
import { exportFromJSON } from "app/lib/export-from-json";

import {
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "design-system/dropdown-menu";
import { MoreHorizontal, Receipt } from "design-system/icon";
import { breakpoints } from "design-system/theme";

import { MenuItemIcon } from "../../dropdown/menu-item-icon";
import { SettingItemSeparator } from "../setting-item-separator";
import { SettingsTitle } from "../settings-title";

const ListComponent =
  Platform.OS === "web" ? InfiniteScrollList : TabInfiniteScrollList;

export type BillingTabProps = {
  index?: number;
};
type CreditCardItemProps = {
  data: PaymentsMethods;
  removePayment?: () => void;
  setPaymentByDefault?: () => void;
};
const CreditCardItem = ({
  data,
  removePayment,
  setPaymentByDefault,
}: CreditCardItemProps) => {
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  return (
    <View tw="flex-row justify-between py-3.5">
      <View tw="flex-row items-center justify-center">
        <View tw="self-start md:self-center">
          <CreditCard
            width={isMdWidth ? 24 : 16}
            height={isMdWidth ? 24 : 16}
            color={isDark ? colors.white : colors.black}
          />
        </View>
        <View tw="ml-2 flex-col items-start md:ml-0 md:flex-row md:items-center">
          <Text tw="ml-0 text-sm font-medium text-gray-900 dark:text-white md:ml-2 md:text-base">
            Ending in {data.details.last4}
          </Text>
          <View tw="mx-2 h-2 w-0 rounded-full bg-black dark:bg-white md:h-[2px] md:w-[2px]" />
          <Text tw="text-sm font-medium text-gray-500 dark:text-gray-200 md:text-base">
            Expiry
            {` ${data.details.exp_year}/${data.details.exp_month}`}
          </Text>
        </View>
      </View>
      <View tw="flex-row">
        <Button
          size="small"
          variant="tertiary"
          style={data.is_default ? { backgroundColor: colors.lime[200] } : {}}
          disabled={data.is_default}
          onPress={setPaymentByDefault}
        >
          {data.is_default ? (
            <>
              <Check color={colors.gray[900]} />
              <Text tw="ml-1 text-xs font-bold">Set as Default</Text>
            </>
          ) : (
            "Set as Default"
          )}
        </Button>
        <Button
          size="small"
          tw="ml-2"
          iconOnly={!isMdWidth}
          variant={isMdWidth ? "tertiary" : "danger"}
          onPress={removePayment}
        >
          {isMdWidth ? "Remove" : <Trash />}
        </Button>
      </View>
    </View>
  );
};
const HistoryItem = memo(function HistoryItem({
  item,
}: {
  item: PaymentsHistory;
}) {
  return (
    <View tw="flex-row justify-between px-4 py-3.5 lg:px-0">
      <View tw="flex-col items-start justify-center md:flex-row md:items-center">
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          {item.amount}
        </Text>
        <View tw="h-2 w-0 md:w-6" />
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          {item.receipt_email}
        </Text>
        <View tw="h-2 w-0 md:w-6" />
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          {format(new Date(item.created_at), "MMM dd, Y")}
        </Text>
      </View>
      <View tw="h-8 flex-row">
        {item?.receipts?.length > 0 && (
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <Button variant="tertiary" iconOnly>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent loop sideOffset={8}>
              {item.receipts.map((link, index) => {
                return (
                  <DropdownMenuItem
                    onSelect={() => Linking.openURL(link)}
                    key={link}
                  >
                    <MenuItemIcon Icon={Receipt} />
                    <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                      {`View Receipt ${
                        item.receipts.length > 1 ? `#${index + 1}` : ``
                      }`}
                    </DropdownMenuItemTitle>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenuRoot>
        )}
      </View>
    </View>
  );
});

const Header = memo(function Header() {
  const { data, isLoading, removePayment, setPaymentByDefault } =
    usePaymentsManage();
  const onDowloadAllHistory = useCallback(() => {
    if (!data) return;
    // Todo: waiting for backend to confirm whether exporting from the frontend is possible and also for the final data format.
    exportFromJSON({
      data: data,
      fileName: `payments-full-history-${new Date().getTime()}`,
      exportType: "csv",
    });
  }, [data]);
  return (
    <>
      <SettingsTitle
        title="Billing"
        desc="Manage the payment methods connected to your profile."
        // Todo: this is waiting for backend support.
        // buttonText="Add payment method"
        // onPress={() => {
        //   router.push(
        //     {
        //       pathname: router.pathname,
        //       query: {
        //         ...router.query,
        //         checkoutModal: true,
        //       },
        //     },
        //     router.asPath
        //   );
        // }}
      />
      {isLoading ? (
        <View tw="animate-fade-in-250 h-28 items-center justify-center">
          <Spinner />
        </View>
      ) : data?.length === 0 ? (
        <EmptyPlaceholder
          tw="animate-fade-in-250 min-h-[100px]"
          title="No payment connected to your profile."
        />
      ) : (
        <View tw="animate-fade-in-250 mt-4 px-4 md:mt-8 lg:px-0">
          {data?.map((item) => (
            <CreditCardItem
              key={item.id}
              data={item}
              removePayment={() => removePayment(item.id)}
              setPaymentByDefault={() => setPaymentByDefault(item.id)}
            />
          ))}
        </View>
      )}
      <SettingItemSeparator tw="my-2 md:my-8" />
      <SettingsTitle
        title="History"
        titleTw="text-lg font-bold text-gray-900 dark:text-white"
        // buttonText={listData?.length ? "Download full history" : undefined}
        buttonProps={{
          variant: "tertiary",
        }}
        onPress={onDowloadAllHistory}
      />
      <View tw="h-2" />
    </>
  );
});

export const BillingTab = ({ index = 0 }: BillingTabProps) => {
  const {
    data: listData,
    isLoading: isLoadingList,
    fetchMore,
    isLoadingMore,
  } = usePaymentsHistory();
  const { height: screenHeight, width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const keyExtractor = useCallback(
    (item: PaymentsHistory) => `${item.payment_intent_id}`,
    []
  );

  const renderItem = useCallback(
    (props: ListRenderItemInfo<PaymentsHistory>) => <HistoryItem {...props} />,
    []
  );
  const ListFooterComponent = useCallback(() => {
    if (isLoadingMore)
      return (
        <View tw="items-center pb-4">
          <Spinner size="small" />
        </View>
      );
    return null;
  }, [isLoadingMore]);

  const ListEmptyComponent = useCallback(() => {
    if (isLoadingList) {
      return null;
    }
    return (
      <EmptyPlaceholder
        tw="animate-fade-in-250 min-h-[100px] px-4"
        title="No payment history here."
      />
    );
  }, [isLoadingList]);

  return (
    <>
      {isLoadingList ? (
        <View tw="animate-fade-in-250 h-28 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ListComponent
          data={listData}
          keyExtractor={keyExtractor}
          useWindowScroll={isMdWidth}
          estimatedItemSize={60}
          ListHeaderComponent={Header}
          style={{
            height: isMdWidth ? undefined : screenHeight - 200,
            minHeight: isMdWidth ? 400 : undefined,
          }}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          onEndReached={fetchMore}
          renderItem={renderItem}
          index={index}
        />
      )}
    </>
  );
};
