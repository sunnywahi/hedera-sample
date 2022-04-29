//SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract SimpleNft is ERC721Enumerable, Ownable {
    //use counters library for counters
    using Counters for Counters.Counter;

    //create token counter
    Counters.Counter private _tokenIds;

    uint256 public constant MAX_SUPPLY = 10000;
    string public baseTokenURI;

    //specify the arguments to ERC721 contract constructor else SimpleNft has to be abstract
    constructor(string memory _tokenURI) ERC721("Sample NFT", "FBH"){
        baseTokenURI = _tokenURI;
    }

    //overriding this to tell contract know the baseURI is this and then it can locate all series of json metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    //intentionally this function is not owner so that any one can call it
    function mintSingleNft() public{
        uint256 newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);
        _tokenIds.increment();
    }

    //mandatory to mention specifier as external as we returning dynamic array
    function tokensOfOwner(address _owner) external view returns(uint[] memory){
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint i=0; i< tokenCount; i++){
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function withdraw() public payable onlyOwner{
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value:balance}("");
        require(success, "Transfer failed.");
    }
}
