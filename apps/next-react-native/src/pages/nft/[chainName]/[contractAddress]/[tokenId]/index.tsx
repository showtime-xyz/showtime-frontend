import axios from "axios";
import Head from "next/head";

import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { NftScreen } from "app/screens/nft";
import { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

const NFTPage = ({ nft }: { nft: NFT }) => {
  let metaTags = null;
  if (nft) {
    // TODO: stillPreview true returns 404 for drops. This is not optimal for video drop NFTs.
    const imageUrl = getMediaUrl({ nft, stillPreview: false });

    metaTags = (
      <Head>
        <title>{nft.token_name} | Showtime</title>
        <meta name="description" content={nft.token_description} />

        {/* Open graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={nft.token_name} />
        <meta property="og:description" content={nft.token_description} />
        <meta property="og:image" content={imageUrl} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:title" content={nft.token_name} />
        <meta name="twitter:description" content={nft.token_description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
    );
  }

  return (
    <>
      {metaTags}
      <NftScreen />
    </>
  );
};

export async function getServerSideProps(context) {
  const { chainName, contractAddress, tokenId } = context.params;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/token/${contractAddress}/${tokenId}?chain_identifier=${CHAIN_IDENTIFIERS[chainName]}`
  );

  return {
    props: {
      nft: res.data?.data?.item,
    },
  };
}

export default NFTPage;
