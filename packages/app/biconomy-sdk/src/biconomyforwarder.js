let { ethers } = require("ethers");
const {config} = require("./config");
const ZERO_ADDRESS = config.ZERO_ADDRESS;

const buildForwardTxRequest = async (account, to, gasLimitNum, data, biconomyForwarder, batchId = 0) => {
    if(!biconomyForwarder) {
        throw new Error(`Biconomy Forwarder is not defined for current network`);
    }
    const batchNonce = await biconomyForwarder.getNonce(account, batchId);
    const req = {
        from: account,
        to: to,
        token: ZERO_ADDRESS,
        txGas: gasLimitNum,
        tokenGasPrice: "0",
        batchId: batchId,
        batchNonce: parseInt(batchNonce),
        deadline: Math.floor(Date.now() / 1000 + 3600),
        data: data
    };
    return {request: req};
};

const getDomainSeperator = (biconomyForwarderDomainData) => {
    const domainSeparator = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([
        "bytes32",
        "bytes32",
        "bytes32",
        "address",
        "bytes32",
    ], [
        ethers.utils.id("EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)"),
        ethers.utils.id(biconomyForwarderDomainData.name),
        ethers.utils.id(biconomyForwarderDomainData.version),
        biconomyForwarderDomainData.verifyingContract,
        biconomyForwarderDomainData.salt,
    ]));
    return domainSeparator;
};


module.exports = {
    buildForwardTxRequest,
    getDomainSeperator
};
