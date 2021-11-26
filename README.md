# soliDroid

soliDroid - chain link hackathon, fall 2021

1. git clone https://github.com/lurkdroid/sentinel.git
2. yarn install
3. yarn start

## Inspiration
After years of building trading bots (centralized) in the crypto currency space, we want now to make on-chain algo-trading accessible also to anyone with a wallet address with soliDroid.

## What it does
The SoliDroid platform allows end users to create, configure and operate a personal bot. Every bot belongs to its owner and only the owner can change configuration, buy, sell, withdraw funds or transfer the ownership of the bot (droid) to another wallet. 
A web application providing the user all the online and historical information regarding its bot transactions. And also let the user interact with the bot in real time.

## How we built it
We build the business logic using Solidity on EVM and the web UI using React js and blockchain api libraries like ethers, moralis. We also build a backend server that query the blockchain for smart contracts events and other elements to enrich the UI.

## Challenges we ran into
Except for the fact that our team is in different time zones, 12 hours apart. Every day of this Hackathon was a new challenge. Some remarkable challenges include:  gas consumption, using DEX's API on different networks, invoking the bot periodically, doing accurate mathematical calculations using Solidity. And building a full React js application in a very short time.

## Accomplishments that we're proud of
We manage to create a robust back end on a blockchain and a rich UI in very short time. Watching the Bot open and close positions on the blockchain makes the effort worthwhile. In the beginning of this project we were skeptical its even possible.

## What we learned
First of all we learned to use Solidity to develop blockchain applications, we learned how to use many tools that are new to us. We learn how to integrate with ChainLink and Uniswap API, with Node providers and 3rd party libraries. In general we feel we learned so much in less than 4 weeks, and now we are ready for a career change, from non blockchain programmers to blockchain programmers.

## What's next for soliDroid
The soliDroid is just the beginning. We are planning to add support for technical analysis indicators. complex buy and sell roles. Bots that can be configured for yield farming. Allow multiple bots per address. We have so many plans, and almost any day brings a new idea.
