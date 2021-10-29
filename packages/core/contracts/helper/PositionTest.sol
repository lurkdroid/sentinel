// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../PositionLib.sol";
import "hardhat/console.sol";

contract PositionTest {
    using PositionLib for Position;
    Position public position;

    function initialize(
        address[] memory _path,
        uint256 price,
        uint256 stopLostPercent,
        uint256 _initialAmount
    ) public returns (Position memory) {
        position.path = _path;
        position.initialize(price, stopLostPercent, _initialAmount);
        return position;
    }

    function getPosition() public view returns (Position memory) {
        return position;
    }

    function nextTarget() public view returns (uint256) {
        return position.nextTarget();
    }

    function targetsIndexPlusPlus() public {
        position.targetsIndex++;
    }

    function nextTargetQuantity() public view returns (uint256) {
        return position.nextTargetQuantity();
    }

    function amountAdd(uint256 _amount) public {
        position.amount += _amount;
    }

    function amountSub(uint256 _amount) public {
        position.amount -= _amount;
    }

    function isDone() public view returns (bool) {
        return position.isDone();
    }
}
