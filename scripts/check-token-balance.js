const {hethers} = require('@hashgraph/hethers');
const {readApplicationJson, getSigner, createAccount} = require('./utils');
const gasConstants = require("../gas.json");
require("dotenv").config();
const CONTRACT_JSON = require('../artifacts/contracts/SimpleNft.sol/SimpleNft.json');


async function main(){
    let appData = readApplicationJson();
    if(!appData.accounts["deploy"]["accountId"]){
        await createAccount(appData);
        appData = readApplicationJson();
    }
    const signer = getSigner(appData.accounts["deploy"]["accountId"], appData.accounts["deploy"]["privateKey"]);

    const checkBalancerOfAddress = signer.address;
    console.log(`checking token balance for account address ${checkBalancerOfAddress} and in hedera ${hethers.utils.asAccountString(checkBalancerOfAddress)}`);

    let nftContract = new hethers.Contract(appData.contracts["contractAddress"], CONTRACT_JSON.abi, signer);

    let tokens = await nftContract.tokensOfOwner(checkBalancerOfAddress, {gasLimit: 50000});

    console.log(`address ${hethers.utils.asAccountString(checkBalancerOfAddress)} has these ${JSON.stringify(tokens.toString())} tokens`);
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })
