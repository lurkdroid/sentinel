// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./BotInstance.sol";

import "hardhat/console.sol";

contract SoliDroidManager {
    mapping(address => BotInstance) private usersBot;
    BotInstance[] private bots;

    event BotCreated(
        address _user,
        address _bot,
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop,
        bool _update
    );

    function updateBot(
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) public payable {
        bool _update;
        if (usersBot[msg.sender] == BotInstance(address(0))) {
            BotInstance bot = new BotInstance(
                msg.sender,
                _quoteAsset,
                _defaultAmount,
                _stopLossPercent,
                _loop
            );
            bots.push(bot);
            usersBot[msg.sender] = bot;
        } else {
            usersBot[msg.sender].update(
                _quoteAsset,
                _defaultAmount,
                _stopLossPercent,
                _loop
            );
            _update = true;
        }
        emit BotCreated(
            msg.sender,
            address(usersBot[msg.sender]),
            _quoteAsset,
            _defaultAmount,
            _stopLossPercent,
            _loop,
            _update
        );
    }

    function getBot() external view returns (BotInstance) {
        return usersBot[msg.sender];
    }

    function getBots() external view returns (BotInstance[] memory) {
        return bots;
    }

    function wakeBots() external view returns (bool toTrigger) {
        for (uint256 i = 0; i < bots.length; i++) {
            if (toTrigger = bots[0].wakeMe()) {
                break;
            }
        }
    }

    // function fundBot(address payable botAddress) public payable {
    //     //TODO need to take a fee but not sure its the right place
    //     uint256 amount = msg.value;
    //     console.log(amount);
    //     (bool success, ) = botAddress.call{value: amount}("");
    //     require(success, "SoliDroidManaget.fundBot: Transfer failed.");
    // }

    function perform() external {
        for (uint256 i = 0; i < bots.length; i++) {
            if (bots[0].wakeMe()) {
                bots[i].botLoop();
            }
        }
    }
}
