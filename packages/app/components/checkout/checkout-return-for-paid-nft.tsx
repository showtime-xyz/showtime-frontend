import { useCallback, useContext, useEffect, memo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useJoinChannel } from "app/components/creator-channels/hooks/use-join-channel";
import { ClaimContext } from "app/context/claim-context";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { createParam } from "app/navigation/use-param";

import { stripePromise } from "../checkout/stripe";
import { fetchStripeAccountId } from "../claim/claim-paid-nft-button";

const { useParam } = createParam<{
  contractAddress: string;
  isPaid?: string;
}>();

export const CheckoutReturnForPaidNFT = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  if (!edition)
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  return <CheckoutReturn edition={edition} />;
};

const CheckoutReturn = memo(function CheckoutReturn({
  edition,
}: {
  edition: CreatorEditionResponse;
}) {
  const joinChannel = useJoinChannel();

  const { state } = useContext(ClaimContext);
  const { data: nft } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });

  const channelId = nft?.data.item.creator_channel_id;
  const router = useRouter();
  const { claimNFT } = useClaimNFT(edition?.creator_airdrop_edition);

  const removeQueryParam = useCallback(() => {
    router.replace({ pathname: router.pathname }, undefined, {
      shallow: true,
    });
  }, [router]);
  const closeModal = useCallback(async () => {
    if (channelId) {
      await joinChannel.trigger({ channelId: channelId });
    }
    const { asPath, pathname } = router;

    const pathWithoutQuery = asPath.split("?")[0];

    router.replace(
      {
        pathname:
          pathname === "/profile/[username]/[dropSlug]"
            ? pathWithoutQuery
            : pathname,
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
  }, [
    channelId,
    edition?.creator_airdrop_edition.contract_address,
    joinChannel,
    router,
  ]);
  const { setPaymentByDefault } = usePaymentsManage();

  const handlePaymentSuccess = useCallback(async () => {
    const setAsDefaultPaymentMethod = new URLSearchParams(
      window.location.search
    ).get("setAsDefaultPaymentMethod");

    if (!setAsDefaultPaymentMethod) return;

    const profileId = edition?.creator_airdrop_edition.owner_profile_id;
    const { stripe_account_id: stripeAccount } = await fetchStripeAccountId(
      profileId
    );

    const stripe = await stripePromise({ stripeAccount });
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (stripe && clientSecret) {
      const res = await stripe.retrievePaymentIntent(clientSecret);
      if (typeof res.paymentIntent?.payment_method === "string") {
        setPaymentByDefault(res.paymentIntent.payment_method);
      }
    }
  }, [edition?.creator_airdrop_edition.owner_profile_id, setPaymentByDefault]);

  const initPaidNFT = useCallback(async () => {
    if (channelId) {
      handlePaymentSuccess();
      await claimNFT({ closeModal });
    }
  }, [channelId, claimNFT, closeModal, handlePaymentSuccess]);

  useEffect(() => {
    initPaidNFT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  if (state.status === "error") {
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center px-8">
        <Text
          tw={`text-center text-lg font-extrabold leading-6 text-gray-900 dark:text-gray-100`}
        >
          {state.error}
        </Text>
        <Button tw="mt-4" onPress={removeQueryParam}>
          Got it.
        </Button>
      </View>
    );
  }
  return (
    <View tw="min-h-[200px] flex-1 items-center justify-center">
      <Spinner />
    </View>
  );
});
