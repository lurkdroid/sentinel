import {  ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import { configFromArray } from '../../utils/BotConfig';
import { BotInstanceData } from '../../utils/BotInstanceData';
import GaugeChart from 'react-gauge-chart'
import { managerAddress } from '../../utils/data/sdDatabase';
import { positionFromArray } from '../../utils/Position';
import {MrERC20Balance} from '../../utils/MrERC20Balance';
import { useSelector } from 'react-redux';

 const botData = new BotInstanceData();

export const DroidStatus = ()=>{
    
    const [position, setPosition] = useState(positionFromArray([[],"0","0",[],"0","0",true,"0","0"]))
    const [config, setConfig] = useState(configFromArray(["0","0","",true]));
    const [lastAmount, setLastAmount] = useState("0");
    const [balances, setBalances] = useState( new Array<MrERC20Balance>());
    // const [trades, setTrades] = useState();

    botData.position = position;
    botData.config = config;
    botData.lastAmount = lastAmount;
    // botData.trades = trades;
    const theApp = useAppSelector(state => state.app);
    botData.network = theApp.network;
    
    function  fetchBotData() {
        console.log("CALL FATCH DATA");
        console.log(new Date().toTimeString());
        try {
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // provider.getNetwork().then(network=>{
                // botData.network = network.name;
                // return botData.network;
            // }).then(network=>{
                // const manager = new ethers.Contract(managerAddress(network), managerAbi.abi, provider.getSigner());
                theApp.manager.getBot().then((botAddress: any)=>{

                fetch(`http://localhost:8000/config?address=${botAddress}`)
                .then(res => res.json())
                .then(_config =>{
                        botData.config = configFromArray(_config);
                        setConfig(botData.config);
                    })

                fetch(`http://localhost:8000/position?address=${botAddress}`)
                .then(res => res.json())
                .then(_position =>{
                        botData.position = positionFromArray(_position[0]) ;
                        botData.lastAmount = _position[1];
                        setPosition(botData.position);
                        setLastAmount(botData.lastAmount);
                    })
                //fetch bot token balances
                fetch(`https://deep-index.moralis.io/api/v2/${botAddress}/erc20?chain=polygon`,
                {headers:{
                    'Content-Type': 'application/json' ,
                    'X-API-Key': 'LyC81hs3WmiDUv30rSBfQHH4zZPcq3tRGMYOPWCKoeU0eKOYxYhZHRjBUJNGd93R'
                }})
                .then(res => res.json())
                .then(_balances=>{
                    botData.balances = _balances  
                    setBalances(botData.balances)                      
                    console.log(botData);
                    
                } );
            });

          } catch (e){
            console.log("error getting provider or manager", e)
          }
    }

    useEffect( () => {
        fetchBotData();
        const nIntervId = setInterval(fetchBotData,60*1000);       
        return ()=>{
            try {
                clearInterval(nIntervId);
            } catch (error) { 
            }
        }
    },[])

    return (

        // will update it with the grid css later.
        <div className='flex flex-row flex-wrap justify-start font-extrabold'>
            <div className='flex flex-row justify-around w-full'>
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Bot Configuration  {botData.config?.defaultAmountOnly?.toString()}
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Status:</div>
                        <div>{botData.status()}</div>
                        <div>Quote Asset:</div>
                        <div>
                            <div>
                                {botData.quoteAssetName()}
                            </div>
                            <div>
                                <img className='sm-24' src={botData.quoteAssetImage()} /></div>
                            </div>
                        <div>{botData.quoteAssetName()} Balance:</div>
                        <div>{botData.quoteAssetBalance()}</div>
                        <div>Default Amount:</div>
                        <div>{botData.defaultAmount()}</div>
                        <div>Default Amount Only:</div>
                        <div>False</div>
                        <div>Stop Loss Percent:</div>
                        <div>%{botData.stopLossPercent()}</div>
                        <div>Loop:</div>
                        <div>True</div>
                        {botData.active()==false?
 
                                <div>
                                    <div className='mt-2'><button className='sm-button'>Buy now!</button></div>
                                    <div className='mt-2'><button className='sm-button'>Edit Configuration</button></div>
                                </div>
                        :""}
                         {botData.active()==false?

                                <div>
                                    <div className='mt-2'><button className='sm-button'>Withdraw</button></div>
                                    <div className='mt-2'><button className='sm-button'>Deposit</button></div>
                                </div>
                        :""}
                    </div>
                </div>
                {botData.active()?
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Price Data
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Average Buy price:</div>
                        <div>{botData.averageBuyPrice()}</div>
                        <div>Average Sell price:</div>
                        <div>{botData.averageSellPrice()}</div>
                        <div>Last price:</div>
                        <div className='price'>{botData.lastPrice()}</div>
                        <div>Next target:</div>
                        <div className='target'>{botData.targetPrice()}</div>
                        <div>Stop Loss:</div>
                        <div className='sl'>{botData.stopLossPrice()}</div>
                    </div>
                </div>
                :""}
            </div>
        {botData.active()?
            <div className="flex flex-row justify-around w-full">
                
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Active Position
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Trading Pair:</div>
                        <div>
                            <img className='sm-24' src={botData.quoteAssetImage()}/>
                            <img className='sm-24' src={botData.baseAssetImage()} />
                            {botData.quoteAssetName()} - {botData.baseAssetName()}
                        </div>
                        <div>Current Quote Amount :</div>
                        <div>{botData.quoteAmount()}</div>
                        <div>Current Base Amount:</div>
                        <div>{botData.baseAmount()}</div>
                        <div>Time Entered:</div>
                        <div>{botData.timeEntered()}</div>
                    </div>
                </div>

                <div className="sd-group">
                    <div className="cb-rect-title">
                        Position Profit
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Current Profit %:</div>
                        <div>{botData.profit()}</div>
                        <div>Current Profit $:</div>
                        <div>{botData.usdProfit()}</div>
                        <div>Current Quote Amount :</div>
                        <div>{botData.quoteAmount()}</div>
                        <div>Current Base Amount:</div>
                        <div>{botData.baseAmount()}</div>
                        <div>Targets Sold:</div>
                        <div>{botData.targetSold()}</div>
                    </div>
                </div>
            </div>
        :""}
        {botData.active()?
            <div className="w-1/4">
                <GaugeChart id="gauge-chart5"
                    animate={false}
                    nrOfLevels={4}
                    arcsLength={[0.25, 0.25, 0.25,0.25]}
                    colors={[  '#EA4228','#5BE12C','#38C71B','#266D17']}
                    percent={botData.gaugePercent()}
                    arcPadding={0.02}
                    />
            </div>
        :""}    
        </div>
       
    )
}
