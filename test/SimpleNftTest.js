const {expect} = require('chai');
const {ethers} = require('hardhat');

describe("testing contract is functioning", async function () {
    let owner, address1;
    let happyFaceContract;
    const contractName = "SimpleNft";
    const baseURI = "dumb://dumb";
    beforeEach("setup test data", async function () {
        [owner, address1] = await ethers.getSigners();
        let contractFactory = await ethers.getContractFactory(contractName);
        happyFaceContract = await contractFactory.deploy(baseURI);
    });

    it("Mint Nft works", async function () {
        await happyFaceContract.mintSingleNft();
        await happyFaceContract.mintSingleNft();
        let tokens = await happyFaceContract.tokensOfOwner(owner.address);
        expect(tokens.length).to.equal(2);
        let values = [];
        for(let index=0; index<tokens.length; index++){
            values[index] = tokens[index].toString();
        }
        expect(values).to.eql(['0', '1']);
    })

});
