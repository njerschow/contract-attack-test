// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ProblematicNFT is ERC721 {
    mapping(address => uint256) public tokensDeposited;

    uint256 public currentTokenId;

    constructor() ERC721("BadNFT", "BAD") {
        currentTokenId = 0;
    }

    function deposit() external payable {
        require(msg.value >= 1e17, "deposit not enough");

        tokensDeposited[msg.sender] = msg.value;
    }

    function mint() external {
        payable(msg.sender).transfer(tokensDeposited[msg.sender]);

        _safeMint(msg.sender, currentTokenId++);

        tokensDeposited[msg.sender] = 0;
    }
}
