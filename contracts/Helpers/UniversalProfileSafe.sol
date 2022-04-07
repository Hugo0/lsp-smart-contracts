// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// modules
import "../UniversalProfile.sol";
import "../Utils/OwnableClaim.sol";

contract UniversalProfileSafe is UniversalProfile, OwnableClaim {
    constructor(address _newOwner) UniversalProfile(_newOwner) {}

    function transferOwnership(address _newOwner)
        public
        override(OwnableClaim, OwnableUnset)
    {
        OwnableClaim.transferOwnership(_newOwner);
    }
}
