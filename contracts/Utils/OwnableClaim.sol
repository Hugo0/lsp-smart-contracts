// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@erc725/smart-contracts/contracts/utils/OwnableUnset.sol";

contract OwnableClaim is OwnableUnset {
    enum Stage {
        NotStarted,
        InProgress
    }

    Stage public ownershipTransfer;

    address public upcomingNewOwner;

    modifier atStage(Stage _stage, string memory errorMessage) {
        require(ownershipTransfer == _stage, errorMessage);
        _;
    }

    // @todo add a timelock for timeout
    // to not lock the transferOwnership(...) function forever

    function transferOwnership(address newOwner)
        public
        virtual
        override
        onlyOwner
        // ensure it is not currently in the process of transferring ownership
        atStage(Stage.NotStarted, "ownership transfer currently ongoing")
    {
        // @todo if the timelock / timeout has expired, should reset the process

        // start ownership transfer process
        ownershipTransfer = Stage.InProgress;

        upcomingNewOwner = newOwner;
    }

    function claimOwnership()
        public
        atStage(Stage.InProgress, "no ownership transfer process in progress")
    {
        // @todo initial owner should also be allowed to claim back ownership
        require(
            msg.sender == upcomingNewOwner,
            "not allowed to claim ownership"
        );

        super.transferOwnership(msg.sender);
    }
}
