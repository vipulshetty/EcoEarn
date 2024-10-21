// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EcoPointsNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => uint256) public tokenPoints;

    constructor() ERC721("EcoPointsNFT", "ECONFT") {}

    function mintNFT(address recipient, uint256 points) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        tokenPoints[newItemId] = points;
        return newItemId;
    }

    function getTokenPoints(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC721: token does not exist");
        return tokenPoints[tokenId];
    }
}