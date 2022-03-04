// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TestNft is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    constructor() ERC721("NFT-Example", "NEX") {}

    function mintNft(address receiver) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _mint(receiver, newNftTokenId);
        return newNftTokenId;
    }
}