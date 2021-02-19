import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import backend from "../../lib/backend";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const body = JSON.parse(req.body);

  // check the signature
  const address = body.address;
  const signature = body.signature;
  const response_nonce = await backend.get(`/v1/getnonce?address=${address}`);
  const nonce = response_nonce.data.data;

  // If it checks out, save to a cookie
  const msg = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + nonce;

  // We now are in possession of msg, publicAddress and signature. We
  // will use a helper from eth-sig-util to extract the address from the signature
  const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
  //console.log(msgBufferHex);
  const verifiedAddress = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  // The signature verification is successful if the address found with
  // sigUtil.recoverPersonalSignature matches the initial publicAddress
  if (verifiedAddress.toLowerCase() === address.toLowerCase()) {
    // Author a couple of cookies to persist a user's session
    const user = {
      publicAddress: verifiedAddress.toLowerCase(),
    };
    const token = await Iron.seal(
      user,
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
    CookieService.setTokenCookie(res, token);

    // Expire the nonce after successful login
    backend.get(`/v1/rotatenonce?address=${address}`);
  } else {
    console.log("SIG VERIFICATION FAILED");
  }

  res.end();
};
