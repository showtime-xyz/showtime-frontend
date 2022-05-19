const { ethers } = require("ethers");
const axios = require("axios").default;

const LOCAL_API = "http://localhost:8001";
const REMOTE_API = "https://testingservice-dot-showtimenft.wl.r.appspot.com";

const USE_REMOTE_API = true;

const API = USE_REMOTE_API ? REMOTE_API : LOCAL_API;

const wallet = new ethers.Wallet(
  "0xf740980eb4eb61094ca514ee96f04e77fa7c40837287bc8f224bbec2adc337d7",
  new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.infura.io/v3/45f2e4f4ce3f483b8472f5f77f12c50d`
  )
);

const minterABI = ["function mintEdition(address _to)"];
const editionCreatorABI = [
  "function createEdition(string memory _name, string memory _symbol, string memory _description, string memory _animationUrl, bytes32 _animationHash, string memory _imageUrl, bytes32 _imageHash, uint256 _editionSize, uint256 _royaltyBPS, uint256 claimWindowDurationSeconds) returns(address, address)"
];

const metaSingleEditionMintableCreator =
  "0x50C001A33Caa446c8b84C489F371F77754F41024";

const getAccessToken = async () => {
  const {
    data: { data: nonce },
  } = await axios.get(`${API}/api/v1/getnonce?address=${wallet.address}`);
  console.log("Nonce", nonce);
  const signature = await wallet.signMessage(
    `Sign into Showtime with this wallet. ${nonce}`
  );
  console.log("Signature", signature);
  const {
    data: { access: accessToken },
  } = await axios.post(`${API}/api/v1/login_wallet`, {
    address: wallet.address,
    signature,
  });
  console.log("Access token", accessToken);

  return accessToken;
};

async function delay(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

const sign = async (forwardRequest) => {
  return wallet._signTypedData(
    forwardRequest.domain,
    forwardRequest.types,
    forwardRequest.value
  );
};

const wrapAndSubmitTx = async (callData, toAddress, accessToken) => {
  console.log("Wrapping tx...");
  const { data: forwardRequest } = await axios(
    `${API}/api/v1/relayer/forward-request?call_data=${encodeURIComponent(
      callData
    )}&to_address=${encodeURIComponent(
      toAddress
    )}&from_address=${encodeURIComponent(wallet.address)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("Signing...");
  const signature = await sign(forwardRequest);
  console.log("Signature", signature);
  console.log("Submitting tx...");
  const { data: relayedTx } = await axios.post(
    `${API}/api/v1/relayer/forward-request`,
    {
      forward_request: forwardRequest,
      from_address: wallet.address,
      signature,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return relayedTx;
};

const pollTransaction = async (
  relayedTransactionId,
  pollEndpointName,
  accessToken
) => {
  let intervalMs = 2000;
  for (let attempts = 0; attempts < 30; attempts++) {
    console.log(`Checking tx... (${attempts + 1} / 30)`);
    const { data: response } = await axios.get(
      `${API}/api/v1/creator-airdrops/${pollEndpointName}?relayed_transaction_id=${relayedTransactionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response);
    if (response.is_complete) {
      return response;
    }
    await delay(intervalMs);
  }
};

const createEdition = async (accessToken) => {
  const targetInterface = new ethers.utils.Interface(editionCreatorABI);
  const callData = targetInterface.encodeFunctionData("createEdition", [
    "test 1234",
    "TEST",
    "A drop of test",
    "", // animationUrl
    "0x0000000000000000000000000000000000000000000000000000000000000000", // animationHash
    "ipfs://QmNSh7w75EPALBQC57tZiMggy7atTxD3sgmfmEtsi2CjCG", // imageUrl
    "0x5a10c03724f18ec2534436cc5f5d4e9d60a91c2c6cea3ad7e623eb3d54e20ea9", // imageHash
    100, // editionSize
    1000, // royaltyBPS
    604800 // claimWindowDurationSeconds (1 week here)
  ]);
  const relayedTx = await wrapAndSubmitTx(
    callData,
    metaSingleEditionMintableCreator,
    accessToken
  );
  const edition = await pollTransaction(
    relayedTx.relayed_transaction_id,
    "poll-edition",
    accessToken
  );
  if (!edition) {
    throw new Error("Edition creation failed");
  }
  return edition;
};

const mintEdition = async (editionAddress, minterAddress, accessToken) => {
  const targetInterface = new ethers.utils.Interface(minterABI);
  const callData = targetInterface.encodeFunctionData("mintEdition", [
    wallet.address,
  ]);
  const relayedTx = await wrapAndSubmitTx(
    callData,
    minterAddress,
    accessToken
  );
  const mint = await pollTransaction(
    relayedTx.relayed_transaction_id,
    "poll-mint",
    accessToken
  );
  if (!mint) {
    throw new Error("Edition minting failed");
  }
  return mint;
};

const main = async () => {
  const accessToken = await getAccessToken();
  const edition = await createEdition(accessToken);
  console.log("Edition", edition);
  const mint = await mintEdition(edition.edition.contract_address, edition.edition.minter_address, accessToken);
  console.log("Mint", mint);
};

main().catch((err) => console.log(err));
