let config = {}
config.version = 'v1';
config.version2 = 'v2';
config.signTypedV3Method = "eth_signTypedData_v3";
config.loginDomainName = "Biconomy Login";
config.loginVersion = "1";
config.eip712SigVersion = "1";
config.eip712DomainName = "Biconomy Meta Transaction";
config.eip712VerifyingContract = "0x3457dC2A8Ff1d3FcC45eAd532CA1740f5c477160";
config.daiDomainName = "Dai Stablecoin";
config.daiVersion = "1";
config.forwarderDomainName = "Biconomy Forwarder";
config.forwarderVersion = "1";
config.baseURL = "https://api.biconomy.io";
config.nativeMetaTxUrl = `/api/${config.version2}/meta-tx/native`;
config.userLoginPath = `/api/${config.version2}/dapp-user/login`;
config.withdrawFundsUrl = `/api/${config.version2}/meta-tx/withdraw`;
config.getUserContractPath = `/api/${config.version2}/dapp-user/getUserContract`;
config.MESSAGE_TO_SIGN = 'Sign message to prove the ownership of your account with counter ';
config.WITHDRAW_MESSAGE_TO_SIGN = 'Provide your signature to withdraw funds with counter ';
config.USER_ACCOUNT = "BUA";
config.USER_CONTRACT = "BUC";
config.JSON_RPC_VERSION = '2.0';
config.LOGIN_MESSAGE_TO_SIGN = "Sign message to login to Biconomy with counter ";
config.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
config.PAYMENT_TOKEN_CONTRACT = config.ZERO_ADDRESS;
config.PAYMENT_TOKEN_AMOUNT = 0;
config.NONCE_BATCH_ID = 0;
config.EXPIRY = 0;
config.BASE_GAS = 0;
config.RELAYER_ADDRESS = config.ZERO_ADDRESS;
config.TOKEN_CONTRACT_ADDRESS = config.ZERO_ADDRESS;
config.DEFAULT_RELAYER_PAYMENT_TOKEN_ADDRESS = config.ZERO_ADDRESS;
config.DEFAULT_RELAYER_PAYMENT_AMOUNT = 0;
config.DEFAULT_DESCRIPTION = "Smart Contract Interaction";
config.DAI = "DAI_Permit";
config.EIP2612 = "EIP2612_Permit";


config.handleSignedTxUrl = `/api/${config.version2}/meta-tx/sendSignedTx`;
config.logsEnabled = false;

const EVENTS = {
	SMART_CONTRACT_DATA_READY: 'smart_contract_data_ready',
	DAPP_API_DATA_READY: 'dapp_api_data_ready',
	LOGIN_CONFIRMATION: 'login_confirmation',
	BICONOMY_ERROR: 'biconomy_error',
	HELPER_CLENTS_READY: 'permit_and_ercforwarder_clients_ready'
};

const RESPONSE_CODES = {
	ERROR_RESPONSE: 'B500',
	API_NOT_FOUND : 'B501',
	USER_CONTRACT_NOT_FOUND: 'B502',
	USER_NOT_LOGGED_IN: 'B503',
	USER_ACCOUNT_NOT_FOUND: 'B504',
	NETWORK_ID_MISMATCH: 'B505',
	BICONOMY_NOT_INITIALIZED: 'B506',
	NETWORK_ID_NOT_FOUND: 'B507',
	SMART_CONTRACT_NOT_FOUND: 'B508',
	DAPP_NOT_FOUND: 'B509',
	INVALID_PAYLOAD: 'B510',
	DASHBOARD_DATA_MISMATCH: 'B511',
	SUCCESS_RESPONSE: 'B200',
	USER_CONTRACT_CREATION_FAILED:'B512',
	EVENT_NOT_SUPPORTED: 'B513',
	INVALID_DATA: 'B514',
	INVALID_OPERATION: 'B515',
	WRONG_ABI: 'B516'
};


// could get these from sys info call
config.forwardRequestType = [
    {name:'from',type:'address'},
    {name:'to',type:'address'},
    {name:'token',type:'address'},
    {name:'txGas',type:'uint256'},
    {name:'tokenGasPrice',type:'uint256'},
    {name:'batchId',type:'uint256'},
    {name:'batchNonce',type:'uint256'},
    {name:'deadline',type:'uint256'},
    {name:'data',type:'bytes'}
];

config.daiPermitType = [
	{ name: "holder", type: "address" },
	{ name: "spender", type: "address" },
	{ name: "nonce", type: "uint256" },
	{ name: "expiry", type: "uint256" },
	{ name: "allowed", type: "bool" },
  ];

config.eip2612PermitType = [
	{ name: "owner", type: "address" },
	{ name: "spender", type: "address" },
	{ name: "value", type: "uint256" },
	{ name: "nonce", type: "uint256" },
	{ name: "deadline", type: "uint256" },
  ];

// This domain type is used in Permit Client where chainId needs to be preserved
config.domainType = [
	{ name: "name", type: "string" },
	{ name: "version", type: "string" },
	{ name: "chainId", type: "uint256" },
	{ name: "verifyingContract", type: "address" },
  ];

const BICONOMY_RESPONSE_CODES = {
	SUCCESS : 200,
	ACTION_COMPLETE: 143,
	USER_CONTRACT_NOT_FOUND: 148,
	ERROR_RESPONSE: 144
};

const HTTP_CODES = {
	OK: 200,
	INTERNAL_SERVER_ERROR: 500,
	NOT_FOUND: 404,
	CONFLICT: 409,
	EXPECTATION_FAILED: 417
}

const RESPONSE_BODY_CODES = {
	OK: 200,
	DAPP_LIMIT_REACHED: 150,
	USER_LIMIT_REACHED: 151,
	API_LIMIT_REACHED: 152,
	GAS_ESTIMATION_FAILED: 417,
	INTERNAL_ERROR: 500,
	NOT_FOUND: 404
}

const STATUS = {
	INIT: 'init',
	BICONOMY_READY:'biconomy_ready',
	NO_DATA:'no_data'
};

config.SCW = "SCW";

module.exports = {
	config,
	EVENTS,
	RESPONSE_CODES,
	HTTP_CODES,
	RESPONSE_BODY_CODES,
	BICONOMY_RESPONSE_CODES,
	STATUS
}