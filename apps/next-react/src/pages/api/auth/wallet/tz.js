import { prefix, utility } from "sotez";
import sodium from "libsodium-wrappers";
import { ec as EC } from "elliptic";
import blake2b from "blake2b";
import handler, { middleware } from "@/lib/api-handler";
import backend from "@/lib/backend";

export default handler()
  .use(middleware.auth)
  .put(async ({ user, body: { address, signature, publicKey } }, res) => {
    const {
      data: { data: nonce },
    } = await backend.get(`/v1/getnonce?address=${address}`);

    const message =
      process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_TEZOS_WALLET + " " + nonce;

    await sodium.ready;

    if (
      await verifySig(
        Buffer.from(message, "utf-8").toString("hex"),
        signature,
        publicKey
      )
    ) {
      await backend
        .post(
          "/v1/addwallet",
          { address },
          {
            headers: {
              "X-Authenticated-User": user.publicAddress,
              "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
            },
          }
        )
        .then((resp) => res.json(resp.data));
    } else {
      console.log("SIG VERIFICATION FAILED");
    }

    res.status(200).end();
  });

const isHex = (s) => utility.buf2hex(utility.hex2buf(s)) === s.toLowerCase();

const verifySig = async function (bytes, sig, pk) {
  await sodium.ready;

  bytes = utility.hex2buf(bytes);
  const sigCurve = sig.substring(0, 2);
  switch (sigCurve) {
    case "ed":
      sig = utility.b58cdecode(sig, prefix.edsig);
      break;
    case "sp":
      sig = utility.b58cdecode(sig, prefix.spsig);
      break;
    case "p2":
      sig = utility.b58cdecode(sig, prefix.p2sig);
      break;
    default:
      sig = utility.b58cdecode(sig, prefix.sig);
      break;
  }

  // pk is hex format (Beacon does this for reasons not clear)
  if (pk.length == 64 && isHex(pk)) {
    pk = Buffer.from(utility.hex2buf(pk));
    bytes = sodium.crypto_generichash(32, bytes);
    return sodium.crypto_sign_verify_detached(sig, bytes, pk);
  }

  const curve = pk.substring(0, 2);
  switch (curve) {
    case "ed":
      bytes = sodium.crypto_generichash(32, bytes);
      pk = utility.b58cdecode(pk, prefix.edpk);
      return sodium.crypto_sign_verify_detached(sig, bytes, pk);
    case "sp":
    case "p2":
      bytes = blake2b(32).update(bytes).digest();
      pk = utility.b58cdecode(pk, curve == "sp" ? prefix.sppk : prefix.p2pk);
      return new EC(curve == "sp" ? "secp256k1" : "p256")
        .keyFromPublic(pk)
        .verify(bytes, { r: sig.slice(0, 32), s: sig.slice(32) });
  }

  return false;
};
