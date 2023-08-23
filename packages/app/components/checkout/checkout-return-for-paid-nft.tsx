import { useCallback, useContext, memo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useEffectOnce } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useJoinChannel } from "app/components/creator-channels/hooks/use-join-channel";
import { ClaimContext } from "app/context/claim-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useConfirmPayment } from "app/hooks/api/use-confirm-payment";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { createParam } from "app/navigation/use-param";
import { NFT } from "app/types";

import { stripePromise } from "../checkout/stripe";

const { useParam } = createParam<{
  contractAddress: string;
  isPaid?: string;
  paymentIntentId?: string;
  onRampMerchantId?: string;
}>();

export const CheckoutReturnForPaidNFT = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  const { data: nft } = useNFTDetailByTokenId({
    chainName: edition?.chain_name,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });

  if (!edition || !nft)
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  return <CheckoutReturn edition={edition} nft={nft.data.item} />;
};

const CheckoutReturn = memo(function CheckoutReturn({
  edition,
  nft,
}: {
  edition: CreatorEditionResponse;
  nft: NFT;
}) {
  const joinChannel = useJoinChannel();
  const [paymentIntentIdParam] = useParam("paymentIntentId");
  const [onRampMerchantId] = useParam("onRampMerchantId");

  const { state } = useContext(ClaimContext);

  const router = useRouter();
  const { claimNFT } = useClaimNFT(edition?.creator_airdrop_edition);
  const { paymentStatus, message, confirmPaymentStatus, confirmOnRampStatus } =
    useConfirmPayment();
  const myInfo = useMyInfo();

  const closeModal = useCallback(
    async (channelId?: number) => {
      await myInfo.mutateLastCollectedStarDropCache({
        contractAddress: edition.creator_airdrop_edition.contract_address,
        username: nft.creator_username ?? nft.creator_address,
        slug: nft.slug ?? nft.creator_address,
      });
      await joinChannel.trigger({ channelId: channelId });
      const { asPath, pathname } = router;

      const pathWithoutQuery = asPath.split("?")[0];

      router.replace(
        {
          // Notes: Because we have rewritten the profile route pathname, we need to handle it specially.
          pathname: pathname.includes("/profile") ? pathWithoutQuery : pathname,
          query: {
            contractAddress: edition?.creator_airdrop_edition.contract_address,
            unlockedChannelModal: true,
          },
        },
        pathWithoutQuery,
        {
          shallow: true,
        }
      );
    },
    [
      edition.creator_airdrop_edition.contract_address,
      joinChannel,
      myInfo,
      nft.creator_address,
      nft.creator_username,
      nft.slug,
      router,
    ]
  );
  const { setPaymentByDefault } = usePaymentsManage();

  const handlePaymentSuccess = useCallback(async () => {
    // Payment is of type onramp
    if (onRampMerchantId) {
      await confirmOnRampStatus(onRampMerchantId);
    } else {
      const setAsDefaultPaymentMethod = new URLSearchParams(
        window.location.search
      ).get("setAsDefaultPaymentMethod");

      const stripe = await stripePromise();

      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      let paymentIntentId = paymentIntentIdParam;
      if (stripe && clientSecret) {
        const res = await stripe.retrievePaymentIntent(clientSecret);
        if (typeof res.paymentIntent?.payment_method === "string") {
          if (setAsDefaultPaymentMethod) {
            setPaymentByDefault(res.paymentIntent.payment_method);
          }
        }
        if (!paymentIntentId) {
          paymentIntentId = res.paymentIntent?.id;
        }
      }

      if (paymentIntentId) {
        await confirmPaymentStatus(paymentIntentId);
      }
    }

    await claimNFT({ closeModal });
  }, [
    onRampMerchantId,
    claimNFT,
    closeModal,
    confirmOnRampStatus,
    paymentIntentIdParam,
    setPaymentByDefault,
    confirmPaymentStatus,
  ]);

  useEffectOnce(() => {
    handlePaymentSuccess();
  });

  if (state.status === "error") {
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center px-8">
        <Text
          tw={`text-center text-lg font-extrabold leading-6 text-gray-900 dark:text-gray-100`}
        >
          {state.error}
        </Text>
        <Button tw="mt-4" onPress={() => router.pop()}>
          Got it.
        </Button>
      </View>
    );
  }

  return (
    <View tw="min-h-[200px] flex-1 items-center justify-center">
      {paymentStatus === "processing" ? (
        <>
          <Text tw="p-8 text-center text-base text-gray-900 dark:text-gray-50">
            {message}
          </Text>
        </>
      ) : null}

      {paymentStatus === "failed" ? (
        <View>
          <Text tw="text-4xl font-bold text-gray-900 dark:text-gray-50">
            Payment Failed
          </Text>
          <Text tw="p-8 text-center text-base text-gray-900 dark:text-gray-50">
            {message}
          </Text>
          <Button
            onPress={() => {
              router.pop();
            }}
            size="regular"
          >
            Try again
          </Button>
        </View>
      ) : null}

      {paymentStatus === "notSure" ? (
        <>
          <Text tw=" text-4xl font-bold text-gray-900 dark:text-gray-50">
            Something went wrong
          </Text>
          <Text tw="p-8 text-center text-base text-gray-900 dark:text-gray-50">
            {message}
          </Text>
        </>
      ) : null}

      <Spinner />
    </View>
  );
});
