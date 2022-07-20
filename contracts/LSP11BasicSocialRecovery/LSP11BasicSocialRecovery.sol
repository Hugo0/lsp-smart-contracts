// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// modules
import "./LSP11BasicSocialRecoveryCore.sol";

/**
 * @title Implementation of LSP11-SocialRecovery standard
 * @author Fabian Vogelsteller, Yamen Merhi, Jean Cavallera
 * @notice Recovers the permission of a key to control an ERC725 contract through LSP6KeyManager
 */
contract LSP11BasicSocialRecovery is LSP11BasicSocialRecoveryCore {
    /**
     * @notice Initiate the contract with the address of the ERC725 contract and sets the owner
     * @param _account The address of the ER725 contract to recover and the owner of the contract
     */
    constructor(address _account) {
        account = ERC725(_account);
        OwnableUnset._setOwner(_account);
    }
}