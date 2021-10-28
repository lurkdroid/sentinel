// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Position {
    address[] path;
    uint256 amount;
    uint256 lastPrice;
    uint256[] targets;
    uint16 targetsIndex;
    uint256 stopLoss;
    bool underStopLoss;
    ///////////////////////
    // TODO need for cost average
    // unit256[] buyTrades;
    // uint16 costAverage;
    // bool costAverageArm;
    // TODO need for trailing stoploss
    uint256 stopLossAmount;
    // bool lastTargetTrailing;
}

library PositionLib {
    //invoke initialize after initial buy.
    function initialize(
        Position storage self,
        address[] memory _path,
        uint256 _price,
        uint256 stopLostPercent //basis point. %5 == 500
    ) external {
        self.path = _path;
        self.lastPrice = _price;
        uint256 calcPrice = _price / 10000; //divid to avoid overflow
        calcPrice = (calcPrice / 10000) * (10000 - stopLostPercent);
        self.stopLoss = calcPrice * 10000;
        self.stopLossAmount = _price - self.stopLoss;
        self.targets.push(_price + self.stopLossAmount / 4);
        self.targets.push(_price + self.stopLossAmount / 2);
        self.targets.push(_price + self.stopLossAmount);
    }

    function nextTarget(Position storage self) external view returns (uint256) {
        return
            self.targetsIndex < self.targets.length
                ? self.targets[self.targetsIndex]
                : 0;
    }

    function nextTargetQuantity(Position storage self)
        external
        view
        returns (uint256)
    {
        if (self.targetsIndex == 0) {
            return self.amount / 4;
        } else if (self.targetsIndex == 1) {
            return self.amount / 3;
        } else {
            return self.amount;
        }
    }

    // TODO for trailing stoploss
    // function updatePrice(Position storage self, uint256 _price) external {
    //     self.lastPrice = _price;

    //     if (self.targetsIndex > 0) {
    //         uint256 newStoploss = _price - stoplossAmount;
    //         this.stoploss = self.stoploss > newStoploss
    //             ? self.stoploss
    //             : newStoploss;
    //     }
    // }

    function isDone(Position storage self) external view returns (bool) {
        return self.underStopLoss || self.targetsIndex > 2;
    }
}
