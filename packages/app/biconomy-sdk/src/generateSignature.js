//take parameter for chosen signature type V3 or V4
export function getSignatureEIP712(engine, account, request) {
  //default V4 now
  let signTypedDataType = "eth_signTypedData_v4";
  const dataToSign = _getEIP712ForwardMessageToSign(request);
  let targetProvider = getTargetProvider(engine);
  if (!targetProvider) {
    throw new Error(`Unable to get provider information passed to Biconomy`);
  }
  const promise = new Promise(async function (resolve, reject) {
    if (targetProvider) {
      if (isEthersProvider(targetProvider)) {
        try {
          let signature = await targetProvider.send(signTypedDataType, [
            account,
            dataToSign,
          ]);
          let { r, s, v } = getSignatureParameters(signature);
          v = ethers.BigNumber.from(v).toHexString();
          let newSignature = r + s.slice(2) + v.slice(2);
          resolve(newSignature);
        } catch (error) {
          reject(error);
        }
      } else {
        await targetProvider.send(
          {
            jsonrpc: "2.0",
            id: 999999999999,
            method: signTypedDataType,
            params: [account, dataToSign],
          },
          function (error, res) {
            if (error) {
              reject(error);
            } else {
              let oldSignature = res.result;
              let { r, s, v } = getSignatureParameters(oldSignature);
              v = ethers.BigNumber.from(v).toHexString();
              let newSignature = r + s.slice(2) + v.slice(2);
              resolve(newSignature);
            }
          }
        );
      }
    } else {
      reject(
        `Could not get signature from the provider passed to Biconomy. Check if you have passed a walletProvider in Biconomy Options.`
      );
    }
  });

  return promise;
}
