import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";
import backend from "../../lib/backend";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const user = await Iron.unseal(
    CookieService.getAuthToken(req.cookies),
    process.env.ENCRYPTION_SECRET_V2,
    Iron.defaults
  );

  const body = JSON.parse(req.body);

  // check the signature
  const address = body.addressDetected;
  const signature = body.signature;
  const response_nonce = await backend.get(`/v1/getnonce?address=${address}`);
  const nonce = response_nonce.data.data;

  // If it checks out, save to a cookie
  const msg = process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_WALLET + nonce;

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
    // Post the merge request to the backend securely

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/addwallet`, {
      method: "POST",
      headers: {
        "X-Authenticated-User": user.publicAddress,
        "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: address,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        res.json(myJson);
      });

    // Expire the nonce after successful login
    backend.get(`/v1/rotatenonce?address=${address}`);
  } else {
    console.log("SIG VERIFICATION FAILED");
  }

  res.statusCode = 200;
  res.end();
};
