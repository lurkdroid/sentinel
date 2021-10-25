// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BotInstance.sol";

import "hardhat/console.sol";

contract SoliDroidManaget {
    mapping(address => BotInstance) private usersBot;
    BotInstance[] private bots;

    function updateBot(
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) public payable returns (BotInstance) {
        if (
            usersBot[msg.sender] ==
            BotInstance(0x0000000000000000000000000000000000000000)
        ) {
            BotInstance bot = new BotInstance(
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
        }
        return usersBot[msg.sender];
    }

    function getBot() external view returns (BotInstance) {
        return usersBot[msg.sender];
    }

    function fundBot(address payable botAddress) public payable {
        //TODO need to take a fee but not sure its the right place
        uint256 amount = msg.value;
        console.log(amount);
        (bool success, ) = botAddress.call{value: amount}("");
        require(success, "SoliDroidManaget.fundBot: Transfer failed.");
    }
}
