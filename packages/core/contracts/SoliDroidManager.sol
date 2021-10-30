// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./BotInstance.sol";
import "./interfaces/ISoliDroidSignalListener.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DroidWaker.sol";
import "hardhat/console.sol";

contract SoliDroidManager is ISoliDroidSignalListener, Ownable {
    mapping(address => BotInstance) private usersBot;
    BotInstance[] private bots;
    DroidWaker private waker;


    constructor(address _registry, address _link ) {
        waker = new DroidWaker(_registry,_link);
    }
    
    modifier onlyWaker() {
        require(msg.sender == address(waker), "wakeBots:unauthorized");
        _;
    }
    //for signal providers
    mapping(address => bool) private signalProviders;
    mapping(address => mapping(address => bool)) private supportedPairs;

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

    //FIXME this function can return many bots
    function getBots() external view returns (BotInstance[] memory) {
        return bots;
    }

    function wakeBots() external view onlyWaker returns (bool toTrigger) {
        for (uint256 i = 0; i < bots.length; i++) {
            if (toTrigger = bots[0].wakeMe()) {
                break;
            }
        }
    }

    //TODO we either do it this way or take fees from the botInstance balace
    // function fundBot(address payable botAddress) public payable {
    //     //TODO need to take a fee but not sure its the right place
    //     uint256 amount = msg.value;
    //     console.log(amount);
    //     (bool success, ) = botAddress.call{value: amount}("");
    //     require(success, "SoliDroidManaget.fundBot: Transfer failed.");
    // }

    function perform() external onlyWaker {
        for (uint256 i = 0; i < bots.length; i++) {
            if (bots[0].wakeMe()) {
                bots[i].botLoop();
            }
        }
    }

    function onSignal(address _quoteAsset, address _baseAsset)
        external
        override
    {
        require(signalProviders[msg.sender], "onSignal:unauthorized");
        require(
            supportedPairs[_quoteAsset][_baseAsset],
            "onSignal:unsupported"
        );

        address[] memory path = new address[](2);
        path[0] = _quoteAsset;
        path[1] = _baseAsset;

        for (uint256 i = 0; i < bots.length; i++)
            if (bots[i].acceptSignal(_quoteAsset)) bots[i].buySignal(path);
    }

    function addSignalProvider(address _provider) external onlyOwner {
        require(_provider != address(0), "addSignalProvider:invalid");
        signalProviders[_provider] = true;
    }

    function removeSignalProvider(address _provider) external onlyOwner {
        signalProviders[_provider] = false;
    }

    function getWaker() public view returns (address) {
        return address(waker);
    }
}
