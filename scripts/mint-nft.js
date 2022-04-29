const {hethers} = require('@hashgraph/hethers');
const {readApplicationJson, getSigner, createAccount} = require('./utils');
const gasConstants = require("../gas.json");
require("dotenv").config();
const CONTRACT_JSON = require('../artifacts/contracts/SimpleNft.sol/SimpleNft.json');

async function main() {
    console.log(`minting 1 token`);
    let appData = readApplicationJson();
    if(!appData.accounts["deploy"]["accountId"]){
        await createAccount(appData);
        appData = readApplicationJson();
    }
    const signer = getSigner(appData.accounts["deploy"]["accountId"], appData.accounts["deploy"]["privateKey"]);

    let balance = await signer.getBalance();
    console.log(`signer: ${hethers.utils.asAccountString(signer.address)} balance is ${hethers.utils.formatHbar(balance)}`);

    const nftContract = new hethers.Contract(appData.contracts["contractAddress"], CONTRACT_JSON.abi, signer);

    console.log(`contract address in hedera format is ${hethers.utils.asAccountString(appData.contracts["contractAddress"])}`);

    //3. call the mint function and wait for tx to be completed
    let mintTx = await nftContract.mintSingleNft({gasLimit: gasConstants.mintNftLimit});
    let mintReceipt = await mintTx.wait();
    console.log(`minted a token whose txId is ${mintTx.transactionId} and status is ${mintReceipt.status}`);
}


main().then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(-1);
    })
