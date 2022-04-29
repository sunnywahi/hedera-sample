const {hethers} = require('@hashgraph/hethers');
require('dotenv').config();
const CONTRACT_JSON = require('../artifacts/contracts/SimpleNft.sol/SimpleNft.json');
const {getSigner, readApplicationJson, deployContractWithHethers, writeApplicationJson, createAccount} = require("./utils");
const gasConstants = require("../gas.json");

async function main() {
    let appData = readApplicationJson();
    if(!appData.accounts["deploy"]["accountId"]){
        await createAccount(appData);
        appData = readApplicationJson();
    }
    const signer = getSigner(appData.accounts["deploy"]["accountId"], appData.accounts["deploy"]["privateKey"]);

    const contractAddress = await deployContractWithHethers(CONTRACT_JSON, signer, "testData", {gasLimit: gasConstants.deployLimit});
    appData.contracts["contractAddress"] = contractAddress;

    console.log(`contract address deployed in solidity ${contractAddress} and in hedera format ${hethers.utils.asAccountString(contractAddress)}`);

    writeApplicationJson(appData);
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
