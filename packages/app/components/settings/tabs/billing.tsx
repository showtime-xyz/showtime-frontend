import { useCallback, memo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { format } from "date-fns";

import { Button } from "@showtime-xyz/universal.button";
import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  CreditCard,
  Check,
  ArrowBottom,
  Trash,
} from "@showtime-xyz/universal.icon";
import { Spinner } from "@showtime-xyz/universal.spinner";
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
  usePaymentsManege,
} from "app/hooks/api/use-payments-manage";
import { exportFromJSON } from "app/lib/export-from-json";

import { breakpoints } from "design-system/theme";

import { SettingItemSeparator } from "../setting-item-separator";
import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

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
            {` ${data.details.exp_year
              .toString()
              .substring(data.details.exp_year.toString().length - 2)}/${
              data.details.exp_month
            }`}
          </Text>
        </View>
      </View>
      <View tw="flex-row">
        <Button
          size="small"
          variant="tertiary"
          style={data.is_default ? { backgroundColor: colors.lime[200] } : {}}
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
  data,
}: {
  data: PaymentsHistory;
}) {
  const isDark = useIsDarkMode();
  const onDowloadHistory = useCallback(() => {
    // Todo: waiting for backend to confirm whether exporting from the frontend is possible and also for the final data format.
    exportFromJSON({
      data: [data],
      fileName: `${data.payment_intent_id}-${new Date().getTime()}`,
      exportType: "csv",
    });
  }, [data]);
  return (
    <View tw="flex-row justify-between py-3.5">
      <View tw="flex-col items-start justify-center md:flex-row md:items-center">
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          {data.amount}
        </Text>
        <View tw="h-2 w-0 md:w-6" />
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          {data.receipt_email}
        </Text>
        <View tw="h-2 w-0 md:w-6" />
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          {format(new Date(data.created_at), "MMM dd, Y")}
        </Text>
      </View>
      <View tw="flex-row">
        <Button
          size="small"
          variant="tertiary"
          iconOnly
          onPress={onDowloadHistory}
        >
          <ArrowBottom color={isDark ? colors.white : colors.black} />
        </Button>
      </View>
    </View>
  );
});
export const History = memo(function History() {
  const { data, isLoading } = usePaymentsHistory();

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
    <View>
      <SettingsTitle
        title="History"
        titleTw="text-lg font-bold text-gray-900 dark:text-white"
        buttonText={data?.length ? "Download full history" : undefined}
        buttonProps={{
          variant: "tertiary",
        }}
        tw="-mx-4 md:mx-0"
        onPress={onDowloadAllHistory}
      />
      {isLoading ? (
        <View tw="animate-fade-in-250 h-28 items-center justify-center">
          <Spinner />
        </View>
      ) : data?.length === 0 ? (
        <EmptyPlaceholder
          tw="animate-fade-in-250 min-h-[60px] px-4"
          title="No payment history here."
        />
      ) : (
        <View tw="animate-fade-in-250">
          {data?.map((item) => (
            <HistoryItem key={item.payment_intent_id} data={item} />
          ))}
        </View>
      )}
    </View>
  );
});
export const BillingTab = ({ index = 0 }: BillingTabProps) => {
  const { data, isLoading, removePayment, setPaymentByDefault } =
    usePaymentsManege();
  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Billing"
        desc="Manage the payment methods connected to your profile."
        // Todo: this is waiting for backend support.
        // buttonText="Add payment method"
        // onPress={() => {}}
      />
      <View tw="mt-6 px-4 md:px-0">
        {isLoading ? (
          <View tw="animate-fade-in-250 h-28 items-center justify-center">
            <Spinner />
          </View>
        ) : data?.length === 0 ? (
          <EmptyPlaceholder
            tw="animate-fade-in-250 min-h-[60px] px-4"
            title="No payment connected to your profile."
          />
        ) : (
          <View tw="animate-fade-in-250">
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
        <History />
      </View>
    </SettingScrollComponent>
  );
};
