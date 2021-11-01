// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import {BotInstance} from "./BotInstance.sol";
import {SoliDroidManager} from "./SoliDroidManager.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import {KeeperRegistryBaseInterface} from "./interfaces/KeeperRegistryInterface.sol";
import {KeeperCompatibleInterface} from "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

contract DroidWaker is KeeperCompatibleInterface, Ownable {
    KeeperRegistryBaseInterface immutable registry;

    address immutable LINK_ADDRESS;
    SoliDroidManager internal manager;
    uint256 internal registryID;

    constructor(address _registry, address _link) {
        LINK_ADDRESS = _link;
        registry = KeeperRegistryBaseInterface(_registry);
    }

    function updateBotManager(SoliDroidManager _bot_manager) public onlyOwner {
        manager = _bot_manager;
    }

    function getRegistryID() public view returns (uint256) {
        return registryID;
    }

    function setRegistryID(uint256 _registry_id) public onlyOwner {
        registryID = _registry_id;
    }

    function getRegistry() public view returns (address) {
        return address(registry);
    }

    function cancelUpkeep() public onlyOwner {
        registry.cancelUpkeep(registryID);
    }

    function addFunds(uint96 amount) public {
      registry.addFunds(registryID, amount);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = manager.wakeBots();
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        manager.perform();
    }
}