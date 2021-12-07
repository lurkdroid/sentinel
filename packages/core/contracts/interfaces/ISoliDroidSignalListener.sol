// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

interface ISoliDroidSignalListener {
    function onSignal(address _token0, address _token1) external;
}
