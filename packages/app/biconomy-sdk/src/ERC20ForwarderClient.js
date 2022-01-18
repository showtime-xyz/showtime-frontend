let { ethers } = require("ethers");
const { config } = require("./config");
const abi = require("ethereumjs-abi");
let { tokenAbi, erc20Eip2612Abi } = require("./abis");

const erc20ForwardRequestType = config.forwardRequestType;

/**
 * Method to get the gas price for a given network that'll be used to
 * send the transaction by Biconomy Relayer Network.
 *
 * @param {number} networkId Network id for which gas price is needed
 */
const getGasPrice = async (networkId) => {
  const gasPriceURL = `${config.baseURL}/api/v1/gas-price?networkId=${networkId}`;
  try {
    const response = await fetch(gasPriceURL);
    if (response && response.json) {
      const responseJson = await response.json();
      _logMessage("Gas Price Response JSON " + JSON.stringify(responseJson));
      if (
        responseJson &&
        responseJson.gasPrice &&
        responseJson.gasPrice.value
      ) {
        return ethers.utils
          .parseUnits(responseJson.gasPrice.value.toString(), "gwei")
          .toString();
      }
    }
    throw new Error(`Error getting gas price from url ${gasPriceURL}`);
  } catch (error) {
    _logMessage(error);
    throw error;
  }
};

/**
 * Single method to be used for logging purpose.
 *
 * @param {string} message Message to be logged
 */
function _logMessage(message) {
  if (config && config.logsEnabled && console.log) {
    console.log(message);
  }
}

/**
 * Class to provide methods to interact with Biconomy's ERC20Forwarder smart contract
 * to send meta transactions and let end users pay the gas fee in ERC20 tokens.
 * Check https://docs.biconomy.io to see list of supported tokens and guides on how to use this.
 *
 * This class supports both EIP712 and personal signatures.
 */
class ERC20ForwarderClient {
  constructor({
    forwarderClientOptions,
    networkId,
    provider,
    forwarderDomainData,
    forwarderDomainType,
    erc20Forwarder,
    transferHandler,
    forwarder,
    oracleAggregator,
    feeManager,
    isSignerWithAccounts,
    tokenGasPriceV1SupportedNetworks,
    trustedForwarderOverhead,
    daiPermitOverhead,
    eip2612PermitOverhead,
  }) {
    this.biconomyAttributes = forwarderClientOptions;
    this.networkId = networkId;
    this.provider = provider;
    this.forwarderDomainData = forwarderDomainData;
    this.forwarderDomainType = forwarderDomainType;
    this.erc20Forwarder = erc20Forwarder;
    this.oracleAggregator = oracleAggregator;
    this.feeManager = feeManager;
    this.forwarder = forwarder;
    this.transferHandler = transferHandler;
    this.isSignerWithAccounts = isSignerWithAccounts;
    this.tokenGasPriceV1SupportedNetworks = tokenGasPriceV1SupportedNetworks;
    this.trustedForwarderOverhead = trustedForwarderOverhead;
    this.daiPermitOverhead = daiPermitOverhead;
    this.eip2612PermitOverhead = eip2612PermitOverhead;
  }

  /**
   * Check if given token address is supported by Biconomy or not.
   *
   * @param {address} token Token address to check
   */
  async checkTokenSupport(token) {
    if (!ethers.utils.isAddress(token))
      throw new Error(
        `"token" address ${token} is not a valid ethereum address`
      );
    if (!this.feeManager)
      throw new Error(
        "Biconomy Fee Manager contract is not initialized properly."
      );

    const isTokenSupported = await this.feeManager.getTokenAllowed(token);
    if (!isTokenSupported)
      throw new Error(
        `Token with address ${token} is not supported. Please refer https://docs.biconomy.io to see list of supported tokens`
      );
  }

  /**
   * Method returns the apiId corresponding to the method being called as
   * given in the request object. The same apiId you can find on Biconomy
   * Dashboard under Manage API section.
   *
   * @param {object} req Request object containing required fields
   */
  getApiId(req) {
    try {
      if (!this.biconomyAttributes)
        throw new Error(
          "Biconomy is not initialized properly. 'biconomyAttributes'  is missing in ERC20ForwarderClient"
        );
      if (!this.biconomyAttributes.decoderMap)
        throw new Error(
          "Biconomy is not initialized properly. 'decoderMap' is missing in ERC20ForwarderClient.biconomyAttributes"
        );

      if (!req || !req.to || !req.data) {
        throw new Error(
          "'to' and 'data' field is mandatory in the request object parameter"
        );
      }

      let decoder = this.biconomyAttributes.decoderMap[req.to.toLowerCase()];
      if (decoder) {
        const method = decoder.decodeMethod(req.data);
        const contractData = this.biconomyAttributes.dappAPIMap[
          req.to.toLowerCase()
        ];
        if (method && method.name) {
          if (contractData) {
            return this.biconomyAttributes.dappAPIMap[req.to.toLowerCase()][
              method.name.toString()
            ];
          } else {
            throw new Error(
              `Method ${method.name} is not registerd on Biconomy Dashboard. Please refer https://docs.biconomy.io to see how to register smart contract methods on dashboard.`
            );
          }
        } else {
          throw new Error(
            `Unable to decode the method. The method you are calling might not be registered on Biconomy dashboard. Please check.`
          );
        }
      } else {
        throw new Error(
          `Your smart contract with address ${req.to} might not be registered on Biconomy dashboard. Please check.`
        );
      }
    } catch (error) {
      _logMessage(error);
      throw error;
    }
  }

  /**
   * Method returns the gas price in the given ERC20 token based on
   * current gas price of the blockchain. It refers to a oracleAgggregator
   * smart contract that fetches the token price from onchain price oracles like
   * ChainLink, Uniswap etc.
   * @notice this method also checks if token gas price is supported for current provider network otherwise result is fetched form the server
   * @param {string} tokenAddress Token Address
   */
  async getTokenGasPrice(tokenAddress) {
    try {
      let tokenGasPriceURL;
      let networkId = this.networkId;
      let isRegularTokenGasPriceSupported =
        this.tokenGasPriceV1SupportedNetworks.indexOf(parseInt(networkId)) == -1
          ? false
          : true;
      if (!ethers.utils.isAddress(tokenAddress))
        throw new Error(
          `Invalid token address: ${tokenAddress} Please passs a valid ethereum address`
        );
      if (!this.oracleAggregator)
        throw new Error(
          "Oracle Aggregator contract is not initialized properly"
        );

      const gasPrice = ethers.BigNumber.from(await getGasPrice(this.networkId));
      if (gasPrice == undefined || gasPrice == 0) {
        throw new Error(
          `Invalid gasPrice value ${gasPrice}. Unable to fetch gas price.`
        );
      }

      if (!isRegularTokenGasPriceSupported) {
        try {
          tokenGasPriceURL = `${config.baseURL}/api/v1/token-gas-price?tokenAddress=${tokenAddress}&networkId=${networkId}`;

          const response = await fetch(tokenGasPriceURL);
          if (response && response.json) {
            const responseJson = await response.json();
            _logMessage(
              "Token Gas Price Response JSON " + JSON.stringify(responseJson)
            );
            if (
              responseJson &&
              responseJson.tokenGasPrice &&
              responseJson.tokenGasPrice.value
            ) {
              return responseJson.tokenGasPrice.value.toString();
            }
          } else {
            throw new Error(
              `Error getting gas price from url ${tokenGasPriceURL}`
            );
          }
        } catch (error) {
          _logMessage(error);
          throw error;
        }
      }

      const tokenPrice = await this.oracleAggregator.getTokenPrice(
        tokenAddress
      );
      const tokenOracleDecimals = await this.oracleAggregator.getTokenOracleDecimals(
        tokenAddress
      );

      if (!tokenPrice || !tokenOracleDecimals)
        throw new Error(
          `Invalid tokenPrice ${tokenPrice} or tokenOracleDecimals ${tokenOracleDecimals} from oracle aggregator contract`
        );
      return gasPrice
        .mul(ethers.BigNumber.from(10).pow(tokenOracleDecimals))
        .div(tokenPrice)
        .toString();
    } catch (error) {
      _logMessage(error);
      throw new Error(`Error getting token gas price inside SDK`);
    }
  }

  /**
   * Method builds a request object based on the input parameters.
   * Method fetches the user nonce from Biconomy Forwarder contract.
   * If you want to perform parallel transactions from same user account,
   * use different batchIds.
   *
   * It returns the request object to be signed by the user and also gas estimation
   * in the given token to be used to pay transaction gas fee from user's account.
   *
   * @param {string} to Target Smart contract address
   * @param {string} token Token address in which gas payment is to be made
   * @param {number|string} txGas Estimated transaction gas for target method
   * @param {string} data Encoded target method data to be called
   * @param {number} batchId Batch id used to determine user nonce on Biconomy Forwarder contract
   * @param {number} deadlineInSec Deadline in seconds after which transaction will fail
   * @param {string} userAddress <Optional> If provider is not signer with accounts userAddress must be passed
   * @param {string} permitType <Optional> only to be passed if intended for permit chained execution.
   */
  //todo
  //needs changes in checking token approval and cost calculation to be moved elsewhere
  async buildTx({
    to,
    token,
    txGas,
    data,
    batchId = 0,
    deadlineInSec = 3600,
    userAddress,
    permitType,
  }) {
    try {
      if (!this.forwarder)
        throw new Error(
          "Biconomy Forwarder contract is not initialized properly."
        );
      if (!this.feeManager)
        throw new Error(
          "Biconomy Fee Manager contract is not initialized properly."
        );
      if (!this.oracleAggregator)
        throw new Error(
          "Biconomy Oracle Aggregator contract is not initialized properly."
        );
      if (!this.erc20Forwarder)
        throw new Error(
          "Biconomy Fee Proxy contract is not initialized properly."
        );

      if (permitType) {
        if (!permitType == config.DAI || !permitType == config.EIP2612) {
          throw new Error(
            "permit type passed is not matching expected possible values"
          );
        }
      }

      if (!ethers.utils.isAddress(to))
        throw new Error(`"to" address ${to} is not a valid ethereum address`);
      if (!ethers.utils.isAddress(token))
        throw new Error(
          `"token" address ${token} is not a valid ethereum address`
        );

      if (!txGas) throw new Error("'txGas' parameter is mandatory");

      await this.checkTokenSupport(token);

      if (!userAddress) {
        if (!this.isSignerWithAccounts) {
          throw new Error(
            "Provider object passed to Biconomy does neither have user account information nor userAddress is passed. Refer to docs or contact Biconomy team to know how to use ERC20ForwarderClient properly"
          );
        } else {
          userAddress = await this.provider.getSigner().getAddress();
        }
      }

      let nonce = await this.forwarder.getNonce(userAddress, batchId);
      const tokenGasPrice = await this.getTokenGasPrice(token);

      const req = {
        from: userAddress,
        to: to,
        token: token,
        txGas: txGas,
        tokenGasPrice: tokenGasPrice,
        batchId: batchId,
        batchNonce: Number(nonce),
        deadline: Math.floor(Date.now() / 1000 + deadlineInSec),
        data: data,
      };

      const feeMultiplier = await this.feeManager.getFeeMultiplier(
        userAddress,
        token
      );
      const tokenOracleDecimals = await this.oracleAggregator.getTokenOracleDecimals(
        token
      );
      const transferHandlerGas = await this.erc20Forwarder.transferHandlerGas(
        token
      );
      _logMessage(
        `TransferHandler gas from ERC20erc20Forwarder contract is ${transferHandlerGas.toString()}`
      );

      if (
        feeMultiplier == undefined ||
        tokenOracleDecimals == undefined ||
        transferHandlerGas == undefined
      )
        throw new Error(
          `One of the values is undefined. feeMultiplier: ${feeMultiplier} tokenOracleDecimals: ${tokenOracleDecimals} transferHandlerGas: ${transferHandlerGas}`
        );

      // if intended for permit chained execution then should add gas usage cost of each type of permit

      let tokenContract = new ethers.Contract(
        token,
        tokenAbi,
        this.provider
      );
      let tokenDecimals = await tokenContract.decimals();

      let permitFees;
      if (permitType) {
        let overHead =
          permitType == config.DAI
            ? this.daiPermitOverhead
            : this.eip2612PermitOverhead;
        let permitCost = ethers.BigNumber.from(overHead.toString())
          .mul(ethers.BigNumber.from(req.tokenGasPrice))
          .mul(ethers.BigNumber.from(feeMultiplier.toString()))
          .div(ethers.BigNumber.from(10000));

        let tokenSpendValue = parseFloat(permitCost).toString();
        permitCost = (
          parseFloat(permitCost) /
          parseFloat(ethers.BigNumber.from(10).pow(tokenDecimals))
        ).toFixed(3);

        permitFees = parseFloat(permitCost.toString()); // Exact amount in tokens
        _logMessage(
          `Estimated Permit Transaction Fee in token address ${token} is ${permitFees}`
        );
      }

      let cost = ethers.BigNumber.from(req.txGas.toString())
        .add(ethers.BigNumber.from(this.trustedForwarderOverhead.toString())) // Estimate on the higher end
        .add(transferHandlerGas)
        .mul(ethers.BigNumber.from(req.tokenGasPrice))
        .mul(ethers.BigNumber.from(feeMultiplier.toString()))
        .div(ethers.BigNumber.from(10000));
      let spendValue = parseFloat(cost).toString();
      cost = (
        parseFloat(cost) /
        parseFloat(ethers.BigNumber.from(10).pow(tokenDecimals))
      ).toFixed(3);
      let fee = parseFloat(cost.toString()); // Exact amount in tokens
      _logMessage(
        `Estimated Transaction Fee in token address ${token} is ${fee}`
      );

      let totalFees = fee;
      if (permitFees) {
        totalFees = parseFloat(fee + permitFees).toFixed(3);
      }

      // if intended for permit chained execution then should not check allowance
      if (!permitType) {
        const allowedToSpend = await this.erc20ForwarderApproved(
          req.token,
          userAddress,
          spendValue
        );
        if (!allowedToSpend) {
          throw new Error(
            "You have not given approval to ERC Forwarder contract to spend tokens"
          );
        } else {
          _logMessage(
            `${userAddress} has given permission ${this.erc20Forwarder.address} to spend required amount of tokens`
          );
        }
      }

      return { request: req, cost: totalFees };
    } catch (error) {
      _logMessage(error);
      throw error;
    }
  }

  async buildTransferTx({token, to, amount, userAddress}) {
    try {
      const txCall = await this.transferHandler.populateTransaction.transfer(
        token,
        to,
        amount
      );

      if (!userAddress)
        userAddress = await this.provider.getSigner().getAddress();

      const gasLimit = await this.provider.estimateGas({from:userAddress,to:this.transferHandler.address,data:txCall.data});
      
      _logMessage(`Transfer handler gas limit is ${gasLimit.toNumber()}`);

      return await this.buildTx({
        to:this.transferHandler.address,
        token:token,
        txGas:gasLimit.toNumber(),
        data:txCall.data
      });
    } catch (error) {
      _logMessage(error);
      throw error;
    }
  }

  async erc20ForwarderApproved(tokenAddress, userAddress, spendValue) {
    let providerOrSigner;
    if(this.isSignerWithAccounts)
    {
      providerOrSigner = this.provider.getSigner();
    }
    else{
      providerOrSigner = this.provider;
    }
    let token = new ethers.Contract(
      tokenAddress,
      tokenAbi,
      providerOrSigner
    );
    spendValue = Number(spendValue);
    const allowance = await token.allowance(
      userAddress,
      this.erc20Forwarder.address
    );
    if (allowance > spendValue) return true;
    else return false;
  }

  /**
   * Method gets the user signature in EIP712 format and send the transaction
   * via Biconomy meta transaction API .
   * Check buildTx() method to see how to build the req object.
   * Signature param and userAddress are optional if you have initialized biconomy
   * with a provider that has user account information.
   *
   * @param {object} req Request object to be signed and sent
   * @param {string} signature Signature string singed from user account
   * @param {string} userAddress User blockchain address (optional) must pass when you have signer without accounts
   * @param {number} gasLimit custom gasLimit (optional) to pass for this transaction
   */
  async sendTxEIP712({ req, signature = null, userAddress, gasLimit }) {
    try {
      //possibly check allowance here

      const domainSeparator = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32", "bytes32", "address", "bytes32"],
          [
            ethers.utils.id(
              "EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)"
            ),
            ethers.utils.id(this.forwarderDomainData.name),
            ethers.utils.id(this.forwarderDomainData.version),
            this.forwarderDomainData.verifyingContract,
            this.forwarderDomainData.salt,
          ]
        )
      );

      if (this.isSignerWithAccounts) {
        userAddress = await this.provider.getSigner().getAddress();
      } else {
        if (!signature) {
          throw new Error(
            "Either pass signature param or pass a provider to Biconomy with user accounts information"
          );
        }
      }

      if (!userAddress) {
        throw new Error(
          "Either pass userAddress param or pass a provider to Biconomy with user accounts information"
        );
      }

      const dataToSign = {
        types: {
          EIP712Domain: this.forwarderDomainType,
          ERC20ForwardRequest: erc20ForwardRequestType,
        },
        domain: this.forwarderDomainData,
        primaryType: "ERC20ForwardRequest",
        message: req,
      };

      const sig =
        signature == null
          ? await this.provider.send("eth_signTypedData_v3", [
              req.from,
              JSON.stringify(dataToSign),
            ])
          : signature;
      const api = this.getApiId(req);
      if (!api || !api.id)
        throw new Error(
          "Could not find the method information on Biconomy Dashboard. Check if you have registered your method on the Dashboard."
        );

      const apiId = api.id;
      const metaTxBody = {
        to: req.to,
        from: userAddress,
        apiId: apiId,
        params: [req, domainSeparator, sig],
        gasLimit: gasLimit,
        signatureType: this.biconomyAttributes.signType.EIP712_SIGN,
      };

      const txResponse = await fetch(
        `${config.baseURL}/api/v2/meta-tx/native`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.biconomyAttributes.apiKey,
          },
          body: JSON.stringify(metaTxBody),
        }
      );

      return await txResponse.json();
    } catch (error) {
      _logMessage(error);
      throw error;
    }
  }

  /**
   * Method gets the user signature in EIP712 format and send the transaction
   * via Biconomy meta transaction API .
   * Check buildTx() method to see how to build the req object.
   * Signature param and userAddress are optional if you have initialized biconomy
   * with a provider that has user account information.
   *
   * @param {object} req Request object to be signed and sent
   * @param {string} signature Signature string singed from user account
   * @param {string} userAddress User blockchain address (optional) must pass when you have signer without accounts
   * @param {number} gasLimit custom gasLimit (optional) to pass for this transaction
   * @param {object} metaInfo For permit chained execution clients can pass permitType {string} constant and permitData {object} containing permit options.
   */
  async permitAndSendTxEIP712({
    req,
    signature = null,
    userAddress,
    metaInfo,
    gasLimit,
  }) {
    try {
      const domainSeparator = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32", "bytes32", "address", "bytes32"],
          [
            ethers.utils.id(
              "EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)"
            ),
            ethers.utils.id(this.forwarderDomainData.name),
            ethers.utils.id(this.forwarderDomainData.version),
            this.forwarderDomainData.verifyingContract,
            this.forwarderDomainData.salt,
          ]
        )
      );

      if (this.isSignerWithAccounts) {
        userAddress = await this.provider.getSigner().getAddress();
      } else {
        if (!signature) {
          throw new Error(
            "Either pass signature param or pass a provider to Biconomy with user accounts information"
          );
        }
      }

      if (!userAddress) {
        throw new Error(
          "Either pass userAddress param or pass a provider to Biconomy with user accounts information"
        );
      }

      const dataToSign = {
        types: {
          EIP712Domain: this.forwarderDomainType,
          ERC20ForwardRequest: erc20ForwardRequestType,
        },
        domain: this.forwarderDomainData,
        primaryType: "ERC20ForwardRequest",
        message: req,
      };

      const sig =
        signature == null
          ? await this.provider.send("eth_signTypedData_v3", [
              req.from,
              JSON.stringify(dataToSign),
            ])
          : signature;
      const api = this.getApiId(req);
      if (!api || !api.id)
        throw new Error(
          "Could not find the method information on Biconomy Dashboard. Check if you have registered your method on the Dashboard."
        );

      const apiId = api.id;
      const metaTxBody = {
        to: req.to,
        from: userAddress,
        apiId: apiId,
        params: [req, domainSeparator, sig],
        metaInfo: metaInfo, // just pass it on
        gasLimit: gasLimit,
        signatureType: this.biconomyAttributes.signType.EIP712_SIGN,
      };

      const txResponse = await fetch(
        `${config.baseURL}/api/v2/meta-tx/native`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.biconomyAttributes.apiKey,
          },
          body: JSON.stringify(metaTxBody),
        }
      );

      return await txResponse.json();
    } catch (error) {
      _logMessage(error);
      throw error;
    }
  }

  /**
   * Method gets the user signature in personal_sign format and send the transaction
   * via Biconomy meta transaction API .
   * Check buildTx() method to see how to build the req object.
   * Signature param and userAddress are optional if you have initialized biconomy
   * with a provider that has user account information.
   *
   * @param {object} req Request object to be signed and sent
   * @param {string} signature Signature string singed from user account
   * @param {string} userAddress User blockchain address (optional) must pass when you have signer without accounts
   * @param {number} gasLimit custom gasLimit (optional) to pass for this transaction
   */
  async sendTxPersonalSign({ req, signature = null, userAddress, gasLimit }) {
    try {
      const hashToSign = abi.soliditySHA3(
        [
          "address",
          "address",
          "address",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "bytes32",
        ],
        [
          req.from,
          req.to,
          req.token,
          req.txGas,
          req.tokenGasPrice,
          req.batchId,
          req.batchNonce,
          req.deadline,
          ethers.utils.keccak256(req.data),
        ]
      );
      const signer = this.provider.getSigner();
      if (this.isSignerWithAccounts) {
        userAddress = await signer.getAddress();
      } else {
        if (!signature) {
          throw new Error(
            "Either pass signature param or pass a provider to Biconomy with user accounts information"
          );
        }
      }

      if (!userAddress) {
        throw new Error(
          "Either pass userAddress param or pass a provider to Biconomy with user accounts information"
        );
      }
      const sig =
        signature == null && this.isSignerWithAccounts
          ? await signer.signMessage(hashToSign)
          : signature;

      if (sig == null || sig == undefined)
        throw new Error(
          "Either pass signature param or pass a provider to Biconomy with user accounts information"
        );

      const api = this.getApiId(req);
      if (!api || !api.id)
        throw new Error(
          "Could not find the method information on Biconomy Dashboard. Check if you have registered your method on the Dashboard."
        );

      const apiId = api.id;
      const metaTxBody = {
        to: req.to,
        from: userAddress,
        apiId: apiId,
        params: [req, sig],
        gasLimit: gasLimit,
        signatureType: this.biconomyAttributes.signType.PERSONAL_SIGN,
      };

      const txResponse = await fetch(
        `${config.baseURL}/api/v2/meta-tx/native`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.biconomyAttributes.apiKey,
          },
          body: JSON.stringify(metaTxBody),
        }
      );

      return await txResponse.json();
    } catch (error) {
      _logMessage(error);
      throw error;
    }
  }
}

module.exports = ERC20ForwarderClient;
