// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract BatchTransfer is Ownable, ReentrancyGuard, IERC721Receiver {

    event TransferSingle(
        address indexed nft,
        address indexed source,
        address dest,
        uint256 tokenId
    );

    event TransferBatch(
        address indexed nft,
        address indexed source,
        address[] dest,
        uint256[] tokenIds
    );
    
    constructor() {}

    function transferBatch(
        address Nft_addr, 
        address from, 
        address[] calldata to, 
        uint[] calldata tokenIds
        ) nonReentrant onlyOwner external {
        require(to.length == tokenIds.length, "Error: the to length must match tokenIds.");
        require(Nft_addr != address(0), "Error: invalid nft address.");
        require(from != address(0), "Error: invalid sender address.");

        uint256 length = to.length;
        IERC721 NFT = IERC721(Nft_addr);

        for (uint i = 0; i < length; i++) {
            NFT.safeTransferFrom(from, to[i], tokenIds[i]);
        }

        emit TransferBatch(Nft_addr,from,to,tokenIds);
    }

    function transferSingle(
        address Nft_addr, 
        address from, 
        address  to, 
        uint tokenId
        ) nonReentrant onlyOwner external {
        require(Nft_addr != address(0), "Error: invalid nft address.");
        require(from != address(0), "Error: invalid sender address.");

        IERC721 NFT = IERC721(Nft_addr);

        NFT.safeTransferFrom(from, to, tokenId);

        emit TransferSingle(Nft_addr,from,to,tokenId);
    }

    function onERC721Received(
        address, 
        address, 
        uint256, 
        bytes memory
        ) public pure override returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}


//0x8bfac9ef3d73ce08c7cec339c0fe3b2e57814c1e