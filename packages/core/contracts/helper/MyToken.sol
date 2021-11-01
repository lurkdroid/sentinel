//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import { ERC20 } from "./ERC20.sol";
contract MyToken is ERC20{
    constructor(uint _amount) ERC20("MOCK","mc", _amount) {}
}