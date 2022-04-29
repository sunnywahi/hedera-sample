const {hethers} = require('@hashgraph/hethers');
const {readFileSync, writeFileSync} = require('fs');
const {PrivateKey, Client, AccountCreateTransaction, Hbar, AccountBalanceQuery, TransferTransaction} = require("@hashgraph/sdk");
const BigNumber = require("bignumber.js");

const filePath = './appData.json';

function hederaClient() {
    let hederaClient;
    const HEDERA_NETWORK = process.env.HEDERA_NETWORK;
    if (HEDERA_NETWORK === 'testnet') {
        hederaClient = Client.forTestnet();
    } else if (HEDERA_NETWORK === 'previewnet') {
        hederaClient = Client.forPreviewnet();
    } else {
        hederaClient = Client.forMainnet();
    }
    hederaClient.setOperator(process.env.HEDERA_PORTAL_ACCOUNT_ID, process.env.HEDERA_PORTAL_PRIVATE_KEY);
    return hederaClient;
}

function readApplicationJson() {
    let applicationJson = {};
    try {
        let readFile = readFileSync(filePath);
        applicationJson = JSON.parse(readFile);
    } catch (error) {
        console.log(`unable to read file ${filePath}`);
        process.exit(1);
    }
    if (!applicationJson.accounts) {
        applicationJson.accounts = {};
    }
    if (!applicationJson.accounts.deploy) {
        applicationJson.accounts.deploy = {};
    }
    if (!applicationJson.contracts) {
        applicationJson.contracts = {};
    }
    return applicationJson;
}

async function createAccount(applicationData) {
    let client = hederaClient();
    let privateECDSAKey = PrivateKey.generateECDSA();
    let createTxResponse = await new AccountCreateTransaction()
        .setKey(privateECDSAKey)
        .setInitialBalance(new Hbar(100))
        .execute(client);

    let receipt = await createTxResponse.getReceipt(client);
    let accountId = receipt.accountId;
    console.log(`created account ${accountId}`);
    applicationData.accounts.deploy.accountId = accountId.toString();
    applicationData.accounts.deploy.privateKey = '0x'.concat(privateECDSAKey.toStringRaw());

    writeApplicationJson(applicationData);
    client.close();
}

function writeApplicationJson(data) {
    let jsonData = JSON.stringify(data);
    writeFileSync(filePath, jsonData);
}

function getSigner(accountId, privateKey) {
    topUpAccount(accountId).then(() => {})
        .catch((error) => {
            console.log(`error in topUp`);
            process.exit(1);
        });
    const hederaProvider = hethers.providers.getDefaultProvider(process.env.HEDERA_NETWORK);
    const wallet = new hethers.Wallet(privateKey, hederaProvider);
    let connectAccount = wallet.connectAccount(accountId);
    return connectAccount;
}


async function deployContractWithHethers(contractJson, signer, ...args) {
    console.log("Deploying...... Using Hethers");

    const contractFactory = new hethers.ContractFactory(contractJson.abi, contractJson.bytecode, signer);

    const contract = await contractFactory.deploy.apply(contractFactory, args);
    await contract.deployTransaction.wait();
    return contract.address;
}

async function topUpAccount(accountId) {
    let client = hederaClient();

    let accountBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);
    if (accountBalance.hbars.toBigNumber().isLessThanOrEqualTo(new BigNumber('100'))) {
        let transferTx = await new TransferTransaction()
            .addHbarTransfer(process.env.HEDERA_PORTAL_ACCOUNT_ID, new Hbar(-100))
            .addHbarTransfer(accountId, new Hbar(100))
            .execute(client);

        await transferTx.getReceipt(client);
    }

    client.close();
}

module.exports = {
    readApplicationJson,
    getSigner,
    createAccount,
    deployContractWithHethers,
    writeApplicationJson
}
