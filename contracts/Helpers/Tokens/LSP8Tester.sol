// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../LSP8-IdentifiableDigitalAsset/LSP8-IdentifiableDigitalAsset.sol";

contract LSP8Tester is LSP8 {
    /* solhint-disable no-empty-blocks */
    constructor(
      string memory name,
      string memory symbol,
      address newOwner
    ) LSP8(name, symbol, newOwner) {}
    
    function mint(address to, bytes32 tokenId, bool force, bytes memory data) public {
        _mint(to, tokenId, force, data);
    }

    function burn(bytes32 tokenId, bytes memory data) public {
        _burn(tokenId, data);
    }
}
